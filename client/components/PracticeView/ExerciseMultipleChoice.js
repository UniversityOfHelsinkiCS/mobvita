import React from 'react'

const ExerciseMultipleChoice = () => {
  const options = [{ key: 100000, value: '2', text: word.surface }]
  return (
    <Dropdown
      key={word.ID}
      options={options}
      selection
      onClick={e => handleClick(word.surface)}
    />
  )
}

export default ExerciseMultipleChoice
