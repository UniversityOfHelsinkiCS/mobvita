import React, { createRef, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { getTextWidth, speak, learningLanguageSelector, voiceLanguages } from 'Utilities/common'
import { addExercise, removeExercise } from 'Utilities/redux/controlledPracticeReducer'

const ExerciseHearing = ({ word }) => {
  const [value, setValue] = useState('')

  const [bgColorClassName, setBgColorClassName] = useState(
    'exercise control-mode control-mode-chosen'
  )
  const inputRef = createRef(null)

  const dispatch = useDispatch()
  const currentAnswer = useSelector(({ practice }) => practice.currentAnswers[word.ID])
  const { acceptedTokens } = useSelector(({ controlledPractice }) => controlledPractice)
  const learningLanguage = useSelector(learningLanguageSelector)

  const { ID: wordId } = word
  const voice = voiceLanguages[learningLanguage]

  const getExerciseClass = () => {
    return acceptedTokens.map(t => t.ID).includes(wordId)
      ? 'control-mode-chosen'
      : 'control-mode-unchosen'
  }

  useEffect(() => {
    setBgColorClassName(getExerciseClass())
  }, [acceptedTokens])

  useEffect(() => {
    const val = currentAnswer ? currentAnswer.users_answer : ''
    setValue(val)
  }, [currentAnswer])

  const speakerClickHandler = word => {
    speak(word.audio, voice)
    inputRef.current.focus()
  }

  const handleExerciseClick = () => {
    if (acceptedTokens.map(t => t.ID).includes(wordId)) dispatch(removeExercise(wordId))
    else dispatch(addExercise(word))
  }

  return (
    <span>
      <input
        data-cy="exercise-hearing"
        readOnly
        ref={inputRef}
        key={word.ID}
        placeholder={`${word.base || word.bases}`}
        value={value}
        onClick={handleExerciseClick}
        className={`exercise control-mode ${bgColorClassName}`}
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
