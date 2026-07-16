import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, TextField } from '@mui/material'
import { useIntl } from 'react-intl'
import {
  checkWritingCorrection,
  getWritingCorrectionKey,
  getWritingCorrectionSession,
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
  getEssayFocusFromSelection,
  getFirstChangedIndex,
  getSentencesWithNewCorrectionKeys,
  getUpdatedPendingSentence,
  sentenceWasCompletedByCurrentInput,
} from './utils/essaySentences'
import {
  findCorrectionGroupAtOffset,
  findInsertionGroupInRegion,
  getCorrectedTextFromCorrectionEntry,
  getCorrectionGroupFocus,
  getCorrectionGroups,
  getCorrectionGroupType,
} from './utils/correctionTokens'
import { getStoredEssayText, saveEssayText } from './utils/essayDraftStorage'
import { getTextareaRangeRects } from './utils/textareaCaret'
import { normalizeEssayInput } from './utils/normalizeEssayInput'
import { capitalize, useLearningLanguage } from 'Utilities/common'

const MIN_WORD_HIGHLIGHT_WIDTH = 14
const MIN_INSERTION_UNDERLINE_WIDTH = 12

// The character span covering the word before + the word after an insertion point (the gap between
// them included), so the insertion highlight can mark the two words it should be inserted between.
const getInsertionSurroundingSpan = (text, offset) => {
  const isSpace = index => index >= 0 && index < text.length && /\s/.test(text[index])

  let start = Math.max(0, Math.min(offset, text.length))
  while (start > 0 && isSpace(start - 1)) start -= 1
  while (start > 0 && !isSpace(start - 1)) start -= 1

  let end = Math.max(0, Math.min(offset, text.length))
  while (end < text.length && isSpace(end)) end += 1
  while (end < text.length && !isSpace(end)) end += 1

  return { start, end }
}

// The whitespace gap around an insertion point — the actual "missing spot" the underline marks.
const getInsertionGapSpan = (text, offset) => {
  const isSpace = index => index >= 0 && index < text.length && /\s/.test(text[index])

  let start = Math.max(0, Math.min(offset, text.length))
  while (start > 0 && isSpace(start - 1)) start -= 1

  let end = Math.max(0, Math.min(offset, text.length))
  while (end < text.length && isSpace(end)) end += 1

  return { start, end }
}

const EssayTextInput = ({ onEssayFocusChange, onEssayTextChange, sentenceSelectionRequest }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const [text, setText] = useState(getStoredEssayText)
  const [isDeletionSelectionHighlighted, setIsDeletionSelectionHighlighted] = useState(false)
  const [hoveredWordHighlight, setHoveredWordHighlight] = useState(null)
  const [selectedWordHighlight, setSelectedWordHighlight] = useState(null)
  const correctionRectsRef = useRef([])
  const correctionRectsStaleRef = useRef(true)
  const selectedGroupKeyRef = useRef(null)
  const scrollFrameRef = useRef(null)
  const correctionsByKeyRef = useRef(null)
  const writingSessionIdRef = useRef('')
  const writingSessionPendingRef = useRef(false)
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
  const writingSessionId = useSelector(state => state.writingCorrection.sessionId)
  const writingSessionPending = useSelector(state => state.writingCorrection.sessionPending)
  const learningLanguage = useLearningLanguage()

  correctionsByKeyRef.current = correctionsByKey
  writingSessionIdRef.current = writingSessionId
  writingSessionPendingRef.current = writingSessionPending

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

  const setDeletionSelectionHighlight = isDeletion => {
    setIsDeletionSelectionHighlighted(Boolean(isDeletion))
    inputAreaRef.current?.classList.toggle('essay-writing-input-area-deletion', Boolean(isDeletion))
  }

  const clearCorrectionHighlight = () => {
    setDeletionSelectionHighlight(false)
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
    const offset = caret - sentence.startIndex

    const group =
      findCorrectionGroupAtOffset(sentence.text, corrections, offset) ||
      findInsertionGroupInRegion(sentence.text, corrections, offset)

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
      const { startOffset, endOffset } = focus.selection

      if (correctionRectsStaleRef.current) computeCorrectionRects()
      selectedGroupKeyRef.current = `${sentence.sentenceId}:${startOffset}:${endOffset}`
      refreshSelectedHighlight()
      onEssayFocusChange?.(focus)
      return
    }

    clearSelectedHighlight()
    onEssayFocusChange?.(
      getEssayFocusFromSelection(
        completedSentencesRef.current,
        textRef.current,
        input.selectionStart,
        input.selectionEnd,
      ),
    )
  }

  // Bubble interactions (click/hover/leave/clear) drive the same overlays used when a word is
  // clicked/hovered in the text: click = persistent highlight, hover = transient. Works for both
  // words (box) and insertions (caret-bar), so the two entry points match.
  useEffect(() => {
    const {
      action,
      endOffset,
      interactionType,
      sentenceId: sentenceIdToSelect,
      startOffset,
    } = sentenceSelectionRequest || {}

    if (action === 'clear') {
      clearSelectedHighlight()
      setHoveredWordHighlight(null)
      return
    }

    if (!sentenceIdToSelect || !Number.isInteger(startOffset) || !Number.isInteger(endOffset)) {
      return
    }

    if (correctionRectsStaleRef.current) computeCorrectionRects()

    const key = `${sentenceIdToSelect}:${startOffset}:${endOffset}`
    const group = correctionRectsRef.current.find(candidate => candidate.key === key)

    if (interactionType === 'hover') {
      setHoveredWordHighlight(group || null)
      return
    }

    setHoveredWordHighlight(null)
    selectedGroupKeyRef.current = key
    refreshSelectedHighlight()
  }, [sentenceSelectionRequest])

  useEffect(() => {
    onEssayTextChange?.(textRef.current)
  }, [])

  // Fetch a backend session id for this writing session (to track correction + chatbot history).
  useEffect(() => {
    if (learningLanguage) dispatch(getWritingCorrectionSession(capitalize(learningLanguage)))
  }, [learningLanguage])

  useEffect(() => {
    correctionRectsStaleRef.current = true
  }, [text, correctionsByKey])

  useEffect(() => {
    const input = inputRef.current

    if (!input || !window.ResizeObserver) return undefined

    const observer = new window.ResizeObserver(() => {
      correctionRectsStaleRef.current = true
      setHoveredWordHighlight(null)

      if (selectedGroupKeyRef.current) {
        computeCorrectionRects()
        refreshSelectedHighlight()
      }
    })

    observer.observe(input)

    return () => observer.disconnect()
  }, [])

  useEffect(
    () => () => {
      if (scrollFrameRef.current) window.cancelAnimationFrame(scrollFrameRef.current)
    },
    [],
  )

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

  // Re-fetch the session id if a correction needs it but the initial fetch failed. Guarded on the
  // pending flag so a burst of corrections can't race several fetches (each mints a different id).
  const ensureWritingSession = () => {
    if (!learningLanguage || writingSessionIdRef.current || writingSessionPendingRef.current) return
    // Mark in-flight now so a same-tick burst of corrections doesn't fire several fetches before
    // the pending flag round-trips through Redux.
    writingSessionPendingRef.current = true
    dispatch(getWritingCorrectionSession(capitalize(learningLanguage)))
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
      ensureWritingSession()
      dispatch(
        checkWritingCorrection({
          language: capitalize(learningLanguage),
          sentenceId: sentence.sentenceId,
          text: sentence.text,
          context: sentence.context,
          sessionId: writingSessionIdRef.current,
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
    const input = e.target
    const rawValue = input.value
    const rawCaret = input.selectionStart

    // Normalize the input on-site (NFC compose, strip invisibles, fold look-alike hyphens) unless
    // mid-IME composition. Normalization can change length, so recompute the caret from the
    // normalized prefix and keep it in place.
    const normalizedValue = e.nativeEvent?.isComposing ? rawValue : normalizeEssayInput(rawValue)
    if (normalizedValue !== rawValue) {
      const normalizedCaret = normalizeEssayInput(rawValue.slice(0, rawCaret)).length
      input.value = normalizedValue
      setInputSelection(input, normalizedCaret, normalizedCaret)
    }

    clearCorrectionHighlight()
    onEssayFocusChange?.(null)
    saveUserSelection(e.target)

    correctionRectsStaleRef.current = true
    setHoveredWordHighlight(null)
    clearSelectedHighlight()

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

  // Measure a pixel rectangle for every corrected word (offset → pixels via the caret mirror) so
  // hovering is a cheap geometric hit-test, not the unreliable point → offset APIs. Recomputed
  // lazily (only when marked stale) to avoid measuring on every mouse move.
  const computeCorrectionRects = () => {
    correctionRectsStaleRef.current = false

    const input = inputRef.current
    const inputArea = inputAreaRef.current

    if (!input || !inputArea) {
      correctionRectsRef.current = []
      return
    }

    const corrections = correctionsByKeyRef.current || {}
    const wordRanges = []
    const insertionPoints = []

    completedSentencesRef.current.forEach(sentence => {
      const correctionEntry = corrections[getWritingCorrectionKey(sentence)]

      if (!correctionEntry || correctionEntry.pending || correctionEntry.error) return

      getCorrectionGroups(
        sentence.text,
        getWritingCorrectionWords(correctionEntry.corrections),
      ).forEach(group => {
        const range = group.range

        if (!range || !Number.isInteger(range.startOffset) || !Number.isInteger(range.endOffset)) {
          return
        }

        const key = `${sentence.sentenceId}:${range.startOffset}:${range.endOffset}`

        if (range.endOffset > range.startOffset) {
          wordRanges.push({
            key,
            type: getCorrectionGroupType(group) || 'replacement',
            start: sentence.startIndex + range.startOffset,
            end: sentence.startIndex + range.endOffset,
          })
        } else {
          insertionPoints.push({ key, offset: sentence.startIndex + range.startOffset })
        }
      })
    })

    const inputRect = input.getBoundingClientRect()
    const inputAreaRect = inputArea.getBoundingClientRect()
    const originLeft = inputRect.left - inputAreaRect.left
    const originTop = inputRect.top - inputAreaRect.top

    const wordGroups = getTextareaRangeRects(input, wordRanges).map(group => ({
      key: group.key,
      type: group.type,
      rects: group.rects.map(rect => {
        const width = Math.max(rect.width, MIN_WORD_HIGHLIGHT_WIDTH)

        return {
          left: originLeft + rect.left - (width - rect.width) / 2,
          top: originTop + rect.top,
          width,
          height: rect.height,
        }
      }),
    }))

    const insertionGroups = insertionPoints
      .map(({ key, offset }) => {
        const span = getInsertionSurroundingSpan(input.value, offset)

        if (span.end <= span.start) return null

        const measured = getTextareaRangeRects(input, [
          { key, type: 'insertion', start: span.start, end: span.end },
        ])[0]

        if (!measured || !measured.rects.length) return null

        const gap = getInsertionGapSpan(input.value, offset)
        const gapMeasured =
          gap.end > gap.start
            ? getTextareaRangeRects(input, [
                { key, type: 'insertion', start: gap.start, end: gap.end },
              ])[0]
            : null

        return {
          key,
          type: 'insertion',
          rects: measured.rects.map(rect => ({
            left: originLeft + rect.left,
            top: originTop + rect.top,
            width: rect.width,
            height: rect.height,
          })),
          underlineRects: (gapMeasured?.rects || []).map(rect => {
            const width = Math.max(rect.width, MIN_INSERTION_UNDERLINE_WIDTH)

            return {
              left: originLeft + rect.left - (width - rect.width) / 2,
              top: originTop + rect.glyphBottom - 3,
              width,
            }
          }),
        }
      })
      .filter(Boolean)

    correctionRectsRef.current = [...wordGroups, ...insertionGroups]
  }

  const rectsContainPoint = (rects, x, y) =>
    rects.some(
      rect =>
        x >= rect.left &&
        x <= rect.left + rect.width &&
        y >= rect.top &&
        y <= rect.top + rect.height,
    )

  // Re-derive the persistent selected highlight from the freshly measured rects, keyed by the
  // selected group.
  const refreshSelectedHighlight = () => {
    const key = selectedGroupKeyRef.current
    const group = key && correctionRectsRef.current.find(candidate => candidate.key === key)

    setSelectedWordHighlight(group || null)
  }

  const clearSelectedHighlight = () => {
    selectedGroupKeyRef.current = null
    setSelectedWordHighlight(null)
  }

  const handleTextMouseMove = event => {
    const inputArea = inputAreaRef.current

    if (!inputArea) return

    if (correctionRectsStaleRef.current) {
      computeCorrectionRects()
    }

    const inputAreaRect = inputArea.getBoundingClientRect()
    const x = event.clientX - inputAreaRect.left
    const y = event.clientY - inputAreaRect.top
    const hoveredGroup = correctionRectsRef.current.find(group =>
      rectsContainPoint(group.rects, x, y),
    )

    setHoveredWordHighlight(previous => {
      if (!hoveredGroup) return previous ? null : previous
      if (previous && previous.key === hoveredGroup.key) return previous

      return hoveredGroup
    })
  }

  const handleTextMouseLeave = () => {
    setHoveredWordHighlight(null)
  }

  const renderWordHighlights = (highlight, variant) => {
    if (!highlight) return null

    return (
      <>
        {highlight.rects.map((rect, index) => (
          <Box
            key={`${variant}-${highlight.key}-${index}`}
            component="span"
            className={[
              'essay-writing-word-highlight',
              `essay-writing-word-highlight-${highlight.type}`,
              `essay-writing-word-highlight-${variant}`,
            ].join(' ')}
            style={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
          />
        ))}
        {highlight.underlineRects?.map((rect, index) => (
          <Box
            key={`underline-${variant}-${highlight.key}-${index}`}
            component="span"
            className="essay-writing-insertion-underline"
            style={{ top: rect.top, left: rect.left, width: rect.width }}
          />
        ))}
      </>
    )
  }

  return (
    <Box
      className={`essay-writing-input-area ${
        isDeletionSelectionHighlighted ? 'essay-writing-input-area-deletion' : ''
      }`}
      ref={inputAreaRef}
    >
      {renderWordHighlights(selectedWordHighlight, 'selected')}
      {hoveredWordHighlight?.key !== selectedWordHighlight?.key &&
        renderWordHighlights(hoveredWordHighlight, 'hover')}
      <TextField
        fullWidth
        multiline
        value={text}
        inputRef={inputRef}
        onBlur={handleBlur}
        onChange={handleChange}
        onClick={handleSelect}
        onKeyUp={handleSelect}
        onMouseLeave={handleTextMouseLeave}
        onMouseMove={handleTextMouseMove}
        onPaste={handlePaste}
        onSelect={handleSelect}
        onScrollCapture={() => {
          correctionRectsStaleRef.current = true
          setHoveredWordHighlight(null)

          if (!selectedGroupKeyRef.current || scrollFrameRef.current) return

          scrollFrameRef.current = window.requestAnimationFrame(() => {
            scrollFrameRef.current = null
            computeCorrectionRects()
            refreshSelectedHighlight()
          })
        }}
        placeholder={intl.formatMessage({ id: 'essay-textfield-placeholder' })}
        variant="outlined"
        className="essay-writing-input"
        data-cy="essay-writing-input"
      />
    </Box>
  )
}

export default EssayTextInput
