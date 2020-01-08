import React, { createRef, useState, useEffect } from 'react'
import { Input, Icon } from 'semantic-ui-react'
import { getTextWidth } from 'Utilities/common'


const ExerciseHearing = ({ word, handleClick, handleChange, value }) => {
  const [className, setClassname] = useState('hearing untouched')
  const [touched, setTouched] = useState(false)
  const inputRef = createRef()

  const { isWrong, tested } = word

  useEffect(() => {
    if (tested) {
      if (isWrong) {
        setClassname('wrong')
      } else {
        setClassname('correct')
      }
    }
  }, [tested])

  const clickHandler = (word) => {
    handleClick(word, '')
    inputRef.current.focus()
  }

  const handle = (e, word) => {
    if (!touched) {
      setClassname('hearing touched')
      setTouched(true)
    }
    handleChange(e, word)
  }

  return (
    <Input
      ref={inputRef}
      key={word.ID}
      onChange={e => handle(e, word)}
      value={value}
      icon={<Icon name="volume up" link onClick={() => clickHandler(word.surface)} style={{ marginRight: '4px' }} />}
      transparent
      className={className}
      style={{
        width: getTextWidth(word.surface),
        minWidth: getTextWidth(word.surface),
        marginRight: '2px',
        height: '1.5em',
        borderRadius: '6px',
      }}
    />
  )
}

export default ExerciseHearing
