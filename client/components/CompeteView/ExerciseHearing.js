import React, { createRef, useState, useEffect } from 'react'
import { Input, Icon } from 'semantic-ui-react'

const ExerciseHearing = ({ word, handleClick, handleChange, value }) => {
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

  return (
    <Input
      ref={inputRef}
      key={word.ID}
      onChange={e => handleChange(e, word)}
      value={value}
      icon={<Icon name="volume up" link onClick={() => clickHandler(word.surface)} style={{ marginRight: '4px' }} />}
      transparent
      autoCapitalize="off"
      style={{
        minWidth: `${word.surface.length + 1}em`,
        width: `${Math.floor(word.surface.length + 1)}em`,
        marginRight: '2px',
        height: '1.5em',
        borderRadius: '6px',
        backgroundColor: color,
      }}
    />
  )
}

export default ExerciseHearing
