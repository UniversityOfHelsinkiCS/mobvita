import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import AppButton from 'Components/AppButton'
import { useLearningLanguage, speak, voiceLanguages, images } from 'Utilities/common'
import { setAnnotationvisibilityMobile } from 'Utilities/redux/annotationsReducer'

export const Speaker = ({ word }) => {
  const learningLanguage = useLearningLanguage()
  const voice = voiceLanguages[learningLanguage]
  const { resource_usage } = useSelector(state => state.user.data.user)
  const [count, setCount] = useState(0)
  const [lastWord, setLastWord] = useState('')

  const handleSpeakerClick = () => {
    speak(word, voice, 'dictionary', resource_usage)
    if (lastWord === '') {
      setCount(count + 1)
      setLastWord(word)
    } else if (word === lastWord) setCount(count + 1)
    else {
      setCount(0)
      setLastWord(word)
    }
  }

  if (!voice) return null

  return (
    <button
      type="button"
      aria-label="listen"
      className="clickable"
      onClick={handleSpeakerClick}
      data-cy="dictionary-speaker-icon"
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'inline-flex',
        verticalAlign: 'middle',
      }}
    >
      <img src={images.speaker} alt="" style={{ width: 22, height: 22, display: 'block' }} />
    </button>
  )
}

export const DictionaryButton = ({ setShow }) => {
  const dispatch = useDispatch()

  const handleDictionaryButtonClick = () => {
    setShow(true)
    dispatch(setAnnotationvisibilityMobile(false))
  }

  return (
    <AppButton
      variant="contrast-outline"
      className="dictionary-button"
      onClick={handleDictionaryButtonClick}
      data-cy="dictionary-open-button"
      sx={{ minWidth: 0, padding: '9px 14px', '& > svg': { width: '1.5em', height: '1.5em' } }}
    >
      <MenuBookIcon fontSize="large" data-cy="dictionary-icon" />
    </AppButton>
  )
}
