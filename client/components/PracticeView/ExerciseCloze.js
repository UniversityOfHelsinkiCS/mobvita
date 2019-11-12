import React from 'react'

const ExerciseCloze = () => {
  return (
    <Input
      key={word.ID}
      defaultValue={word.bases.split('|')[0]}
      onChange={e => handleChange(e, word.ID)}
      onClick={e => handleClick(word.surface)}
    />
  )
}

export default ExerciseCloze
