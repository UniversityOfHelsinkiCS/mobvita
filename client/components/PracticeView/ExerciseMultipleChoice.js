import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const ExerciseMultipleChoice = ({ word, handleChange }) => {
  // const options = [{ key: 100000, value: '2', text: word.surface }]

  const options = word.choices.map(choice => ({
    key: `${word.ID}_${choice}`,
    value: choice,
    text: choice,
  }))

  const handleSelect = (e, data) => {
    handleChange(e, word.ID)
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
