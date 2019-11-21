import React, { createRef } from 'react'
import { Input, Icon } from 'semantic-ui-react'

const ExerciseHearing = (({ word, handleClick, handleChange }) => {
  const inputRef = createRef()

  const clickHandler = (word) => {
    handleClick(word, '')
    inputRef.current.focus()
  }

  const placeholder = '_'.repeat(word.surface.length + 1)

  return (
    <Input
      ref={inputRef}
      key={word.ID}
      onChange={e => handleChange(e, word)}
      icon={<Icon name="volume up" link onClick={() => clickHandler(word.surface)} />}
      style={{ minWidth: `${placeholder.length}em`, width: `${Math.floor(word.surface.length)}em`, height: '20px', backgroundColor: 'lightblue', borderRadius: '10px' }}
    />
  )
})

export default ExerciseHearing
