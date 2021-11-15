import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import { getTextWidth } from 'Utilities/common'
import { addExercise, removeExercise } from 'Utilities/redux/controlledPracticeReducer'

const ExerciseMultipleChoice = ({ word }) => {
  const [bgColorClassName, setBgColorClassName] = useState('exercise-multiple control-mode-chosen')
  const [options, setOptions] = useState([])

  const dispatch = useDispatch()
  const currentAnswer = useSelector(({ practice }) => practice.currentAnswers[word.ID])
  const { acceptedTokens } = useSelector(({ controlledPractice }) => controlledPractice)

  const { tested, isWrong, ID: wordId } = word
  const value = currentAnswer ? currentAnswer.users_answer : ''

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
    setBgColorClassName(getExerciseClass(tested, isWrong))
  }, [acceptedTokens])

  useEffect(() => {
    const temp = word.choices.sort().map(choice => ({
      key: `${word.ID}_${choice}`,
      value: choice,
      text: choice,
    }))
    setOptions(temp)
  }, [word])

  const maximumLength = word.choices.reduce((maxLength, currLength) => {
    if (currLength.length > maxLength) return currLength.length
    return maxLength
  }, 0)

  let testString = ''
  word.choices.forEach(choice => {
    if (choice.length > testString.length) {
      testString = choice
    }
  })

  const placeholder = word.choices[0]

  return (
    <Dropdown
      key={word.ID}
      disabled={tested && !isWrong}
      options={options}
      placeholder={placeholder}
      value={value}
      onClick={handleExerciseClick}
      selection
      floating
      style={{ width: getTextWidth(testString), minWidth: getTextWidth(testString) }}
      className={`exercise-multiple control-mode ${bgColorClassName}`}
    />
  )
}

export default ExerciseMultipleChoice
