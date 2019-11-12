import React from 'react'

const ExerciseHearing = () => {
  return (
    <Input
      key={word.ID}
      onChange={e => handleChange(e, word.ID)}
      onClick={e => handleClick(word.surface)}
    />
  )
}


export default ExerciseHearing
