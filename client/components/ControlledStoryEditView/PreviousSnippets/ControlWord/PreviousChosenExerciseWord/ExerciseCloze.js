import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { useTextWidth, rightAlignedLanguages, learningLanguageSelector } from 'Utilities/common'

const ExerciseCloze = ({ word }) => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const target = useRef()

  const direction = rightAlignedLanguages.includes(learningLanguage) ? 'bidi-override' : ''

  // Measured off the input, so the blank is sized in the font `.exercise` actually renders it in.
  // The surface/base pick is the same lexicographic `>` it always was.
  const widest = word.surface > word.base ? word.surface : word.base
  const inputWidth = useTextWidth(widest, target)

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
        width: inputWidth,
        marginRight: '2px',
        height: '1.5em',
        lineHeight: 'normal',
        unicodeBidi: direction,
      }}
    />
  )
}

export default ExerciseCloze
