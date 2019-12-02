import React, { useState, useEffect } from 'react'

import { Input, Icon } from 'semantic-ui-react'

const ExerciseCloze = ({ word, handleChange, handleClick, value }) => {
  const [color, setColor] = useState('#ffffab')
  const [touched, setTouched] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const { isWrong, tested } = word

  const clickVolume = () => handleClick(word.base || word.bases, word.lemmas)

  const changeValue = (e) => {
    if (!touched) {
      setTouched(true)
      setColor('lightyellow')
    }
    handleChange(e, word)
  }

  useEffect(() => {
    if (tested) {
      if (isWrong) {
        setColor('#ff5e5e')
      } else {
        setColor('yellowgreen')
        setDisabled(true)
      }
    }
  }, [tested])

  return (
    <Input
      autoCapitalize="off"
      disabled={disabled}
      key={word.ID}
      icon={<Icon name="volume up" link onClick={clickVolume} style={{ marginRight: '4px' }} />}
      placeholder={`${word.base || word.bases}`}
      value={value}
      onChange={changeValue}
      transparent
      style={{
        minWidth: `${Math.floor(word.base ? word.base.length : word.bases.length)}em`,
        width: `${Math.floor(word.surface.length + 1)}em`,
        marginRight: '2px',
        height: '1.5em',
        borderRadius: '6px',
        backgroundColor: color,
      }}
    />
  )
}

export default ExerciseCloze
