import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const ExerciseMultipleChoice = ({ word, handleChange }) => {

  const options = word.choices.map(choice => ({
    key: `${word.ID}_${choice}`,
    value: choice,
    text: choice,
  }))

  const handleSelect = (e, data) => {
    handleChange(e, word, data)
  }

  return (
    <Dropdown
      key={word.ID}
      options={options}
      placeholder="_____________"
      onChange={(e, data) => handleSelect(e, data)}
    />
  )
}

export default ExerciseMultipleChoice
