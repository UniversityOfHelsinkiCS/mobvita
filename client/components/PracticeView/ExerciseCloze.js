import React, { useState, useEffect } from 'react'
import { Input, Icon } from 'semantic-ui-react'
import { getTextWidth } from 'Utilities/common'

const ExerciseCloze = ({ word, handleChange, handleClick, value }) => {
  const [className, setClassName] = useState('cloze untouched')
  const [touched, setTouched] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const { isWrong, tested } = word

  const clickVolume = () => handleClick(word.base || word.bases, word.lemmas)

  const changeValue = (e) => {
    if (!touched) {
      setTouched(true)
      setClassName('cloze touched')
    }
    handleChange(e, word)
  }

  useEffect(() => {
    if (tested) {
      if (isWrong) {
        setClassName('wrong')
      } else {
        setClassName('correct')
        setDisabled(true)
      }
    }
  }, [tested])

  return (
    <Input
      autoCapitalize="off"
      disabled={disabled}
      key={word.ID}
      icon={<Icon name="book" link onClick={clickVolume} style={{ marginRight: '4px' }} />}
      placeholder={`${word.base || word.bases}`}
      value={value}
      onChange={changeValue}
      transparent
      className={className}

      style={{
        width: ((word.surface > word.base) ? getTextWidth(word.surface) : getTextWidth(word.base)),
        marginRight: '2px',
        height: '1.5em',
        borderRadius: '6px',
      }}
    />
  )
}

export default ExerciseCloze
