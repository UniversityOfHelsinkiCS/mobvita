import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  learningLanguageSelector,
  dictionaryLanguageSelector,
  speak,
  respVoiceLanguages,
} from 'Utilities/common'
import { getTranslationAction, setWords } from 'Utilities/redux/translationReducer'

const PlainWord = ({ word, ...props }) => {
  const { lemmas, ID: wordId, surface, inflection_ref: inflectionRef } = word

  const autoSpeak = useSelector(({ user }) => user.data.user.auto_speak)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)

  const dispatch = useDispatch()
  const { id: storyId } = useParams()

  const voice = respVoiceLanguages[learningLanguage]

  if (surface === '\n\n') {
    return (
      <div style={{ lineHeight: '50%' }}>
        <br />
      </div>
    )
  }

  if (!lemmas) return <span {...props}>{surface}</span>

  const handleWordClick = () => {
    if (autoSpeak === 'always' && voice) speak(surface, voice)
    if (lemmas) {
      dispatch(setWords({ surface, lemmas }))
      dispatch(
        getTranslationAction({
          learningLanguage,
          wordLemmas: lemmas,
          dictionaryLanguage,
          storyId,
          wordId,
          inflectionRef,
        })
      )
    }
  }

  return (
    <span
      role="button"
      tabIndex={-1}
      onKeyDown={() => handleWordClick()}
      onClick={() => handleWordClick()}
      className="word-interactive"
      {...props}
    >
      {surface}
    </span>
  )
}

export default PlainWord
