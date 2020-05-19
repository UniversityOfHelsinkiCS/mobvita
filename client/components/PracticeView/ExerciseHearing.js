import React, { createRef, useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { debounce } from 'lodash'
import { Icon } from 'semantic-ui-react'
import { getTextWidth, speak, learningLanguageSelector, respVoiceLanguages } from 'Utilities/common'
import { setFocusedWord } from 'Utilities/redux/practiceReducer'


const ExerciseHearing = ({ word, handleChange }) => {
  const [value, setValue] = useState('')

  const [className, setClassname] = useState('exercise hearing-untouched')
  const [touched, setTouched] = useState(false)
  const [focusTimeout, setFocusTimeout] = useState(false)
  const inputRef = createRef(null)

  const currentAnswer = useSelector(({ practice }) => practice.currentAnswers[word.ID])
  const learningLanguage = useSelector(learningLanguageSelector)

  const dispatch = useDispatch()

  const { isWrong, tested } = word

  const voice = respVoiceLanguages[learningLanguage]

  const debouncedChange = useCallback(
    debounce((val) => {
      handleChange(val, word)
    }, 300),
    [word],
  )

  const giveHint = () => {
    if (word.base !== word.surface) handleChange(word.base, word)
  }

  useEffect(() => {
    if (tested) {
      if (isWrong) {
        setClassname('exercise wrong')
        giveHint()
      } else {
        setClassname('exercise correct')
      }
    }
  }, [tested])

  useEffect(() => {
    const val = currentAnswer ? currentAnswer.users_answer : ''
    setValue(val)
  }, [currentAnswer])

  const speakerClickHandler = (word) => {
    speak(word.surface, voice)
    inputRef.current.focus()
  }

  const handleInputFocus = () => {
    if (!touched) {
      if (!tested) setClassname('exercise hearing-touched')
      setTouched(true)
      handleChange(value, word)
    }
    dispatch(setFocusedWord(word))
    if (!focusTimeout) {
      speak(word.surface, voice)
      setFocusTimeout(true)
      setTimeout(() => {
        setFocusTimeout(false)
      }, 500)
    }
  }

  const handle = (e) => {
    setValue(e.target.value)
    debouncedChange(e.target.value)
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
    <span>
      <input
        onKeyDown={handleKeyDown}
        data-cy="exercise-hearing"
        disabled={tested && !isWrong}
        ref={inputRef}
        key={word.ID}
        onChange={handle}
        value={value}
        onFocus={handleInputFocus}
        className={className}
        style={{
          width: getTextWidth(word.surface),
          minWidth: getTextWidth(word.surface),
          marginRight: '2px',
          height: '1.5em',
          lineHeight: 'normal',
        }}
      />
      <Icon name="volume up" link onClick={() => speakerClickHandler(word.surface)} style={{ marginLeft: '-25px' }} />
    </span>
  )
}

export default ExerciseHearing
