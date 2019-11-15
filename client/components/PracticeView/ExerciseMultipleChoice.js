import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const ExerciseMultipleChoice = ({ word, handleClick, handleChange }) => {
  // const options = [{ key: 100000, value: '2', text: word.surface }]

  const options = word.choices.map(choise => ({
    key: `${word.ID}_${choise}`,
    value: choise,
    text: choise,
  }))

  const handleSelect = (e, data) => {
    handleClick(data.value)
    handleChange(e, word)
  }

  return (
    <Dropdown
      key={word.ID}
      options={options}
      selection
      placeholder="___"
      onChange={(e, data) => handleSelect(e, data)}
    />
  )
}

export default ExerciseMultipleChoice
