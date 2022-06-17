import React, { createRef } from 'react'
import { useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { getTextWidth, speak, learningLanguageSelector, voiceLanguages } from 'Utilities/common'

const ExerciseHearing = ({ word }) => {
  const inputRef = createRef(null)
  const learningLanguage = useSelector(learningLanguageSelector)
  const voice = voiceLanguages[learningLanguage]
  const { resource_usage } = useSelector(state => state.user.data.user)

  const speakerClickHandler = word => {
    speak(word.audio, voice, 'exercise', resource_usage)
    inputRef.current.focus()
  }

  return (
    <span>
      <input
        data-cy="exercise-hearing"
        readOnly
        ref={inputRef}
        key={word.ID}
        placeholder={`${word.base || word.bases}`}
        value=""
        className="exercise control-mode control-mode-chosen"
        style={{
          width: getTextWidth(word.surface),
          minWidth: getTextWidth(word.surface),
          marginRight: '2px',
          height: '1.5em',
          lineHeight: 'normal',
        }}
      />
      <Icon
        name="volume up"
        link
        onClick={() => speakerClickHandler(word)}
        style={{ marginLeft: '-25px' }}
      />
      {word.negation && <sup style={{ marginLeft: '3px', color: '#0000FF' }}>(neg)</sup>}
    </span>
  )
}

export default ExerciseHearing
