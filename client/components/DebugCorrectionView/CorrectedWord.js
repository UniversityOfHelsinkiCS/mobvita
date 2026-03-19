
import React, { useState, useEffect } from 'react'


const CorrectedWord = ({word, highlightedWords, setHighLightedWords}) => { 
  const { ID, original, corrected, error_span, feedback } = word
  const feedbackText = feedback ? feedback.hints.map(hint => hint.easy).join('\n') : ''
  const handleClick = () => {
    setHighLightedWords(error_span?.length > 0 ? error_span : [ID])
  }

  
  const textDecoration = ((original && corrected && corrected != '-') ? 'wavy underline red' :
    (original && corrected && corrected == '-') ? 'line-through' : 'none')


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
      {corrected || original}
    </span>
  )
}

export default CorrectedWord