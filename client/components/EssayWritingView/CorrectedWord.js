import React from 'react'
import {
  getCorrectionText,
  isCorrectionDeletion,
  isCorrectionInsertion,
} from './utils/correctionTokens'

const CorrectedWord = ({ word }) => {
  const { original, corrected, feedback } = word
  const originalText = getCorrectionText(original).trim()
  const correctedText = getCorrectionText(corrected).trim()
  const isDeletion = isCorrectionDeletion(word)
  const isInsertion = isCorrectionInsertion(word)

  const textDecoration = isDeletion
    ? 'line-through'
    : original && corrected && !isInsertion
      ? 'wavy underline red'
      : isInsertion
        ? 'underline'
        : 'none'

  const displayedCorrection = isDeletion ? original : corrected || original

  if (isInsertion && !correctedText) {
    return null
  }

  if (!corrected && !originalText) {
    return null
  }

  return (
    <span
      style={{
        textDecoration,
        fontSize: 'large',
      }}
    >
      {displayedCorrection}
    </span>
  )
}

export default CorrectedWord
