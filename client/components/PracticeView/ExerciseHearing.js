import React from 'react'
import { Input, Icon } from "semantic-ui-react"

const ExerciseHearing = ({ word, handleClick, handleChange }) => {

  return (
    <Input
      key={word.ID}
      onChange={e => handleChange(e, word.ID)}
      label={{ basic: true, content: <Icon name='volume up' onClick={() => handleClick(word.surface)}></Icon>}}
      labelPosition='right'
    />
  )
}


export default ExerciseHearing
