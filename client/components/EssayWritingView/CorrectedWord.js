import React from 'react'
import {
  getCorrectionText,
  isCorrectionDeletion,
  isCorrectionInsertion,
} from './utils/correctionTokens'

const textHasLettersOrNumbers = text => /[\p{L}\p{N}]/u.test(text)

const CorrectedWord = ({ word, showCorrection }) => {
  const { original, corrected } = word
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
  ]
    .filter(Boolean)
    .join(' ')

  const incorrectText = isInsertion ? correctedText : originalText

  if (!incorrectText && !correctedText) {
    return null
  }

  // Dev/staging reference only: also show the correction as "error → correct" (replacements only).
  const showDevCorrection =
    showCorrection &&
    !isDeletion &&
    !isInsertion &&
    Boolean(correctedText) &&
    correctedText !== incorrectText

  return (
    <span className={className}>
      {incorrectText || correctedText}
      {showDevCorrection && (
        <span className="essay-writing-corrected-word-dev-correction"> → {correctedText}</span>
      )}
    </span>
  )
}

export default CorrectedWord
