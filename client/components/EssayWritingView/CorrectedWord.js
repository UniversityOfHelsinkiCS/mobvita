import React from 'react'

const DELETION_CORRECTION_VALUES = new Set(['-', '—', '–'])
const INSERTION_ORIGINAL_VALUES = new Set(['', '-', '—', '–'])

const getCorrectionText = value => (
  value === null || value === undefined ? '' : String(value)
)

const CorrectedWord = ({ word }) => {
  const { original, corrected, feedback } = word
  const originalText = getCorrectionText(original).trim()
  const correctedText = getCorrectionText(corrected).trim()
  const isDeletion = DELETION_CORRECTION_VALUES.has(correctedText) &&
    !INSERTION_ORIGINAL_VALUES.has(originalText)
  const isInsertion = Boolean(correctedText) &&
    INSERTION_ORIGINAL_VALUES.has(originalText) &&
    !isDeletion
  const feedbackText = typeof feedback === 'string'
    ? feedback
    : feedback
      ? [...(feedback.requested_hints || []), ...(feedback.hints || [])]
        .map(hint => hint.easy)
        .join('\n')
      : ''

  const textDecoration =
    isDeletion
      ? 'line-through'
      : original && corrected && !isInsertion
        ? 'wavy underline red'
        : isInsertion
          ? 'underline'
          : 'none'

  const displayedCorrection = isDeletion
    ? original
    : corrected || original

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
      title={feedbackText}
    >
      {displayedCorrection}
    </span>
  )
}

export default CorrectedWord
