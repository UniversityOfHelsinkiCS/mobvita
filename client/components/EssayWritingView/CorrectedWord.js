import React from 'react'
import {
  CORRECTION_PLACEHOLDER,
  getCorrectionText,
  isCorrectionDeletion,
  isCorrectionInsertion,
} from './utils/correctionTokens'

const textHasLettersOrNumbers = text => /[\p{L}\p{N}]/u.test(text)

// The ▬ placeholder marks an empty slot (e.g. a chunk-boundary marker); it is never real text.
const withoutPlaceholder = text => (text === CORRECTION_PLACEHOLDER ? '' : text)

const CorrectedWord = ({ word, showCorrection }) => {
  const { original, corrected } = word
  const originalText = withoutPlaceholder(getCorrectionText(original).trim())
  const correctedText = withoutPlaceholder(getCorrectionText(corrected).trim())
  const isDeletion = isCorrectionDeletion(word)
  const isInsertion = isCorrectionInsertion(word)
  const isDeletedPunctuation = isDeletion && !textHasLettersOrNumbers(originalText)
  // A correct token inside a chunk bubble (no correction): shown with a white background to signal
  // there is nothing wrong with it.
  const isCorrect = Boolean(originalText) && !corrected && !isDeletion && !isInsertion

  const className = [
    'essay-writing-corrected-word',
    isDeletion ? 'essay-writing-corrected-word-deletion' : '',
    isDeletedPunctuation ? 'essay-writing-corrected-word-deleted-punctuation' : '',
    original && corrected && !isInsertion && !isDeletion
      ? 'essay-writing-corrected-word-replacement'
      : '',
    isInsertion ? 'essay-writing-corrected-word-insertion' : '',
    isCorrect ? 'essay-writing-corrected-word-correct' : '',
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
