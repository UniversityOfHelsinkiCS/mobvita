import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, TextField } from '@mui/material'

import {
  checkWritingCorrection,
  getWritingCorrectionKey,
  hideWritingCorrectionSuggestion,
  syncWritingCorrectionSuggestions,
  useCachedWritingCorrection,
} from 'Utilities/redux/writingCorrectionReducer'

const sentenceMatchRegex = /[^.!?]+[.!?]+/g
const WRITING_LANGUAGE = 'Finnish'

const getCompletedSentenceMatches = text => Array.from(text.matchAll(sentenceMatchRegex))

const getCompletedSentences = text => {
  const matches = getCompletedSentenceMatches(text)

  return matches.map((match, index) => ({
    sentenceId: `sentence-${match.index}`,
    text: match[0].trim(),
    startIndex: match.index,
    endIndex: match.index + match[0].length,
    context: matches
      .slice(Math.max(index - 3, 0), index)
      .map(contextMatch => contextMatch[0].trim())
      .join(' '),
  }))
}

const cursorIsInsideSentence = (sentence, cursorIndex) => (
  cursorIndex >= sentence.startIndex && cursorIndex <= sentence.endIndex
)

const getCompletedSentenceAtIndex = (text, cursorIndex) => (
  getCompletedSentences(text).find(sentence => cursorIsInsideSentence(sentence, cursorIndex)) || null
)

const getCompletedSentenceNearIndex = (text, cursorIndex) => (
  getCompletedSentenceAtIndex(text, cursorIndex) ||
  getCompletedSentenceAtIndex(text, Math.max(cursorIndex - 1, 0))
)

const getFirstChangedIndex = (previousText, nextText) => {
  const maxSharedLength = Math.min(previousText.length, nextText.length)

  for (let index = 0; index < maxSharedLength; index += 1) {
    if (previousText[index] !== nextText[index]) {
      return index
    }
  }

  return maxSharedLength
}

const getCompletedSentenceFromIndexes = (text, indexes) => {
  const maxIndex = Math.max(text.length, 0)

  for (const index of indexes) {
    const sentence = getCompletedSentenceNearIndex(
      text,
      Math.max(Math.min(index, maxIndex), 0),
    )

    if (sentence) return sentence
  }

  return null
}

const getUpdatedPendingSentence = (text, pendingSentence) => {
  if (!pendingSentence) return null

  return getCompletedSentenceAtIndex(text, pendingSentence.startIndex) ||
    getCompletedSentenceAtIndex(text, Math.max(pendingSentence.endIndex - 1, 0))
}

const EssayTextInput = () => {
  const dispatch = useDispatch()
  const [text, setText] = useState('')
  const pendingEditedSentenceRef = useRef(null)
  const textRef = useRef('')
  const correctionsByKey = useSelector(state => state.writingCorrection.correctionsByKey)

  const openCorrectionForSentence = sentence => {
    const nextCorrectionKey = getWritingCorrectionKey(sentence)

    if (correctionsByKey[nextCorrectionKey]) {
      dispatch(useCachedWritingCorrection({
        key: nextCorrectionKey,
        sentence: sentence.text,
        sentenceId: sentence.sentenceId,
      }))
    } else {
      dispatch(checkWritingCorrection({
        language: WRITING_LANGUAGE,
        sentenceId: sentence.sentenceId,
        text: sentence.text,
        context: sentence.context,
      }))
    }
  }

  const queueEditedSentence = sentence => {
    pendingEditedSentenceRef.current = sentence
    dispatch(hideWritingCorrectionSuggestion(sentence.sentenceId))
  }

  const commitPendingEditedSentence = () => {
    const pendingSentence = pendingEditedSentenceRef.current

    if (!pendingSentence) return false

    const updatedSentence = getUpdatedPendingSentence(textRef.current, pendingSentence)
    pendingEditedSentenceRef.current = null

    if (!updatedSentence) {
      return false
    }

    openCorrectionForSentence(updatedSentence)
    return true
  }

  const handleChange = e => {
    const previousText = textRef.current
    const nextText = e.target.value
    const cursorIndex = e.target.selectionStart
    const pendingSentence = pendingEditedSentenceRef.current

    setText(nextText)
    textRef.current = nextText
    dispatch(syncWritingCorrectionSuggestions(
      getCompletedSentences(nextText).map(sentence => sentence.sentenceId),
    ))

    if (pendingSentence) {
      const updatedPendingSentence = getUpdatedPendingSentence(nextText, pendingSentence)

      if (!updatedPendingSentence) {
        dispatch(hideWritingCorrectionSuggestion(pendingSentence.sentenceId))
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

    const editIndex = getFirstChangedIndex(previousText, nextText)
    const previousCompletedSentenceAtEdit = getCompletedSentenceFromIndexes(previousText, [
      editIndex,
      editIndex - 1,
    ])
    const completedSentenceAtEdit = getCompletedSentenceFromIndexes(nextText, [
      editIndex,
      editIndex - 1,
      cursorIndex,
      cursorIndex - 1,
    ])
    const completedSentenceAtCursor = getCompletedSentenceNearIndex(nextText, cursorIndex)
    const completedSentence = previousCompletedSentenceAtEdit
      ? completedSentenceAtEdit
      : completedSentenceAtCursor || completedSentenceAtEdit
    const previousCompletedSentenceAtCursor = getCompletedSentenceNearIndex(
      previousText,
      Math.min(cursorIndex, previousText.length),
    )
    const previousCompletedSentence = previousCompletedSentenceAtEdit ||
      previousCompletedSentenceAtCursor

    if (!completedSentence) {
      if (previousCompletedSentence) {
        queueEditedSentence(previousCompletedSentence)
      }

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

      openCorrectionForSentence(completedSentence)
      return
    }

    pendingEditedSentenceRef.current = null
    openCorrectionForSentence(completedSentence)
  }

  const handleSelect = e => {
    const pendingSentence = pendingEditedSentenceRef.current

    if (!pendingSentence) return

    const updatedPendingSentence = getUpdatedPendingSentence(textRef.current, pendingSentence)

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

  return (
    <Box className="essay-writing-input-area">
      <TextField
        fullWidth
        multiline
        minRows={12}
        value={text}
        onBlur={handleBlur}
        onChange={handleChange}
        onSelect={handleSelect}
        placeholder="Write your Finnish text here..."
        variant="outlined"
        className="essay-writing-input"
        data-cy="essay-writing-input"
      />
    </Box>
  )
}

export default EssayTextInput
