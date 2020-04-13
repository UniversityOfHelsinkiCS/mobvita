import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import { getTextWidth } from 'Utilities/common'

const ExerciseMultipleChoice = ({ word, handleChange }) => {
  const [className, setClassName] = useState('exercise-multiple untouched')
  const [options, setOptions] = useState([])
  const [touched, setTouched] = useState(false)

  const currentAnswer = useSelector(({ practice }) => practice.currentAnswers[word.ID])

  const { tested, isWrong } = word
  const value = currentAnswer ? currentAnswer.users_answer : ''

  useEffect(() => {
    if (tested) {
      if (isWrong) {
        setClassName(`${className} wrong`)
      } else {
        setClassName(`${className} correct`)
      }
    }
  }, [tested])


  useEffect(() => {
    const temp = word.choices.map(choice => ({
      key: `${word.ID}_${choice}`,
      value: choice,
      text: choice,
    }))
    setOptions(temp)
  }, [word])


  const maximumLength = word.choices.reduce((maxLength, currLength) => {
    if (currLength.length > maxLength) return currLength.length
    return maxLength
  }, 0)


  let testString = ''
  word.choices.forEach((choice) => {
    if (choice.length > testString.length) {
      testString = choice
    }
  })

  const placeholder = '_'.repeat(maximumLength)

  const handle = (e, word, data) => {
    if (!touched) {
      setTouched(true)
      setClassName('exercise-multiple touched')
    }

    handleChange(e, word, data)
  }


  return (
    <Dropdown
      key={word.ID}
      disabled={tested && !isWrong}
      options={options}
      placeholder={placeholder}
      value={value}
      onChange={(e, data) => handle(e, word, data)}
      selection
      floating
      style={{ width: getTextWidth(testString), minWidth: getTextWidth(testString) }}
      className={`${className}`}
    />
  )
}

export default ExerciseMultipleChoice
