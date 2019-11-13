import React from 'react'

import { Input } from 'semantic-ui-react'

const ExerciseCloze = ({ word, handleChange }) => {
  return (
    <Input
      key={word.ID}
      defaultValue={word.base}
      onChange={e => handleChange(e, word.ID)}
      onClick={() => { }}
    />
  )
}

export default ExerciseCloze
