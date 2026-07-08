import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, TextField } from '@mui/material'
import { useIntl } from 'react-intl'
import {
  checkWritingCorrection,
  getWritingCorrectionKey,
  getWritingCorrectionWords,
  syncWritingCorrectionSuggestions,
  useCachedWritingCorrection,
} from 'Utilities/redux/writingCorrectionReducer'
import {
  addStableSentenceIds,
  completedSentencesChanged,
  cursorIsInsideSentence,
  getCompletedSentenceFromIndexes,
  getCompletedSentenceNearIndex,
  getCompletedSentences,
  getFirstChangedIndex,
  getSentencesWithNewCorrectionKeys,
  getUpdatedPendingSentence,
  sentenceWasCompletedByCurrentInput,
} from './utils/essaySentences'
import {
  findCorrectionGroupAtOffset,
  getCorrectedTextFromCorrectionEntry,
  getCorrectionGroupFocus,
} from './utils/correctionTokens'
import { getStoredEssayText, saveEssayText } from './utils/essayDraftStorage'
import { getTextareaCaretCoordinates } from './utils/textareaCaret'

const WRITING_LANGUAGE = 'Finnish'

const getEssayFocusFromSelection = (sentences, text, selectionStart, selectionEnd) => {
  const startIndex = Math.min(selectionStart, selectionEnd)
  const endIndex = Math.max(selectionStart, selectionEnd)
  const focusedSentence = getCompletedSentenceNearIndex(sentences, startIndex)

  if (!focusedSentence) return null

  if (startIndex !== endIndex) {
    const selectionOverlapsSentence =
      focusedSentence.startIndex < endIndex && focusedSentence.endIndex > startIndex

    if (!selectionOverlapsSentence) return null

    const startOffset =
      Math.max(startIndex, focusedSentence.startIndex) - focusedSentence.startIndex
    const endOffset = Math.min(endIndex, focusedSentence.endIndex) - focusedSentence.startIndex
    const selectedText = text.slice(
      focusedSentence.startIndex + startOffset,
      focusedSentence.startIndex + endOffset,
    )

    return {
      correctedText: null,
      focusedSentence: focusedSentence.text,
      focusedWord: selectedText.trim() || null,
      focusedWordId: null,
      originalText: focusedSentence.text,
      sentenceId: focusedSentence.sentenceId,
      selection: {
        endOffset,
        sentenceId: focusedSentence.sentenceId,
        selectedText,
        startOffset,
      },
    }
  }

  return null
}

const EssayTextInput = ({ onEssayFocusChange, onEssayTextChange, sentenceSelectionRequest }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const [text, setText] = useState(getStoredEssayText)
  const [insertionHighlight, setInsertionHighlight] = useState(null)
  const [isDeletionSelectionHighlighted, setIsDeletionSelectionHighlighted] = useState(false)
  const pendingEditedSentenceRef = useRef(null)
  const completedSentencesRef = useRef([])
  const sentenceIdCounterRef = useRef(0)
  const textRef = useRef(text)
  const inputRef = useRef(null)
  const inputAreaRef = useRef(null)
  const applyingCorrectionSelectionRef = useRef(false)
  const pastedTextRef = useRef(false)
  const restoredSavedTextRef = useRef(false)
  const userSelectionRef = useRef({
    end: text.length,
    start: text.length,
  })
  const correctionsByKey = useSelector(state => state.writingCorrection.correctionsByKey)

  const setInputSelection = (input, start, end) => {
    applyingCorrectionSelectionRef.current = true
    input.setSelectionRange(start, end)
    const resetApplyingCorrectionSelection = () => {
      applyingCorrectionSelectionRef.current = false
    }

    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(resetApplyingCorrectionSelection)
    } else {
      setTimeout(resetApplyingCorrectionSelection, 0)
    }
  }

  const saveUserSelection = input => {
    userSelectionRef.current = {
      end: input.selectionEnd,
      start: input.selectionStart,
    }
  }

  const restoreUserSelection = input => {
    const inputLength = input.value.length
    const selectionStart = Math.min(userSelectionRef.current.start, inputLength)
    const selectionEnd = Math.min(userSelectionRef.current.end, inputLength)

    setInputSelection(input, selectionStart, selectionEnd)
  }

  const setDeletionSelectionHighlight = isDeletion => {
    setIsDeletionSelectionHighlighted(Boolean(isDeletion))
    inputAreaRef.current?.classList.toggle('essay-writing-input-area-deletion', Boolean(isDeletion))
  }

  const clearCorrectionHighlight = () => {
    setInsertionHighlight(null)
    setDeletionSelectionHighlight(false)
  }

  const clearInputSelection = () => {
    clearCorrectionHighlight()

    const input = inputRef.current

    if (!input?.setSelectionRange) return

    const caretPosition = input.selectionEnd ?? input.value.length

    userSelectionRef.current = {
      end: caretPosition,
      start: caretPosition,
    }
    setInputSelection(input, caretPosition, caretPosition)
  }

  // For a plain caret click, resolve the correction the caret lands on (if any) so that clicking a
  // corrected word focuses it and activates its bubble (the mirror of clicking a bubble).
  const getCorrectionFocusAtCaret = input => {
    const caret = input.selectionStart

    if (caret !== input.selectionEnd) return null

    const sentence = getCompletedSentenceNearIndex(completedSentencesRef.current, caret)

    if (!sentence) return null

    const correctionEntry = correctionsByKey[getWritingCorrectionKey(sentence)]

    if (!correctionEntry || correctionEntry.pending || correctionEntry.error) return null

    const corrections = getWritingCorrectionWords(correctionEntry.corrections)
    const group = findCorrectionGroupAtOffset(
      sentence.text,
      corrections,
      caret - sentence.startIndex,
    )

    if (!group) return null

    return {
      sentence,
      focus: {
        correctedText: getCorrectedTextFromCorrectionEntry(correctionEntry),
        focusedSentence: sentence.text,
        originalText: correctionEntry.text || sentence.text,
        sentenceId: sentence.sentenceId,
        ...getCorrectionGroupFocus(group),
        selection: {
          startOffset: group.range.startOffset,
          endOffset: group.range.endOffset,
          sentenceId: sentence.sentenceId,
          isDeletion: Boolean(group.range.isDeletion),
          isInsertion: Boolean(group.range.isInsertion),
        },
      },
    }
  }

  const updateEssayFocus = input => {
    const correctionFocus = getCorrectionFocusAtCaret(input)

    if (correctionFocus) {
      const { focus, sentence } = correctionFocus

      // Mirror the bubble -> text-area direction: highlight the correction range in the text area.
      setDeletionSelectionHighlight(focus.selection.isDeletion)
      setInputSelection(
        input,
        sentence.startIndex + focus.selection.startOffset,
        sentence.startIndex + focus.selection.endOffset,
      )
      onEssayFocusChange?.(focus)
      return
    }

    onEssayFocusChange?.(
      getEssayFocusFromSelection(
        completedSentencesRef.current,
        textRef.current,
        input.selectionStart,
        input.selectionEnd,
      ),
    )
  }

  useEffect(() => {
    const {
      endOffset,
      isDeletion,
      isInsertion,
      action,
      sentenceId: sentenceIdToSelect,
      startOffset,
    } = sentenceSelectionRequest || {}

    if (action === 'clear') {
      clearInputSelection()
      return
    }

    if (!sentenceIdToSelect) return

    const sentenceToSelect = completedSentencesRef.current.find(
      sentence => sentence.sentenceId === sentenceIdToSelect,
    )
    const input = inputRef.current

    if (!sentenceToSelect || !input?.setSelectionRange) return

    const hasCorrectionRange = Number.isInteger(startOffset) && Number.isInteger(endOffset)
    const selectionStart = hasCorrectionRange
      ? sentenceToSelect.startIndex + startOffset
      : sentenceToSelect.startIndex
    const selectionEnd = hasCorrectionRange
      ? sentenceToSelect.startIndex + endOffset
      : sentenceToSelect.endIndex

    if (!isInsertion || selectionStart !== selectionEnd || !inputAreaRef.current) {
      setInsertionHighlight(null)
      setDeletionSelectionHighlight(isDeletion)
      input.focus()
      setInputSelection(input, selectionStart, selectionEnd)
      return
    }

    setDeletionSelectionHighlight(false)
    restoreUserSelection(input)

    const caretCoordinates = getTextareaCaretCoordinates(input, selectionStart)

    if (!caretCoordinates) {
      setInsertionHighlight(null)
      return
    }

    const inputRect = input.getBoundingClientRect()
    const inputAreaRect = inputAreaRef.current.getBoundingClientRect()
    const fontSizePx = parseFloat(caretCoordinates.fontSize) || 0

    setInsertionHighlight({
      fontFamily: caretCoordinates.fontFamily,
      fontSize: caretCoordinates.fontSize,
      left: inputRect.left - inputAreaRect.left + caretCoordinates.left,
      lineHeight: caretCoordinates.lineHeight,
      top: inputRect.top - inputAreaRect.top + caretCoordinates.top + fontSizePx / 2,
    })
  }, [sentenceSelectionRequest])

  useEffect(() => {
    onEssayTextChange?.(textRef.current)
  }, [])

  const createSentenceId = () => {
    sentenceIdCounterRef.current += 1
    return `essay-sentence-${sentenceIdCounterRef.current}`
  }

  const updateCompletedSentences = (nextText, editIndex) => {
    const nextCompletedSentences = addStableSentenceIds({
      createSentenceId,
      editIndex,
      previousSentences: completedSentencesRef.current,
      sentences: getCompletedSentences(nextText),
    })

    completedSentencesRef.current = nextCompletedSentences
    dispatch(
      syncWritingCorrectionSuggestions(nextCompletedSentences.map(sentence => sentence.sentenceId)),
    )

    return nextCompletedSentences
  }

  const openCorrectionForSentence = sentence => {
    const nextCorrectionKey = getWritingCorrectionKey(sentence)

    if (correctionsByKey[nextCorrectionKey]) {
      dispatch(
        useCachedWritingCorrection({
          key: nextCorrectionKey,
          sentence: sentence.text,
          sentenceId: sentence.sentenceId,
        }),
      )
    } else {
      dispatch(
        checkWritingCorrection({
          language: WRITING_LANGUAGE,
          sentenceId: sentence.sentenceId,
          text: sentence.text,
          context: sentence.context,
        }),
      )
    }
  }

  useEffect(() => {
    if (restoredSavedTextRef.current || !textRef.current) return

    restoredSavedTextRef.current = true
    const restoredCompletedSentences = updateCompletedSentences(
      textRef.current,
      textRef.current.length,
    )

    restoredCompletedSentences.forEach(openCorrectionForSentence)
  }, [])

  const queueEditedSentence = sentence => {
    pendingEditedSentenceRef.current = sentence
  }

  const commitPendingEditedSentence = () => {
    const pendingSentence = pendingEditedSentenceRef.current

    if (!pendingSentence) return false

    const updatedSentence = getUpdatedPendingSentence(
      completedSentencesRef.current,
      pendingSentence,
    )
    pendingEditedSentenceRef.current = null

    if (!updatedSentence) {
      return false
    }

    openCorrectionForSentence(updatedSentence)
    return true
  }

  const handleChange = e => {
    clearCorrectionHighlight()
    onEssayFocusChange?.(null)
    saveUserSelection(e.target)

    const inputWasPasted = pastedTextRef.current || e.nativeEvent?.inputType === 'insertFromPaste'
    pastedTextRef.current = false

    const previousText = textRef.current
    const nextText = e.target.value
    const cursorIndex = e.target.selectionStart
    const pendingSentence = pendingEditedSentenceRef.current
    const editIndex = getFirstChangedIndex(previousText, nextText)
    const previousCompletedSentences = completedSentencesRef.current
    const nextCompletedSentences = updateCompletedSentences(nextText, editIndex)

    setText(nextText)
    textRef.current = nextText
    onEssayTextChange?.(nextText)

    if (completedSentencesChanged(previousCompletedSentences, nextCompletedSentences)) {
      saveEssayText(nextText)
    }

    if (inputWasPasted) {
      const sentencesToCorrect = getSentencesWithNewCorrectionKeys(
        previousCompletedSentences,
        nextCompletedSentences,
        getWritingCorrectionKey,
      )

      if (sentencesToCorrect.length) {
        pendingEditedSentenceRef.current = null
        sentencesToCorrect.forEach(openCorrectionForSentence)
        return
      }
    }

    if (pendingSentence) {
      const updatedPendingSentence = getUpdatedPendingSentence(
        nextCompletedSentences,
        pendingSentence,
      )

      if (!updatedPendingSentence) {
        pendingEditedSentenceRef.current = null
        return
      }

      if (cursorIsInsideSentence(updatedPendingSentence, cursorIndex)) {
        queueEditedSentence(updatedPendingSentence)
        return
      }

      pendingEditedSentenceRef.current = null
      openCorrectionForSentence(updatedPendingSentence)
      return
    }

    const previousCompletedSentenceAtEdit = getCompletedSentenceFromIndexes(
      previousCompletedSentences,
      [editIndex, editIndex - 1],
      previousText.length,
    )
    const completedSentenceAtEdit = getCompletedSentenceFromIndexes(
      nextCompletedSentences,
      [editIndex, editIndex - 1, cursorIndex, cursorIndex - 1],
      nextText.length,
    )
    const completedSentenceAtCursor = getCompletedSentenceNearIndex(
      nextCompletedSentences,
      cursorIndex,
    )
    const completedSentence = previousCompletedSentenceAtEdit
      ? completedSentenceAtEdit
      : completedSentenceAtCursor || completedSentenceAtEdit
    const previousCompletedSentenceAtCursor = getCompletedSentenceNearIndex(
      previousCompletedSentences,
      Math.min(cursorIndex, previousText.length),
    )
    const previousCompletedSentence =
      previousCompletedSentenceAtEdit || previousCompletedSentenceAtCursor

    if (!completedSentence) {
      if (previousCompletedSentence) {
        queueEditedSentence(previousCompletedSentence)
      }

      return
    }

    if (
      sentenceWasCompletedByCurrentInput({
        completedSentence,
        cursorIndex,
        nextCompletedSentences,
        nextText,
        previousCompletedSentences,
      })
    ) {
      openCorrectionForSentence(completedSentence)
      return
    }

    if (previousCompletedSentence && completedSentence) {
      if (
        getWritingCorrectionKey(previousCompletedSentence) !==
        getWritingCorrectionKey(completedSentence)
      ) {
        queueEditedSentence(completedSentence)
        return
      }

      if (cursorIsInsideSentence(completedSentence, cursorIndex)) {
        return
      }

      openCorrectionForSentence(completedSentence)
      return
    }

    if (cursorIsInsideSentence(completedSentence, cursorIndex)) {
      queueEditedSentence(completedSentence)
      return
    }

    openCorrectionForSentence(completedSentence)
  }

  const handleSelect = e => {
    if (applyingCorrectionSelectionRef.current) return

    clearCorrectionHighlight()
    saveUserSelection(e.target)
    updateEssayFocus(e.target)

    const pendingSentence = pendingEditedSentenceRef.current

    if (!pendingSentence) return

    const updatedPendingSentence = getUpdatedPendingSentence(
      completedSentencesRef.current,
      pendingSentence,
    )

    if (
      updatedPendingSentence &&
      cursorIsInsideSentence(updatedPendingSentence, e.target.selectionStart)
    ) {
      pendingEditedSentenceRef.current = updatedPendingSentence
      return
    }

    commitPendingEditedSentence()
  }

  const handleBlur = () => {
    commitPendingEditedSentence()
  }

  const handlePaste = () => {
    pastedTextRef.current = true

    setTimeout(() => {
      pastedTextRef.current = false
    }, 0)
  }

  return (
    <Box
      className={`essay-writing-input-area ${
        isDeletionSelectionHighlighted ? 'essay-writing-input-area-deletion' : ''
      }`}
      ref={inputAreaRef}
    >
      {insertionHighlight && (
        <Box
          component="span"
          className="essay-writing-insertion-highlight"
          style={{
            fontFamily: insertionHighlight.fontFamily,
            fontSize: insertionHighlight.fontSize,
            left: insertionHighlight.left,
            lineHeight: insertionHighlight.lineHeight,
            top: insertionHighlight.top,
          }}
        />
      )}
      <TextField
        fullWidth
        multiline
        value={text}
        inputRef={inputRef}
        onBlur={handleBlur}
        onChange={handleChange}
        onClick={handleSelect}
        onKeyUp={handleSelect}
        onPaste={handlePaste}
        onSelect={handleSelect}
        onScrollCapture={clearCorrectionHighlight}
        placeholder={intl.formatMessage({ id: 'essay-textfield-placeholder' })}
        variant="outlined"
        className="essay-writing-input"
        data-cy="essay-writing-input"
      />
    </Box>
  )
}

export default EssayTextInput
