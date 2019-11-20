import React from 'react'
import { Input, Icon } from 'semantic-ui-react'

const ExerciseHearing = (({ word, handleClick, handleChange }) => {

  let placeholder = ''
  for (let index = 0; index < word.surface.length; index++) {
    placeholder += '_'
  }

  return (
    <Input
      placeholder={placeholder}
      key={word.ID}
      onChange={e => handleChange(e, word)}
      icon={<Icon name="volume up" link onClick={() => handleClick(word.base, word.lemmas)} />}
      transparent
      style={{ minWidth: `${placeholder.length}em`, width: `${Math.floor(word.surface.length)}em`, height: '30px' }}
    />
  )
})

export default ExerciseHearing
