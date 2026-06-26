import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, TextField } from '@mui/material'
import { useIntl } from 'react-intl'
import {
  checkWritingCorrection,
  getWritingCorrectionKey,
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
  getUpdatedPendingSentence,
  sentenceWasCompletedByCurrentInput,
} from './utils/essaySentences'
import { getStoredEssayText, saveEssayText } from './utils/essayDraftStorage'
import { getTextareaCaretCoordinates } from './utils/textareaCaret'

const WRITING_LANGUAGE = 'Finnish'

const EssayTextInput = ({ sentenceSelectionRequest }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const [text, setText] = useState(getStoredEssayText)
  const [insertionHighlight, setInsertionHighlight] = useState(null)
  const pendingEditedSentenceRef = useRef(null)
  const completedSentencesRef = useRef([])
  const sentenceIdCounterRef = useRef(0)
  const textRef = useRef(text)
  const inputRef = useRef(null)
  const inputAreaRef = useRef(null)
  const applyingCorrectionSelectionRef = useRef(false)
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

  useEffect(() => {
    const {
      endOffset,
      isInsertion,
      sentenceId: sentenceIdToSelect,
      startOffset,
    } = sentenceSelectionRequest || {}

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
      input.focus()
      setInputSelection(input, selectionStart, selectionEnd)
      return
    }

    restoreUserSelection(input)

    const caretCoordinates = getTextareaCaretCoordinates(input, selectionStart)

    if (!caretCoordinates) {
      setInsertionHighlight(null)
      return
    }

    const inputRect = input.getBoundingClientRect()
    const inputAreaRect = inputAreaRef.current.getBoundingClientRect()

    setInsertionHighlight({
      fontFamily: caretCoordinates.fontFamily,
      fontSize: caretCoordinates.fontSize,
      left: inputRect.left - inputAreaRect.left + caretCoordinates.left,
      lineHeight: caretCoordinates.lineHeight,
      top: inputRect.top - inputAreaRect.top + caretCoordinates.top,
    })
  }, [sentenceSelectionRequest])

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
    setInsertionHighlight(null)
    saveUserSelection(e.target)

    const previousText = textRef.current
    const nextText = e.target.value
    const cursorIndex = e.target.selectionStart
    const pendingSentence = pendingEditedSentenceRef.current
    const editIndex = getFirstChangedIndex(previousText, nextText)
    const previousCompletedSentences = completedSentencesRef.current
    const nextCompletedSentences = updateCompletedSentences(nextText, editIndex)

    setText(nextText)
    textRef.current = nextText

    if (completedSentencesChanged(previousCompletedSentences, nextCompletedSentences)) {
      saveEssayText(nextText)
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

    setInsertionHighlight(null)
    saveUserSelection(e.target)

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
    setInsertionHighlight(null)
    commitPendingEditedSentence()
  }

  return (
    <Box className="essay-writing-input-area" ref={inputAreaRef}>
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
        onSelect={handleSelect}
        onScrollCapture={() => setInsertionHighlight(null)}
        placeholder={intl.formatMessage({ id: 'essay-textfield-placeholder' })}
        variant="outlined"
        className="essay-writing-input"
        data-cy="essay-writing-input"
      />
    </Box>
  )
}

export default EssayTextInput
