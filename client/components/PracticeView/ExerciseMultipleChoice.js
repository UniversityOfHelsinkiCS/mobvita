import React from 'react'
import { Dropdown } from "semantic-ui-react"

const ExerciseMultipleChoice = ({ word, handleClick }) => {
  const options = [{ key: 100000, value: '2', text: word.surface }]
  return (
    <Dropdown
      key={word.ID}
      options={options}
      selection
      onClick={() => handleClick(word.surface)}
    />
  )
}

export default ExerciseMultipleChoice
