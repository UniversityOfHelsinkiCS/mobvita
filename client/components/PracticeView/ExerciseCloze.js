import React, { useState, useEffect } from 'react'

import { Input, Icon } from 'semantic-ui-react'

const ExerciseCloze = ({ word, handleChange, handleClick, value }) => {
  const [color, setColor] = useState('lightyellow')
  const [touched, setTouched] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const { isWrong, tested } = word

  const clickVolume = () => handleClick(word.base || word.bases, word.lemmas)

  const changeValue = (e) => {
    if (!touched) {
      setTouched(true)
      setColor('white')
    }
    handleChange(e, word)
  }

  useEffect(() => {
    if (tested) {
      if (isWrong) {
        setColor('firebrick')
      } else {
        setColor('yellowgreen')
        setDisabled(true)
      }
    }
  }, [tested])

  return (
    <Input
      disabled={disabled}
      key={word.ID}
      icon={<Icon name="volume up" link onClick={clickVolume} />}
      placeholder={`${word.base || word.bases}`}
      value={value}
      onChange={changeValue}
      transparent
      style={{
        minWidth: `${Math.floor(word.base ? word.base.length : word.bases.length)}em`,
        width: `${Math.floor(word.surface.length + 2)}em`,
        height: '30px',
        backgroundColor: color,
        borderRadius: '10px',
      }}
    />
  )
}

export default ExerciseCloze
