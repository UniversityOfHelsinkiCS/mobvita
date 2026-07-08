import React from 'react'
import { CORRECTION_PLACEHOLDER } from '../utils/correctionTokens'

const CorrectedWordDebug = ({word, highlightedWords, setHighLightedWords}) => {
  const { ID, original, corrected, error_span, feedback } = word
  const feedbackText = feedback ? [
    ...(feedback.requested_hints || []),
    ...(feedback.hints || [])
  ].map(hint => hint.easy).join('\n') : ''
  const handleClick = () => {
    setHighLightedWords(error_span?.length > 0 ? error_span : [ID])
  }
  
  const textDecoration = ((original && corrected && original !== CORRECTION_PLACEHOLDER && corrected !== CORRECTION_PLACEHOLDER) ? 'wavy underline red' :
    (original && corrected && original !== CORRECTION_PLACEHOLDER && corrected === CORRECTION_PLACEHOLDER) ? 'line-through' :
      (original && corrected && original === CORRECTION_PLACEHOLDER && corrected !== CORRECTION_PLACEHOLDER) ? 'underline' : 'none')


  return (
    <span
      onClick={handleClick}
      style={{
        backgroundColor: highlightedWords.includes(ID) && corrected ? 'rgba(255, 0, 0, 0.5)' : 'transparent',
        cursor: 'pointer',
        textDecoration,
        fontSize: 'large'
      }}
      title={feedbackText}
    >
      {corrected !== CORRECTION_PLACEHOLDER && corrected || original}
    </span>
  )
}

export default CorrectedWordDebug