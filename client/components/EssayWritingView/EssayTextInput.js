import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, TextField } from '@mui/material'

import {
  checkWritingCorrection,
  getWritingCorrectionKey,
  syncWritingCorrectionSuggestions,
  useCachedWritingCorrection,
} from 'Utilities/redux/writingCorrectionReducer'

const sentenceMatchRegex = /[^.!?]+[.!?]+/g
const sentenceEndingRegex = /[.!?]/
const WRITING_LANGUAGE = 'Finnish'

const getCompletedSentenceMatches = text => Array.from(text.matchAll(sentenceMatchRegex))

const getCompletedSentences = text => {
  const matches = getCompletedSentenceMatches(text)

  return matches.map((match, index) => ({
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

const getCompletedSentenceAtIndex = (sentences, cursorIndex) => (
  sentences.find(sentence => cursorIsInsideSentence(sentence, cursorIndex)) || null
)

const getCompletedSentenceNearIndex = (sentences, cursorIndex) => (
  getCompletedSentenceAtIndex(sentences, cursorIndex) ||
  getCompletedSentenceAtIndex(sentences, Math.max(cursorIndex - 1, 0))
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

const getCompletedSentenceFromIndexes = (sentences, indexes, textLength) => {
  for (const index of indexes) {
    const sentence = getCompletedSentenceNearIndex(
      sentences,
      Math.max(Math.min(index, textLength), 0),
    )

    if (sentence) return sentence
  }

  return null
}

const getUpdatedPendingSentence = (sentences, pendingSentence) => {
  if (!pendingSentence) return null

  return sentences.find(sentence => sentence.sentenceId === pendingSentence.sentenceId) ||
    getCompletedSentenceAtIndex(sentences, pendingSentence.startIndex) ||
    getCompletedSentenceAtIndex(sentences, Math.max(pendingSentence.endIndex - 1, 0))
}

const getSentenceIndexAtTextIndex = (sentences, cursorIndex) => (
  sentences.findIndex(sentence => cursorIsInsideSentence(sentence, cursorIndex))
)

const sentenceWasCompletedByCurrentInput = ({
  completedSentence,
  cursorIndex,
  nextCompletedSentences,
  nextText,
  previousCompletedSentences,
}) => (
  nextCompletedSentences.length > previousCompletedSentences.length &&
  completedSentence?.endIndex === cursorIndex &&
  sentenceEndingRegex.test(nextText[cursorIndex - 1] || '')
)

const addStableSentenceIds = ({
  createSentenceId,
  editIndex,
  previousSentences,
  sentences,
}) => {
  if (!previousSentences.length) {
    return sentences.map(sentence => ({
      ...sentence,
      sentenceId: createSentenceId(),
    }))
  }

  if (previousSentences.length === sentences.length) {
    return sentences.map((sentence, index) => ({
      ...sentence,
      sentenceId: previousSentences[index].sentenceId,
    }))
  }

  const usedSentenceIds = new Set()
  const sentenceIdsByIndex = {}
  const previousIndexAtEdit = getSentenceIndexAtTextIndex(previousSentences, editIndex)
  const currentIndexAtEdit = getSentenceIndexAtTextIndex(sentences, editIndex)
  const previousTargetIndex = previousIndexAtEdit !== -1
    ? previousIndexAtEdit
    : getSentenceIndexAtTextIndex(previousSentences, Math.max(editIndex - 1, 0))
  const currentTargetIndex = currentIndexAtEdit !== -1
    ? currentIndexAtEdit
    : getSentenceIndexAtTextIndex(sentences, Math.max(editIndex - 1, 0))

  const assignReusableSentenceId = (sentenceIndex, previousIndex) => {
    const previousSentenceId = previousSentences[previousIndex]?.sentenceId

    if (!previousSentenceId || usedSentenceIds.has(previousSentenceId)) {
      return false
    }

    usedSentenceIds.add(previousSentenceId)
    sentenceIdsByIndex[sentenceIndex] = previousSentenceId
    return true
  }

  sentences.forEach((sentence, index) => {
    const reusablePreviousIndex = previousSentences
      .reduce((bestMatch, previousSentence, previousIndex) => {
        if (
          previousSentence.text !== sentence.text ||
          usedSentenceIds.has(previousSentence.sentenceId)
        ) {
          return bestMatch
        }

        if (
          bestMatch === -1 ||
          Math.abs(previousIndex - index) < Math.abs(bestMatch - index)
        ) {
          return previousIndex
        }

        return bestMatch
      }, -1)

    if (reusablePreviousIndex !== -1) {
      assignReusableSentenceId(index, reusablePreviousIndex)
    }
  })

  return sentences.map((sentence, index) => {
    if (sentenceIdsByIndex[index]) {
      return {
        ...sentence,
        sentenceId: sentenceIdsByIndex[index],
      }
    }

    if (currentTargetIndex === -1 || previousTargetIndex === -1) {
      assignReusableSentenceId(index, index)

      return {
        ...sentence,
        sentenceId: sentenceIdsByIndex[index] || createSentenceId(),
      }
    }

    if (index < currentTargetIndex) {
      assignReusableSentenceId(index, index)

      return {
        ...sentence,
        sentenceId: sentenceIdsByIndex[index] || createSentenceId(),
      }
    }

    if (index === currentTargetIndex) {
      assignReusableSentenceId(index, previousTargetIndex)

      return {
        ...sentence,
        sentenceId: sentenceIdsByIndex[index] || createSentenceId(),
      }
    }

    const previousIndex = previousTargetIndex + (index - currentTargetIndex)

    assignReusableSentenceId(index, previousIndex)

    return {
      ...sentence,
      sentenceId: sentenceIdsByIndex[index] || createSentenceId(),
    }
  })
}

const EssayTextInput = () => {
  const dispatch = useDispatch()
  const [text, setText] = useState('')
  const pendingEditedSentenceRef = useRef(null)
  const completedSentencesRef = useRef([])
  const sentenceIdCounterRef = useRef(0)
  const textRef = useRef('')
  const correctionsByKey = useSelector(state => state.writingCorrection.correctionsByKey)

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
    dispatch(syncWritingCorrectionSuggestions(
      nextCompletedSentences.map(sentence => sentence.sentenceId),
    ))

    return nextCompletedSentences
  }

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
    const previousText = textRef.current
    const nextText = e.target.value
    const cursorIndex = e.target.selectionStart
    const pendingSentence = pendingEditedSentenceRef.current
    const editIndex = getFirstChangedIndex(previousText, nextText)
    const previousCompletedSentences = completedSentencesRef.current
    const nextCompletedSentences = updateCompletedSentences(nextText, editIndex)

    setText(nextText)
    textRef.current = nextText

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
      [
        editIndex,
        editIndex - 1,
      ],
      previousText.length,
    )
    const completedSentenceAtEdit = getCompletedSentenceFromIndexes(
      nextCompletedSentences,
      [
        editIndex,
        editIndex - 1,
        cursorIndex,
        cursorIndex - 1,
      ],
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
    const previousCompletedSentence = previousCompletedSentenceAtEdit ||
      previousCompletedSentenceAtCursor

    if (!completedSentence) {
      if (previousCompletedSentence) {
        queueEditedSentence(previousCompletedSentence)
      }

      return
    }

    if (sentenceWasCompletedByCurrentInput({
      completedSentence,
      cursorIndex,
      nextCompletedSentences,
      nextText,
      previousCompletedSentences,
    })) {
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
