import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getTextWidth, rightAlignedLanguages, learningLanguageSelector } from 'Utilities/common'
import { addExercise, removeExercise } from 'Utilities/redux/exercisePickReducer'

const ExerciseCloze = ({ word }) => {
  const [value, setValue] = useState('')
  const [bgColorClassName, setBgColorClassName] = useState('control-mode-chosen')
  const learningLanguage = useSelector(learningLanguageSelector)
  const currentAnswer = useSelector(({ practice }) => practice.currentAnswers[word.ID])
  const { acceptedTokens } = useSelector(({ exercisePick }) => exercisePick)

  const { ID: wordId } = word

  const target = useRef()
  const dispatch = useDispatch()

  const getExerciseClass = () => {
    return acceptedTokens.map(t => t.ID).includes(wordId)
      ? 'control-mode-chosen'
      : 'control-mode-unchosen'
  }

  const handleExerciseClick = () => {
    if (acceptedTokens.map(t => t.ID).includes(wordId)) dispatch(removeExercise(wordId))
    else dispatch(addExercise(word))
  }

  useEffect(() => {
    const val = currentAnswer ? currentAnswer.users_answer : ''
    setValue(val)
  }, [currentAnswer])

  useEffect(() => {
    setBgColorClassName(getExerciseClass())
  }, [acceptedTokens])

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
      value={value}
      onClick={handleExerciseClick}
      className={`exercise control-mode ${bgColorClassName}`}
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
