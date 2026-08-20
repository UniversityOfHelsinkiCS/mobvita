import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import { useTextWidth, speak, learningLanguageSelector, voiceLanguages } from 'Utilities/common'

const ExerciseHearing = ({ word }) => {
  const inputRef = useRef(null)
  const learningLanguage = useSelector(learningLanguageSelector)
  const voice = voiceLanguages[learningLanguage]
  const { resource_usage } = useSelector(state => state.user.data.user)

  const speakerClickHandler = word => {
    speak(word.audio, voice, 'exercise', resource_usage)
    inputRef.current.focus()
  }

  // Measured off the input, so the blank is sized in the font `.exercise` actually renders it in.
  const inputWidth = useTextWidth(word.surface, inputRef)

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
          width: inputWidth,
          minWidth: inputWidth,
          marginRight: '2px',
          height: '1.5em',
          lineHeight: 'normal',
        }}
      />
      <VolumeUpIcon
        data-cy="previous-chosen-exercise-hearing-speaker"
        fontSize="small"
        onClick={() => speakerClickHandler(word)}
        sx={{ cursor: 'pointer', marginLeft: '-25px', verticalAlign: 'middle' }}
      />
      {word.negation && <sup style={{ marginLeft: '3px', color: '#0000FF' }}>(neg)</sup>}
    </span>
  )
}

export default ExerciseHearing
