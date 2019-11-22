import React, { useState, useEffect } from 'react'

import { Input, Icon } from 'semantic-ui-react'

const ExerciseCloze = ({ word, handleChange, handleClick }) => {
  const [color, setColor] = useState('lightyellow')
  const [disabled, setDisabled] = useState(false)
  const { isWrong, mark, tested } = word

  useEffect(() => {
    if (tested) {
      if (isWrong) {
        setColor('red')
      } else {
        setColor('green')
        setDisabled(true)
      }
    }
  }, [tested])

  return (
    <Input
      disabled={disabled}
      key={word.ID}
      icon={<Icon name="volume up" link onClick={() => handleClick(word.base || word.bases, word.lemmas)} />}
      placeholder={`${word.base || word.bases}`}
      onChange={e => handleChange(e, word)}
      transparent
      style={{
        minWidth: `${Math.floor(word.base ? word.base.length : word.bases.length)}em`,
        width: `${Math.floor(word.surface.length + 2)}em`,
        height: '30px',
        backgroundColor: color,
        borderRadius: '10px'
      }}
    />
  )
}

export default ExerciseCloze
