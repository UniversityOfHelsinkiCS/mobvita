import React from 'react'
import { Box, Paper } from '@mui/material'
import CorrectedWord from 'Components/EssayWritingView/CorrectedWord'
import Spinner from 'Components/Spinner'
import { hiddenFeatures } from 'Utilities/common'
import { getWritingCorrectionWords } from 'Utilities/redux/writingCorrectionReducer'
import { FormattedMessage } from 'react-intl'

const INSERTION_ORIGINAL_VALUES = new Set(['', '-', '—', '–'])
const DELETION_CORRECTION_VALUES = new Set(['-', '—', '–'])

const getCorrectionText = value => (
  value === null || value === undefined ? '' : String(value)
)

const wordIsInsertion = word => {
  const originalText = getCorrectionText(word.original).trim()
  const correctedText = getCorrectionText(word.corrected).trim()

  return Boolean(word.corrected) &&
    !DELETION_CORRECTION_VALUES.has(correctedText) &&
    (word.original === null || INSERTION_ORIGINAL_VALUES.has(originalText))
}

const getWordOriginalText = word => (
  !wordIsInsertion(word) && word.original ? String(word.original) : ''
)

const getWordPositionsById = (sentence, words) => {
  const positionsById = {}
  let searchStartIndex = 0

  words.forEach(word => {
    const originalText = getWordOriginalText(word)

    if (!originalText) return

    const startIndex = sentence.indexOf(originalText, searchStartIndex)

    if (startIndex === -1) return

    positionsById[word.ID] = {
      startOffset: startIndex,
      endOffset: startIndex + originalText.length,
    }
    searchStartIndex = startIndex + originalText.length
  })

  return positionsById
}

const wordHasCorrection = word => Boolean(word.corrected)

const getCorrectionWordIds = word => (
  Array.isArray(word.error_span) && word.error_span.length
    ? word.error_span
    : [word.ID]
)

const getNearestWordRange = (word, positionsById) => {
  const wordId = Number(word.ID)
  const positionedWords = Object.entries(positionsById)
    .map(([id, range]) => ({ id: Number(id), range }))
    .sort((firstWord, secondWord) => firstWord.id - secondWord.id)

  const previousWord = positionedWords
    .slice()
    .reverse()
    .find(positionedWord => positionedWord.id <= wordId)
  const nextWord = positionedWords.find(positionedWord => positionedWord.id >= wordId)

  return previousWord?.range || nextWord?.range || null
}

const getInsertionRange = (word, positionsById) => {
  const wordId = Number(word.ID)
  const positionedWords = Object.entries(positionsById)
    .map(([id, range]) => ({ id: Number(id), range }))
    .sort((firstWord, secondWord) => firstWord.id - secondWord.id)

  const previousWord = positionedWords
    .slice()
    .reverse()
    .find(positionedWord => positionedWord.id < wordId)
  const nextWord = positionedWords.find(positionedWord => positionedWord.id > wordId)
  const offset = previousWord?.range.endOffset ?? nextWord?.range.startOffset ?? 0

  return {
    startOffset: offset,
    endOffset: offset,
    isInsertion: true,
  }
}

const getCorrectionRange = (word, positionsById) => {
  if (wordIsInsertion(word)) {
    return getInsertionRange(word, positionsById)
  }

  const wordRanges = getCorrectionWordIds(word)
    .map(wordId => positionsById[wordId])
    .filter(Boolean)

  if (!wordRanges.length) {
    return positionsById[word.ID] || getNearestWordRange(word, positionsById)
  }

  return {
    startOffset: Math.min(...wordRanges.map(range => range.startOffset)),
    endOffset: Math.max(...wordRanges.map(range => range.endOffset)),
  }
}

const rangesAreAdjacent = (sentence, firstRange, secondRange) => {
  if (!firstRange || !secondRange) return false

  const textBetweenRanges = sentence.slice(firstRange.endOffset, secondRange.startOffset)

  return /^\s*$/.test(textBetweenRanges)
}

const mergeRanges = (firstRange, secondRange) => {
  if (!firstRange) return secondRange
  if (!secondRange) return firstRange

  const mergedRange = {
    startOffset: Math.min(firstRange.startOffset, secondRange.startOffset),
    endOffset: Math.max(firstRange.endOffset, secondRange.endOffset),
  }

  mergedRange.isInsertion = firstRange.isInsertion || secondRange.isInsertion

  return mergedRange
}

const getCorrectionGroups = (sentence, corrections) => {
  const positionsById = getWordPositionsById(sentence, corrections)

  return corrections
    .filter(wordHasCorrection)
    .map(word => ({
      range: getCorrectionRange(word, positionsById),
      words: [word],
    }))
    .reduce((groups, correction) => {
      const previousGroup = groups[groups.length - 1]

      if (previousGroup && rangesAreAdjacent(sentence, previousGroup.range, correction.range)) {
        previousGroup.words = previousGroup.words.concat(correction.words)
        previousGroup.range = mergeRanges(previousGroup.range, correction.range)
        return groups
      }

      return groups.concat(correction)
    }, [])
}

const CorrectionSuggestionPopper = ({
  correctionEntry,
  sentence,
  onSentenceSelect,
}) => {
  if (!correctionEntry) {
    return null
  }

  if (correctionEntry.pending) {
    return (
      <Paper
        className="essay-writing-correction-bubble"
        data-sentence={sentence}
        elevation={3}
      >
        <Box className="essay-writing-correction-loading">
          <Spinner size={30} />
        </Box>
      </Paper>
    )
  }

  if (correctionEntry.error) {
    return (
      <Paper
        className="essay-writing-correction-bubble"
        data-sentence={sentence}
        elevation={3}
      >
        <Box className="essay-writing-correction-content">
          {hiddenFeatures && (
            <Box component="span" className="essay-writing-correction-error-tag">
              <FormattedMessage id="error" />
            </Box>
          )}
        </Box>
      </Paper>
    )
  }

  const corrections = getWritingCorrectionWords(correctionEntry.corrections)
  const correctionGroups = getCorrectionGroups(sentence, corrections)

  if (!correctionGroups.length) {
    return null
  }

  return (
    <>
      {correctionGroups.map((correctionGroup, groupIndex) => (
        <Paper
          className="essay-writing-correction-bubble"
          data-sentence={sentence}
          elevation={3}
          key={`${correctionGroup.range?.startOffset ?? groupIndex}-${groupIndex}`}
          onClick={() => onSentenceSelect?.(correctionGroup.range)}
          onMouseEnter={() => onSentenceSelect?.(correctionGroup.range)}
          sx={{ cursor: onSentenceSelect ? 'pointer' : 'default' }}
        >
          <Box className="essay-writing-correction-content">
            {correctionGroup.words.map((word, index) => (
              <CorrectedWord
                key={index}
                word={word}
              />
            ))}
          </Box>
        </Paper>
      ))}
    </>
  )
}

export default CorrectionSuggestionPopper
