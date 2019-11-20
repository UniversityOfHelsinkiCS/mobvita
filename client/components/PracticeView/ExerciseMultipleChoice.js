import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const ExerciseMultipleChoice = ({ word, handleChange }) => {
  let maxLength = 0
  const options = word.choices.map((choice) => {
    if (choice.length > maxLength) maxLength = choice.length
    return {
      key: `${word.ID}_${choice}`,
      value: choice,
      text: choice,
    }
  })

  let placeholder = ''
  for (let index = 0; index < maxLength; index++) {
    placeholder += '_'
  }

  return (
    <Dropdown
      key={word.ID}
      options={options}
      placeholder={placeholder}
      onChange={(e, data) => handleChange(e, word, data)}
      style={{ minWidth: `${maxLength}em`, width: `${maxLength}em` }}
    />
  )
}

export default ExerciseMultipleChoice
