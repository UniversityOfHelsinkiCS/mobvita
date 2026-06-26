import React from 'react'
import {
  getCorrectionText,
  isCorrectionDeletion,
  isCorrectionInsertion,
} from './utils/correctionTokens'

const textHasLettersOrNumbers = text => /[\p{L}\p{N}]/u.test(text)

const CorrectedWord = ({ word }) => {
  const { original, corrected, feedback } = word
  const originalText = getCorrectionText(original).trim()
  const correctedText = getCorrectionText(corrected).trim()
  const isDeletion = isCorrectionDeletion(word)
  const isInsertion = isCorrectionInsertion(word)
  const isDeletedPunctuation = isDeletion && !textHasLettersOrNumbers(originalText)

  const className = [
    'essay-writing-corrected-word',
    isDeletion ? 'essay-writing-corrected-word-deletion' : '',
    isDeletedPunctuation ? 'essay-writing-corrected-word-deleted-punctuation' : '',
    original && corrected && !isInsertion && !isDeletion
      ? 'essay-writing-corrected-word-replacement'
      : '',
    isInsertion ? 'essay-writing-corrected-word-insertion' : '',
  ].filter(Boolean).join(' ')

  const displayedCorrection = isDeletion ? original : corrected || original

  if (isInsertion && !correctedText) {
    return null
  }

  if (!corrected && !originalText) {
    return null
  }

  return (
    <span className={className}>
      {displayedCorrection}
    </span>
  )
}

export default CorrectedWord
