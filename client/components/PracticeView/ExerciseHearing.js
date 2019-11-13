import React from 'react'
import { Input } from "semantic-ui-react"

const ExerciseHearing = ({ word, handleClick, handleChange }) => {

  return (
    <Input
      key={word.ID}
      onChange={e => handleChange(e, word.ID)}
      onClick={() => handleClick(word.surface)}
    />
  )
}


export default ExerciseHearing
