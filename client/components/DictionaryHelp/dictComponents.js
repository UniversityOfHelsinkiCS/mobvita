import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Icon } from 'semantic-ui-react'
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
    <Button className="dictionary-button" icon basic onClick={handleDictionaryButtonClick}>
      <Icon size="large" name="book" data-cy="dictionary-icon" />
    </Button>
  )
}
