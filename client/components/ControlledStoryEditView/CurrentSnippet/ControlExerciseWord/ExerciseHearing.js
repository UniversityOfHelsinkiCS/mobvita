import React, { createRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { getTextWidth, speak, learningLanguageSelector, voiceLanguages } from 'Utilities/common'
import { setFocusedWord, handleVoiceSampleCooldown } from 'Utilities/redux/practiceReducer'

const ExerciseHearing = ({ word }) => {
  const [iconDisabled, setIconDisabled] = useState(false)
  const [focusTimeout, setFocusTimeout] = useState(false)
  const { ID: wordId } = word
  const learningLanguage = useSelector(learningLanguageSelector)

  const voice = voiceLanguages[learningLanguage]
  const inputRef = createRef(null)
  const { voiceSampleOnCooldown } = useSelector(({ practice }) => practice)

  const dispatch = useDispatch()

  useEffect(() => {
    if (voiceSampleOnCooldown) {
      setIconDisabled(true)
    } else {
      setIconDisabled(false)
    }
  }, [voiceSampleOnCooldown])

  const speakerClickHandler = word => {
    inputRef.current.focus()
  }

  const handleInputFocus = () => {
    dispatch(setFocusedWord(word))
    if (!focusTimeout && !voiceSampleOnCooldown) {
      console.log('speaking ', word.audio, '  ', voice)
      speak(word.audio, voice, 'exercise')
      setFocusTimeout(true)
      dispatch(handleVoiceSampleCooldown())
      setTimeout(() => {
        setFocusTimeout(false)
      }, 500)
      setTimeout(() => {
        dispatch(handleVoiceSampleCooldown())
      }, 4000)
    }
  }

  return (
    <span>
      <input
        data-cy="exercise-hearing"
        readOnly
        ref={inputRef}
        key={word.ID}
        placeholder={`${word.surface}`}
        onFocus={handleInputFocus}
        className="exercise control-mode control-mode-chosen"
        style={{
          width: getTextWidth(word.surface),
          minWidth: getTextWidth(word.surface),
          height: '1.5em',
          lineHeight: 'normal',
        }}
      />
      <Icon
        name="volume up"
        link
        onClick={() => speakerClickHandler(word)}
        style={{ marginLeft: '-25px' }}
        disabled={iconDisabled}
      />
      {word.negation && <sup style={{ marginLeft: '3px', color: '#0000FF' }}>(neg)</sup>}
    </span>
  )
}

export default ExerciseHearing
