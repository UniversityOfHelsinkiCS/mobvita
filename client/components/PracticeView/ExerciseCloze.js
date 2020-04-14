import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { debounce } from 'lodash'
import { getTextWidth, dictionaryLanguageSelector } from 'Utilities/common'
import { setFocusedWord } from 'Utilities/redux/practiceReducer'
import Tooltip from './Tooltip'

const ExerciseCloze = ({ word, handleChange, handleClick }) => {
  const [value, setValue] = useState('')
  const [className, setClassName] = useState('cloze untouched')
  const [touched, setTouched] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { isWrong, tested } = word
  const [show, setShow] = useState(false)
  const target = useRef()

  const debouncedChange = useCallback(
    debounce((val) => {
      handleChange(val, word)
    }, 300),
    [word],
  )

  const currentAnswer = useSelector(({ practice }) => practice.currentAnswers[word.ID])

  const dispatch = useDispatch()


  const handleTooltipClick = () => handleClick(word.base || word.bases, word.lemmas)

  const changeValue = (e) => {
    setValue(e.target.value)
    debouncedChange(e.target.value)
  }

  useEffect(() => {
    const val = currentAnswer ? currentAnswer.users_answer : ''
    setValue(val)
  }, [currentAnswer])

  useEffect(() => {
    if (tested) {
      if (isWrong) {
        setClassName('cloze wrong')
      } else {
        setClassName('cloze correct')
        setDisabled(true)
      }
    }
  }, [tested])

  const tooltip = word.message
    ? (
      <div onClick={handleTooltipClick}>
        <div className="tooltip-green">{word.message}</div>
        <div className="tooltip-blue">{`${word.base || word.bases} → ${dictionaryLanguage}`}</div>
      </div>
    ) : (
      <div onClick={handleTooltipClick}>
        <div className="tooltip-blue">{`${word.base || word.bases} → ${dictionaryLanguage}`}</div>
      </div>
    )

  const handleDelayedBlur = () => { // It just works...
    setTimeout(() => {
      setShow(false)
    }, 100)
  }

  const handleFocus = () => {
    if (!touched) {
      setTouched(true)
      setClassName('cloze touched')
      handleChange(value, word)
    }
    setShow(!show)
    dispatch(setFocusedWord(word))
  }

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      const { form } = e.target
      const index = Array.prototype.indexOf.call(form, e.target)
      form.elements[index + 1].focus()
      e.preventDefault()
    }
  }

  return (
    <Tooltip placement="top" trigger="none" onVisibilityChange={setShow} tooltipShown={show} closeOnOutOfBoundaries tooltip={tooltip} additionalClassnames="clickable">
      <input
        onKeyDown={handleKeyDown}
        ref={target}
        data-cy="exercise-cloze"
        autoCapitalize="off"
        disabled={disabled}
        key={word.ID}
        name={word.ID}
        placeholder={`${word.base || word.bases}`}
        value={value}
        onChange={changeValue}
        onBlur={handleDelayedBlur}
        onFocus={handleFocus}
        className={className}
        style={{
          width: ((word.surface > word.base) ? getTextWidth(word.surface) : getTextWidth(word.base)),
          marginRight: '2px',
          height: '1.5em',
          borderRadius: '6px',
          lineHeight: 'normal',
        }}
      />
    </Tooltip>
  )
}

export default ExerciseCloze
