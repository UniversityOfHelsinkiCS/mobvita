import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setFocusedWord } from 'Utilities/redux/practiceReducer'

import { Input, Icon } from 'semantic-ui-react'

const ExerciseCloze = ({ word, handleChange, handleClick, value }) => {
  const [color, setColor] = useState('lightyellow')
  const [touched, setTouched] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const { isWrong, tested } = word
  const [className, setClassName] = useState('exercise cloze-untouched')
  const [show, setShow] = useState(false)

  const dispatch = useDispatch()

  const clickVolume = () => handleClick(word.base || word.bases, word.lemmas)

  const changeValue = e => {
    if (!touched) {
      setTouched(true)
      setColor('white')
    }
    handleChange(e, word)
  }

  // Font is changed to 16px and back to disable iOS safari zoom in effect
  const changeElementFont = (element, size = '') => {
    element.style.fontSize = size
  }

  const handleBlur = () => {
    handleChange(value, word)
    setShow(false)
  }

  const handleFocus = e => {
    if (!touched) {
      setTouched(true)
      if (!tested) setClassName('exercise cloze-touched')
      handleChange(value, word)
    }
    setShow(!show)
    dispatch(setFocusedWord(word))
    changeElementFont(e.target)
  }

  const focusNextClozeOrHearing = element => {
    const { form } = element
    const nextElement = form.elements[Array.prototype.indexOf.call(form, element) + 1]
    const isNextElementInput = nextElement.className.includes('exercize')
    if (isNextElementInput) changeElementFont(nextElement, '16px')
    nextElement.focus()
  }

  const handleKeyDown = e => {
    const isEnterPressed = e.keyCode === 13
    if (isEnterPressed) {
      focusNextClozeOrHearing(e.target)
      e.preventDefault()
    }
  }

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
      autoCapitalize="off"
      onKeyDown={handleKeyDown}
      disabled={disabled}
      key={word.ID}
      name={word.ID}
      icon={<Icon name="volume up" link onClick={clickVolume} style={{ marginRight: '4px' }} />}
      placeholder={`${word.base || word.bases}`}
      value={value}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onChange={changeValue}
      className={className}
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
