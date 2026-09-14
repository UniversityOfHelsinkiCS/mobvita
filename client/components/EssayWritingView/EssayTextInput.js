import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, TextField } from '@mui/material'
import { useIntl } from 'react-intl'
import {
  checkWritingCorrection,
  getWritingCorrectionKey,
  getWritingCorrectionSession,
  getWritingCorrectionWords,
  inheritWritingSentenceHistory,
  recordWritingRemovedSentences,
  restoreWritingSentenceLineage,
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
  getEssayFocusFromCaretWord,
  getEssayFocusFromGlyph,
  getEditSpan,
  getEssayFocusFromTextRange,
  getFirstChangedIndex,
  getSentencesWithNewCorrectionKeys,
  getDeletedSentences,
  getSentenceRestructure,
  getUpdatedPendingSentence,
  sentenceWasCompletedByCurrentInput,
} from './utils/essaySentences'
import {
  findCorrectionGroupAtOffset,
  findInsertionGroupAtOffset,
  getCorrectedTextFromCorrectionEntry,
  getCorrectionGroupChatFeedbackText,
  getCorrectionGroupFocus,
  getCorrectionGroups,
  getCorrectionGroupType,
  getInsertionSurroundingSpan,
} from './utils/correctionTokens'
import { getStoredEssayText, saveEssayText } from './utils/essayDraftStorage'
import { getTextareaRangeRects } from './utils/textareaCaret'
import { normalizeEssayInput } from './utils/normalizeEssayInput'
import { capitalize, useLearningLanguage } from 'Utilities/common'

const MIN_WORD_HIGHLIGHT_WIDTH = 14
const MIN_INSERTION_UNDERLINE_WIDTH = 12
// How many times to re-fetch the writing session before giving up and correcting without it, so a
// failing session endpoint can't block corrections forever.
const MAX_SESSION_ATTEMPTS = 2

// The whitespace gap around an insertion point — the actual "missing spot" the underline marks.
const getInsertionGapSpan = (text, offset) => {
  const isSpace = index => index >= 0 && index < text.length && /\s/.test(text[index])

  let start = Math.max(0, Math.min(offset, text.length))
  while (start > 0 && isSpace(start - 1)) start -= 1

  let end = Math.max(0, Math.min(offset, text.length))
  while (end < text.length && isSpace(end)) end += 1

  return { start, end }
}

const EssayTextInput = ({
  focusLocked,
  onEssayFocusChange,
  onEssayTextChange,
  restoredRemovedSentences,
  restoredSentenceLineage,
  sentenceSelectionRequest,
}) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const [text, setText] = useState(getStoredEssayText)
  const [isDeletionSelectionHighlighted, setIsDeletionSelectionHighlighted] = useState(false)
  const [isPassagePinned, setIsPassagePinned] = useState(false)
  const [hoveredWordHighlight, setHoveredWordHighlight] = useState(null)
  const [selectedWordHighlight, setSelectedWordHighlight] = useState(null)
  const correctionRectsRef = useRef([])
  const correctionRectsStaleRef = useRef(true)
  // What the overlay keeps highlighted: { key, type, start, end } in absolute text offsets (an
  // insertion is zero-width). Held by position, not by correction entry, so edits can move it.
  const pinnedHighlightRef = useRef(null)
  const scrollContentRef = useRef(null)
  const correctionsByKeyRef = useRef(null)
  const writingSessionIdRef = useRef('')
  const writingSessionPendingRef = useRef(false)
  const deferredCorrectionsRef = useRef([])
  const sessionAttemptsRef = useRef(0)
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

  // The correction at the caret (or, for a click, under the pointer's glyph), so that clicking a
  // corrected word focuses it and activates its bubble (the mirror of clicking a bubble).
  const getCorrectionFocusAtCaret = (input, glyphIndex = null) => {
    const caret = input.selectionStart

    if (caret !== input.selectionEnd) return null

    const glyph = glyphIndex !== null
    const index = glyph ? glyphIndex : caret
    const sentence = getCompletedSentenceNearIndex(completedSentencesRef.current, index)

    if (!sentence) return null

    const correctionEntry = correctionsByKey[getWritingCorrectionKey(sentence)]

    if (!correctionEntry || correctionEntry.pending || correctionEntry.error) return null

    const corrections = getWritingCorrectionWords(correctionEntry.corrections)
    const offset = index - sentence.startIndex

    const group =
      findCorrectionGroupAtOffset(sentence.text, corrections, offset, { glyph }) ||
      findInsertionGroupAtOffset(sentence.text, corrections, offset, { glyph })

    if (!group) return null

    return {
      group,
      sentence,
      focus: {
        correctedText: getCorrectedTextFromCorrectionEntry(correctionEntry),
        feedbackText: getCorrectionGroupChatFeedbackText(group),
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

  const findSentenceById = sentenceId =>
    completedSentencesRef.current.find(sentence => sentence.sentenceId === sentenceId) || null

  // Pin the highlight over a selected passage — a clicked word or a dragged range.
  const setSelectedRangeHighlight = (start, end) => {
    pinnedHighlightRef.current = { key: `selection:${start}:${end}`, type: 'selection', start, end }
    refreshSelectedHighlight()
  }

  // Pin a correction's highlight by where it sits in the text. Keyed like the hover groups so the
  // hover overlay knows when it is over the pinned one.
  const pinCorrectionHighlight = (sentence, { startOffset, endOffset }, type) => {
    const key = `${sentence.sentenceId}:${startOffset}:${endOffset}`
    const start = sentence.startIndex + startOffset
    const end = sentence.startIndex + endOffset

    if (type === 'insertion') {
      const text = textRef.current
      const span = getInsertionSurroundingSpan(text, start)
      const gap = getInsertionGapSpan(text, start)
      const before = { start: span.start, end: gap.start }
      const after = { start: gap.end, end: span.end }

      pinnedHighlightRef.current = { key, type, before, after, start: before.start, end: after.end }
    } else {
      pinnedHighlightRef.current = { key, type, start, end }
    }

    refreshSelectedHighlight()
  }

  // `fromPointer` marks a click: only then does the caret select the word it landed on, so typing
  // and arrow-key navigation don't keep flipping the chatbot to whatever word they cross.
  // `commitRange` marks the end of a selecting gesture (the click a drag ends on, a key-up): only
  // then is a dragged range taken, not on each `select` event fired while it is still growing.
  const updateEssayFocus = (
    input,
    { fromPointer = false, commitRange = false, glyphIndex = null } = {},
  ) => {
    if (input.selectionStart !== input.selectionEnd) {
      if (!commitRange) return

      const rangeFocus = getEssayFocusFromTextRange(
        completedSentencesRef.current,
        textRef.current,
        input.selectionStart,
        input.selectionEnd,
      )

      if (!rangeFocus) return

      if (fromPointer) {
        setInputSelection(input, rangeFocus.selection.start, rangeFocus.selection.end)
      }

      setSelectedRangeHighlight(rangeFocus.selection.start, rangeFocus.selection.end)
      onEssayFocusChange?.(rangeFocus)
      return
    }

    const correctionFocus = getCorrectionFocusAtCaret(input, glyphIndex)

    if (correctionFocus) {
      const { focus, group, sentence } = correctionFocus

      pinCorrectionHighlight(
        sentence,
        focus.selection,
        focus.selection.isInsertion ? 'insertion' : getCorrectionGroupType(group) || 'replacement',
      )
      onEssayFocusChange?.(focus)
      return
    }

    // Clicking a word with nothing wrong with it selects that word, the way clicking a corrected
    // one selects its correction. By the letter under the pointer when there is one: the caret
    // lands at the word's edge for a click on its first letter and for one in the space before it.
    let wordFocus = null

    if (fromPointer) {
      wordFocus =
        glyphIndex !== null
          ? getEssayFocusFromGlyph(completedSentencesRef.current, textRef.current, glyphIndex)
          : getEssayFocusFromCaretWord(
              completedSentencesRef.current,
              textRef.current,
              input.selectionStart,
            )
    }

    if (wordFocus) {
      const sentence = findSentenceById(wordFocus.sentenceId)

      if (sentence) {
        setSelectedRangeHighlight(
          sentence.startIndex + wordFocus.selection.startOffset,
          sentence.startIndex + wordFocus.selection.endOffset,
        )
      }

      onEssayFocusChange?.(wordFocus)
      return
    }

    // A bare caret elsewhere: leave a pinned focus alone, otherwise there is nothing to focus.
    if (focusLocked) return

    clearSelectedHighlight()
    onEssayFocusChange?.(null)
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

    // The pinned highlight is not cleared here: it follows the focus (below), so a clear aimed at a
    // focus that has since been replaced cannot wipe the replacement's highlight.
    if (action === 'clear') {
      setHoveredWordHighlight(null)
      return
    }

    if (!sentenceIdToSelect || !Number.isInteger(startOffset) || !Number.isInteger(endOffset)) {
      return
    }

    if (correctionRectsStaleRef.current) {
      computeCorrectionRects()
      refreshSelectedHighlight()
    }

    const key = `${sentenceIdToSelect}:${startOffset}:${endOffset}`
    const group = correctionRectsRef.current.find(candidate => candidate.key === key)

    if (interactionType === 'hover') {
      setHoveredWordHighlight(group || null)
      return
    }

    setHoveredWordHighlight(null)

    const sentence = findSentenceById(sentenceIdToSelect)

    if (!sentence) {
      clearSelectedHighlight()
      return
    }

    pinCorrectionHighlight(
      sentence,
      { startOffset, endOffset },
      group?.type || (startOffset === endOffset ? 'insertion' : 'replacement'),
    )
  }, [sentenceSelectionRequest])

  useEffect(() => {
    onEssayTextChange?.(textRef.current, completedSentencesRef.current)
  }, [])

  // Fetch a backend session id for this writing session (to track correction + chatbot history).
  // Mark pending synchronously so a correction fired on the same tick (e.g. restored text) defers
  // instead of kicking off a second fetch.
  useEffect(() => {
    if (!learningLanguage) return
    writingSessionPendingRef.current = true
    dispatch(getWritingCorrectionSession(capitalize(learningLanguage)))
  }, [learningLanguage])

  // Once the session id resolves, run the corrections held while it loaded so they carry session_id.
  // If the fetch settles without one, retry a few times, then correct without it so nothing sticks.
  useEffect(() => {
    if (!deferredCorrectionsRef.current.length) return

    if (writingSessionId) {
      sessionAttemptsRef.current = 0
      flushDeferredCorrections()
      return
    }

    if (writingSessionPending) return

    if (sessionAttemptsRef.current < MAX_SESSION_ATTEMPTS) {
      sessionAttemptsRef.current += 1
      ensureWritingSession()
      return
    }

    flushDeferredCorrections()
  }, [writingSessionId, writingSessionPending])

  useEffect(() => {
    correctionRectsStaleRef.current = true
  }, [text, correctionsByKey])

  // The pinned highlight lives exactly as long as the focus it belongs to.
  useEffect(() => {
    if (!focusLocked) clearSelectedHighlight()
  }, [focusLocked])

  useEffect(() => {
    const input = inputRef.current

    if (!input || !window.ResizeObserver) return undefined

    const observer = new window.ResizeObserver(() => {
      correctionRectsStaleRef.current = true
      setHoveredWordHighlight(null)

      if (pinnedHighlightRef.current) {
        computeCorrectionRects()
        refreshSelectedHighlight()
      }
    })

    observer.observe(input)

    return () => observer.disconnect()
  }, [])

  const createSentenceId = () => {
    sentenceIdCounterRef.current += 1
    return `essay-sentence-${sentenceIdCounterRef.current}`
  }

  const updateCompletedSentences = (nextText, editIndex) => {
    const previousCompletedSentences = completedSentencesRef.current
    const nextCompletedSentences = addStableSentenceIds({
      createSentenceId,
      editIndex,
      previousSentences: previousCompletedSentences,
      sentences: getCompletedSentences(nextText),
    })

    completedSentencesRef.current = nextCompletedSentences
    dispatch(
      syncWritingCorrectionSuggestions(nextCompletedSentences.map(sentence => sentence.sentenceId)),
    )

    // Splitting or merging replaces sentences rather than editing one. What comes out inherits the
    // history of the first sentence that went in, and any others that went in are kept as removed
    // — between them the essay's original still holds every sentence that was written.
    const restructure = getSentenceRestructure(previousCompletedSentences, nextCompletedSentences)

    if (restructure.sentenceIds.length) {
      dispatch(
        inheritWritingSentenceHistory(restructure.sentenceIds, restructure.inheritedFromSentenceId),
      )
    }

    if (restructure.removedSentences.length) {
      dispatch(recordWritingRemovedSentences(restructure.removedSentences))
    }

    // A deleted sentence leaves the editor but not the essay: it is kept, anchored to whatever now
    // stands after it, so the save can put it back in place flagged removed.
    const deletedSentences = getDeletedSentences(previousCompletedSentences, nextCompletedSentences)

    if (deletedSentences.length) {
      dispatch(recordWritingRemovedSentences(deletedSentences))
    }

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

  const dispatchWritingCorrection = sentence => {
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

  // Run any corrections that were held while the session id was still loading, now that it's known.
  const flushDeferredCorrections = () => {
    const deferred = deferredCorrectionsRef.current
    deferredCorrectionsRef.current = []
    deferred.forEach(sentence => dispatchWritingCorrection(sentence))
  }

  // Ask for this sentence's correction. Whether the response continues the sentence's backend-id
  // history or starts a new one is decided in the reducer from the sentence id's own lineage.
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
      return
    }

    if (writingSessionIdRef.current) {
      dispatchWritingCorrection(sentence)
      return
    }

    // No session id yet: fetch it and hold this correction (deduped by key) until it arrives, so the
    // request doesn't go out with an empty session_id. Flushed by the session effect below.
    ensureWritingSession()
    deferredCorrectionsRef.current = [
      ...deferredCorrectionsRef.current.filter(
        deferred => getWritingCorrectionKey(deferred) !== nextCorrectionKey,
      ),
      sentence,
    ]
  }

  useEffect(() => {
    if (restoredSavedTextRef.current || !textRef.current) return

    restoredSavedTextRef.current = true
    const restoredCompletedSentences = updateCompletedSentences(
      textRef.current,
      textRef.current.length,
    )

    // Continuing a saved essay: pair its stored lineage with the sentence ids just minted for the
    // restored text, before any correction comes back. Skipped when the counts disagree — the essay
    // would then be re-split differently and pairing by position would attach the wrong histories.
    if (restoredSentenceLineage?.length === restoredCompletedSentences.length) {
      dispatch(
        restoreWritingSentenceLineage(
          Object.fromEntries(
            restoredCompletedSentences.map((sentence, index) => [
              sentence.sentenceId,
              restoredSentenceLineage[index],
            ]),
          ),
          // Sentences already deleted in an earlier session: anchor each to the sentence it sits in
          // front of, now that the editor has minted ids for the surviving ones.
          (restoredRemovedSentences ?? []).map(removed => ({
            ...removed,
            anchorSentenceId:
              restoredCompletedSentences[removed.followingIndex]?.sentenceId ?? null,
          })),
        ),
      )
    }

    onEssayTextChange?.(textRef.current, restoredCompletedSentences)
    restoredCompletedSentences.forEach(sentence => openCorrectionForSentence(sentence))
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
    saveUserSelection(e.target)

    correctionRectsStaleRef.current = true
    setHoveredWordHighlight(null)

    const inputWasPasted = pastedTextRef.current || e.nativeEvent?.inputType === 'insertFromPaste'
    pastedTextRef.current = false

    const previousText = textRef.current
    const nextText = e.target.value
    const selectionEnded = carrySelectedRangeThroughEdit(
      previousText,
      nextText,
      e.target.selectionStart,
    )

    if (selectionEnded || !focusLocked) onEssayFocusChange?.(null)
    const cursorIndex = e.target.selectionStart
    const pendingSentence = pendingEditedSentenceRef.current
    const editIndex = getFirstChangedIndex(previousText, nextText)
    const previousCompletedSentences = completedSentencesRef.current
    const nextCompletedSentences = updateCompletedSentences(nextText, editIndex)

    setText(nextText)
    textRef.current = nextText
    onEssayTextChange?.(nextText, nextCompletedSentences)

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
        sentencesToCorrect.forEach(sentence => openCorrectionForSentence(sentence))
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

  // While the browser's selection is exactly the passage the overlay shows, hide the browser's own
  // highlight — otherwise the passage is painted twice, once in each colour.
  const syncNativeSelectionHighlight = input => {
    const pinned = pinnedHighlightRef.current

    setIsPassagePinned(
      Boolean(pinned) &&
        pinned.start !== pinned.end &&
        input.selectionStart === pinned.start &&
        input.selectionEnd === pinned.end,
    )
  }

  const handleSelect = (e, { fromPointer = false, commitRange = false, pointer = null } = {}) => {
    if (applyingCorrectionSelectionRef.current) return

    clearCorrectionHighlight()
    saveUserSelection(e.target)
    updateEssayFocus(e.target, {
      fromPointer,
      commitRange,
      glyphIndex: pointer ? getGlyphIndexAtPointer(e.target, pointer) : null,
    })
    syncNativeSelectionHighlight(e.target)

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

  // The click a drag ends on still carries the dragged range, and a key-up is where a shift+arrow
  // (or select-all) selection has settled — both end a selecting gesture.
  const handleClick = e =>
    handleSelect(e, {
      fromPointer: true,
      commitRange: true,
      pointer: { x: e.clientX, y: e.clientY },
    })
  const handleKeyUp = e => handleSelect(e, { commitRange: true })

  const handleBlur = () => {
    commitPendingEditedSentence()
  }

  const handlePaste = () => {
    pastedTextRef.current = true

    setTimeout(() => {
      pastedTextRef.current = false
    }, 0)
  }

  // Where the textarea's top-left sits inside the scroll content — the overlay's coordinate origin.
  const getHighlightOrigin = () => {
    const input = inputRef.current
    const scrollContent = scrollContentRef.current

    if (!input || !scrollContent) return null

    const inputRect = input.getBoundingClientRect()
    const scrollContentRect = scrollContent.getBoundingClientRect()

    return {
      input,
      left: inputRect.left - scrollContentRect.left,
      top: inputRect.top - scrollContentRect.top,
    }
  }

  // A measured word range → overlay boxes, widened to a minimum so a one-letter word is hittable.
  const toWordHighlight = (measured, origin) => ({
    key: measured.key,
    type: measured.type,
    rects: measured.rects.map(rect => {
      const width = Math.max(rect.width, MIN_WORD_HIGHLIGHT_WIDTH)

      return {
        left: origin.left + rect.left - (width - rect.width) / 2,
        top: origin.top + rect.top,
        width,
        height: rect.height,
      }
    }),
  })

  const measureWordHighlight = ({ key, type, start, end }, origin) => {
    const measured = getTextareaRangeRects(origin.input, [{ key, type, start, end }])[0]

    return measured?.rects.length ? toWordHighlight(measured, origin) : null
  }

  // An insertion is drawn as boxes over the given word ranges and a double rule in the whitespace
  // gap at `gapOffset`.
  const measureInsertionBoxes = ({ key, ranges, gapOffset }, origin) => {
    const { input } = origin
    const measured = getTextareaRangeRects(
      input,
      ranges
        .filter(range => range.end > range.start)
        .map((range, index) => ({ key: `${key}:${index}`, type: 'insertion', ...range })),
    )
    const rects = measured.flatMap(group =>
      group.rects.map(rect => ({
        left: origin.left + rect.left,
        top: origin.top + rect.top,
        width: rect.width,
        height: rect.height,
      })),
    )

    if (!rects.length) return null

    const gap = getInsertionGapSpan(input.value, gapOffset)
    const gapMeasured =
      gap.end > gap.start
        ? getTextareaRangeRects(input, [
            { key, type: 'insertion', start: gap.start, end: gap.end },
          ])[0]
        : null

    return {
      key,
      type: 'insertion',
      rects,
      underlineRects: (gapMeasured?.rects || []).map(rect => {
        const width = Math.max(rect.width, MIN_INSERTION_UNDERLINE_WIDTH)

        return {
          left: origin.left + rect.left - (width - rect.width) / 2,
          top: origin.top + rect.glyphBottom - 3,
          width,
        }
      }),
    }
  }

  // A live insertion covers whatever words surround its point right now.
  const measureInsertionHighlight = ({ key, offset }, origin) =>
    measureInsertionBoxes(
      { key, ranges: [getInsertionSurroundingSpan(origin.input.value, offset)], gapOffset: offset },
      origin,
    )

  // A pinned insertion keeps the two words it was pinned with. One box while only whitespace
  // separates them; once something is typed into the gap, a box per word so the typed text is bare.
  const measurePinnedInsertion = ({ key, before, after }, origin) => {
    const gap = getInsertionGapSpan(origin.input.value, before.end)
    const untouched = gap.end === after.start

    return measureInsertionBoxes(
      {
        key,
        ranges: untouched ? [{ start: before.start, end: after.end }] : [before, after],
        gapOffset: before.end,
      },
      origin,
    )
  }

  // Measure a pixel rectangle for every corrected word (offset → pixels via the caret mirror) so
  // hovering is a cheap geometric hit-test, not the unreliable point → offset APIs. Recomputed
  // lazily (only when marked stale) to avoid measuring on every mouse move.
  const computeCorrectionRects = () => {
    correctionRectsStaleRef.current = false

    const origin = getHighlightOrigin()

    if (!origin) {
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

    // Word ranges go through one mirror together; insertions each need their own span lookup.
    const wordGroups = getTextareaRangeRects(origin.input, wordRanges).map(measured =>
      toWordHighlight(measured, origin),
    )
    const insertionGroups = insertionPoints
      .map(point => measureInsertionHighlight(point, origin))
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

  // The character a click landed on. The browser puts the caret at the nearest boundary, so it is
  // one of the two characters around the caret — whichever's box holds the pointer; null off both.
  const getGlyphIndexAtPointer = (input, pointer) => {
    const origin = getHighlightOrigin()
    const scrollContent = scrollContentRef.current

    if (!origin || !scrollContent || typeof input.selectionStart !== 'number') return null

    const scrollContentRect = scrollContent.getBoundingClientRect()
    const x = pointer.x - scrollContentRect.left
    const y = pointer.y - scrollContentRect.top
    const caret = input.selectionStart
    const candidates = [caret - 1, caret].filter(index => index >= 0 && index < input.value.length)
    const hit = getTextareaRangeRects(
      input,
      candidates.map(index => ({ key: index, type: 'glyph', start: index, end: index + 1 })),
    ).find(measured =>
      rectsContainPoint(
        measured.rects.map(rect => ({
          left: origin.left + rect.left,
          top: origin.top + rect.top,
          width: rect.width,
          height: rect.height,
        })),
        x,
        y,
      ),
    )

    return hit ? hit.key : null
  }

  // Re-measure whatever is pinned from its text position, in its own colour.
  const refreshSelectedHighlight = () => {
    const pinned = pinnedHighlightRef.current
    const origin = pinned && getHighlightOrigin()

    if (!pinned || !origin) {
      setSelectedWordHighlight(null)
      return
    }

    setSelectedWordHighlight(
      pinned.type === 'insertion'
        ? measurePinnedInsertion(pinned, origin)
        : measureWordHighlight(pinned, origin),
    )
  }

  const clearSelectedHighlight = () => {
    pinnedHighlightRef.current = null
    setSelectedWordHighlight(null)
    setIsPassagePinned(false)
  }

  // Move a word range with an edit: shifted by one before it (typing at its front included),
  // resized by one inside it, left alone by one after. Null once nothing of it is left.
  const carryRange = (range, edit) => {
    const delta = edit.nextEnd - edit.previousEnd

    if (edit.start >= range.end) return range

    if (edit.previousEnd <= range.start) {
      return { start: range.start + delta, end: range.end + delta }
    }

    const start = edit.start < range.start ? edit.nextEnd : range.start
    const end = edit.previousEnd >= range.end ? edit.start : range.end + delta

    return end > start ? { start, end } : null
  }

  // Keep the pinned highlight on its text through an edit; true when the edit wiped it out.
  // An insertion is its two words, each carried on its own — the gap between them is never marked.
  const carrySelectedRangeThroughEdit = (previousText, nextText, caretIndex) => {
    const pinned = pinnedHighlightRef.current

    if (!pinned) return false

    const edit = getEditSpan(previousText, nextText, caretIndex)

    // After any edit the browser's selection is a bare caret, so there is nothing of it to hide.
    setIsPassagePinned(false)

    let next = null

    if (pinned.type === 'insertion') {
      const before = carryRange(pinned.before, edit)
      const after = carryRange(pinned.after, edit)

      if (before && after) {
        next = { ...pinned, before, after, start: before.start, end: after.end }
      }
    } else {
      const range = carryRange(pinned, edit)

      if (range) next = { ...pinned, ...range }
    }

    if (!next) {
      clearSelectedHighlight()
      return true
    }

    pinnedHighlightRef.current = next
    refreshSelectedHighlight()
    return false
  }

  const handleTextMouseMove = event => {
    const scrollContent = scrollContentRef.current

    if (!scrollContent) return

    if (correctionRectsStaleRef.current) {
      computeCorrectionRects()
      refreshSelectedHighlight()
    }

    const scrollContentRect = scrollContent.getBoundingClientRect()
    const x = event.clientX - scrollContentRect.left
    const y = event.clientY - scrollContentRect.top
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
      className={[
        'essay-writing-input-area',
        isDeletionSelectionHighlighted ? 'essay-writing-input-area-deletion' : '',
        isPassagePinned ? 'essay-writing-input-area-passage-pinned' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      ref={inputAreaRef}
    >
      <div className="essay-writing-scroll-content" ref={scrollContentRef}>
        <div className="essay-writing-highlight-layer">
          {renderWordHighlights(selectedWordHighlight, 'selected')}
          {hoveredWordHighlight?.key !== selectedWordHighlight?.key &&
            renderWordHighlights(hoveredWordHighlight, 'hover')}
        </div>
        <TextField
          fullWidth
          multiline
          value={text}
          inputRef={inputRef}
          onBlur={handleBlur}
          onChange={handleChange}
          onClick={handleClick}
          onKeyUp={handleKeyUp}
          onMouseLeave={handleTextMouseLeave}
          onMouseMove={handleTextMouseMove}
          onPaste={handlePaste}
          onSelect={handleSelect}
          placeholder={intl.formatMessage({ id: 'essay-textfield-placeholder' })}
          variant="outlined"
          className="essay-writing-input"
          data-cy="essay-writing-input"
        />
      </div>
    </Box>
  )
}

export default EssayTextInput
