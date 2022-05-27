import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import { getTextWidth } from 'Utilities/common'
import { addExercise, removeExercise } from 'Utilities/redux/controlledPracticeReducer'

const ExerciseMultipleChoice = ({ word, handleAddClozeExercise, choices }) => {
  const dispatch = useDispatch()
  const [options, setOptions] = useState([])
  const { ID: wordId } = word
/*
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
*/
  console.log('multi choice ', word)
  useEffect(() => {
    const temp = choices.sort().map(choice => ({
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
      placeholder={choices[0]}
      value={choices[0]}
      onClick={handleAddClozeExercise}
      selection
      floating
      style={{ width: getTextWidth(choices[0]), minWidth: getTextWidth(choices[0]) }}
      className="exercise-multiple control-mode control-mode-chosen"
    />
  )
}

export default ExerciseMultipleChoice
