import React, { createRef, useState, useEffect } from 'react'
import { Input, Icon } from 'semantic-ui-react'

const ExerciseHearing = (({ word, handleClick, handleChange, value }) => {
  const [color, setColor] = useState('lightblue')
  const inputRef = createRef()

  const { isWrong, tested } = word

  useEffect(() => {
    if (tested) {
      if (isWrong) {
        setColor('firebrick')
      } else {
        setColor('yellowgreen')
      }
    }
  }, [tested])

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
      value={value}
      icon={<Icon name="volume up" link onClick={() => clickHandler(word.surface)} />}
      transparent
      style={{
        minWidth: `${placeholder.length}em`,
        width: `${Math.floor(word.surface.length)}em`,
        height: '20px',
        backgroundColor: color,
        borderRadius: '10px',
      }}
    />
  )
})

export default ExerciseHearing
