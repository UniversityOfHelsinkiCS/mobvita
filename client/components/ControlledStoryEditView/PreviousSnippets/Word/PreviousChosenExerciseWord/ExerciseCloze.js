import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { getTextWidth, rightAlignedLanguages, learningLanguageSelector } from 'Utilities/common'

const ExerciseCloze = ({ word }) => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const target = useRef()

  const direction = rightAlignedLanguages.includes(learningLanguage) ? 'bidi-override' : ''

  return (
    <input
      ref={target}
      data-cy="exercise-cloze"
      autoCapitalize="off"
      readOnly
      key={word.ID}
      name={word.ID}
      placeholder={`${word.base || word.bases}`}
      value=""
      className="exercise control-mode control-mode-chosen"
      style={{
        width: word.surface > word.base ? getTextWidth(word.surface) : getTextWidth(word.base),
        marginRight: '2px',
        height: '1.5em',
        lineHeight: 'normal',
        unicodeBidi: direction,
      }}
    />
  )
}

export default ExerciseCloze
