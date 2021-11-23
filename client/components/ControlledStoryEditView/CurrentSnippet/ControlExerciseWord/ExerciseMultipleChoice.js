import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import { getTextWidth } from 'Utilities/common'
import { addExercise, removeExercise } from 'Utilities/redux/controlledPracticeReducer'

const ExerciseMultipleChoice = ({ word }) => {
  const dispatch = useDispatch()

  const [bgColorClassName, setBgColorClassName] = useState('exercise-multiple control-mode-chosen')
  const [options, setOptions] = useState([])

  const { acceptedTokens } = useSelector(({ controlledPractice }) => controlledPractice)
  const { ID: wordId } = word

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
    setBgColorClassName(getExerciseClass())
  }, [acceptedTokens])

  useEffect(() => {
    const temp = word.choices.sort().map(choice => ({
      key: `${word.ID}_${choice}`,
      value: choice,
      text: choice,
    }))
    setOptions(temp)
  }, [word])

  return (
    <Dropdown
      key={word.ID}
      options={options}
      placeholder={word.choices[0]}
      value={word.choices[0]}
      onClick={handleExerciseClick}
      selection
      floating
      style={{ width: getTextWidth(word.choices[0]), minWidth: getTextWidth(word.choices[0]) }}
      className={`exercise-multiple control-mode ${bgColorClassName}`}
    />
  )
}

export default ExerciseMultipleChoice
