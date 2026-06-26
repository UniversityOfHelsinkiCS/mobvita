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

const wordIsDeletion = word => {
  const originalText = getCorrectionText(word.original).trim()
  const correctedText = getCorrectionText(word.corrected).trim()

  return Boolean(word.corrected) &&
    DELETION_CORRECTION_VALUES.has(correctedText) &&
    !INSERTION_ORIGINAL_VALUES.has(originalText)
}

const getComparableCorrectionText = value => (
  getCorrectionText(value).trim().toLocaleLowerCase()
)

const getWordOriginalText = word => (
  !wordIsInsertion(word) && word.original ? String(word.original) : ''
)

const getWordPositionsById = (sentence, words) => {
  const positionsById = {}
  let currentOffset = 0

  words.forEach(word => {
    if (wordIsInsertion(word)) {
      positionsById[word.ID] = {
        startOffset: currentOffset,
        endOffset: currentOffset,
        isInsertion: true,
      }
      return
    }

    const originalText = getWordOriginalText(word)

    if (!originalText) return

    const startIndex = sentence.startsWith(originalText, currentOffset)
      ? currentOffset
      : sentence.indexOf(originalText, currentOffset)

    if (startIndex === -1) return

    positionsById[word.ID] = {
      startOffset: startIndex,
      endOffset: startIndex + originalText.length,
    }
    currentOffset = startIndex + originalText.length
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
    return positionsById[word.ID] || getInsertionRange(word, positionsById)
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

const getMovedCorrectionGroups = (corrections, positionsById) => {
  const usedCorrectionIndexes = new Set()
  const movedWordIds = new Set()
  const groups = []

  corrections.forEach((word, insertionIndex) => {
    if (!wordIsInsertion(word) || usedCorrectionIndexes.has(insertionIndex)) return

    const insertedText = getComparableCorrectionText(word.corrected)

    if (!insertedText) return

    const matchingDeletion = corrections
      .map((candidate, index) => ({ candidate, index }))
      .filter(({ candidate, index }) => (
        !usedCorrectionIndexes.has(index) &&
        wordIsDeletion(candidate) &&
        getComparableCorrectionText(candidate.original) === insertedText
      ))
      .sort((firstMatch, secondMatch) => (
        Math.abs(firstMatch.index - insertionIndex) -
        Math.abs(secondMatch.index - insertionIndex)
      ))[0]

    if (!matchingDeletion) return

    const startIndex = Math.min(insertionIndex, matchingDeletion.index)
    const endIndex = Math.max(insertionIndex, matchingDeletion.index)
    const words = corrections.slice(startIndex, endIndex + 1)
    const range = mergeRanges(
      positionsById[word.ID],
      positionsById[matchingDeletion.candidate.ID],
    )

    usedCorrectionIndexes.add(insertionIndex)
    usedCorrectionIndexes.add(matchingDeletion.index)
    words.forEach(groupWord => movedWordIds.add(groupWord.ID))
    groups.push({ range, words })
  })

  return { groups, movedWordIds }
}

const getCorrectionGroups = (sentence, corrections) => {
  const positionsById = getWordPositionsById(sentence, corrections)
  const {
    groups: movedCorrectionGroups,
    movedWordIds,
  } = getMovedCorrectionGroups(corrections, positionsById)
  const adjacentCorrectionGroups = corrections
    .filter(word => wordHasCorrection(word) && !movedWordIds.has(word.ID))
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

  return movedCorrectionGroups
    .concat(adjacentCorrectionGroups)
    .sort((firstGroup, secondGroup) => (
      (firstGroup.range?.startOffset ?? 0) - (secondGroup.range?.startOffset ?? 0)
    ))
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
