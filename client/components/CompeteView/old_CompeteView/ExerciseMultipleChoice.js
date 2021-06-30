import React from 'react'
import { Dropdown } from 'semantic-ui-react'

const ExerciseMultipleChoice = ({ word, handleChange, value }) => {
  const maximumLength = word.choices.reduce((maxLength, currLength) => {
    if (currLength.length > maxLength) return currLength.length
    return maxLength
  }, 0)

  const options = word.choices.map(choice => ({
    key: `${word.ID}_${choice}`,
    value: choice,
    text: choice,
  }))

  const placeholder = '_'.repeat(maximumLength)

  return (
    <Dropdown
      key={word.ID}
      options={options}
      placeholder={placeholder}
      value={value}
      onChange={(e, data) => handleChange(e, word, data)}
      selection
      style={{
        minWidth: `${maximumLength}em`,
        width: `${maximumLength}em`,
        height: '1em',
        backgroundColor: 'LightCyan',
      }}
    />
  )
}

export default ExerciseMultipleChoice
