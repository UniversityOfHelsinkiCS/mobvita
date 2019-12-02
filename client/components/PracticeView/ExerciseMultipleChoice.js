import React, { useEffect, useState } from 'react'
import { Dropdown } from 'semantic-ui-react'

const ExerciseMultipleChoice = ({ word, handleChange, value }) => {
  const [className, setClassName] = useState('untouched-multiple')
  const [options, setOptions] = useState([])
  const [touched, setTouched] = useState(false)
  const { tested, isWrong } = word

  useEffect(() => {
    if (tested) {
      if (isWrong) {
        setClassName('wrong')
      } else {
        setClassName('correct')
      }
    }
  }, [tested])


  useEffect(() => {
    const temp = word.choices.map((choice) => {
      return {
        key: `${word.ID}_${choice}`,
        value: choice,
        text: choice,
      }
    })
    setOptions(temp)
  }, [word])


  const maximumLength = word.choices.reduce((maxLength, currLength) => {
    if (currLength.length > maxLength) return currLength.length
    return maxLength
  }, 0)



  const placeholder = '_'.repeat(maximumLength)

  const handle = (e, word, data) => {

    if (!touched) {
      setTouched(true)
      setClassName("touched-multiple")
    }

    handleChange(e, word, data)
  }


  return (
    <Dropdown
      key={word.ID}
      options={options}
      placeholder={placeholder}
      value={value}
      onChange={(e, data) => handle(e, word, data)}
      selection
      floating
      className={className}
      style={{
        minWidth: `${maximumLength}em`, width: `${maximumLength}em`, height: '1em', minHeight: 0, lineHeight: 0, border: "none", borderRadius: '6px'
      }}
    />
  )
}

export default ExerciseMultipleChoice
