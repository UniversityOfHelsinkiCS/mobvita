import React, { createRef } from 'react'
import { Input, Icon } from 'semantic-ui-react'

const ExerciseHearing = (({ word, handleClick, handleChange }) => {
  const inputRef = createRef()

  const clickHandler = (word) => {
    handleClick(word, '')
    inputRef.current.focus()
  }

  let placeholder = ''
  for (let index = 0; index < word.surface.length; index++) {
    placeholder += '_'
  }

  return (
    <Input
      ref={inputRef}
      key={word.ID}
      onChange={e => handleChange(e, word)}
      icon={<Icon name="volume up" link onClick={() => clickHandler(word.base || word.bases)} />}
      transparent
      style={{ minWidth: `${placeholder.length}em`, width: `${Math.floor(word.surface.length)}em`, height: '20px', backgroundColor: 'lightblue', borderRadius: '10px' }}
    />
  )
})

export default ExerciseHearing
