import React from 'react'

import { Input } from 'semantic-ui-react'

const ExerciseCloze = ({ word, handleChange, handleClick }) => {
  return (
    <Input
      key={word.ID}
      defaultValue={word.base}
      onChange={e => handleChange(e, word.ID)}
      onClick={() => handleClick(word.base)}
    />
  )
}

export default ExerciseCloze
