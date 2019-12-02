import React, { useEffect, useState } from 'react'
import { Dropdown } from 'semantic-ui-react'

const ExerciseMultipleChoice = ({ word, handleChange, value }) => {
  const [color, setColor] = useState('LightCyan')
  const [options, setOptions] = useState([])
  const { tested, isWrong } = word

  useEffect(() => {
    if (tested) {
      if (isWrong) {
        setColor('#ff5e5e')
      } else {
        setColor('yellowgreen')
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

  return (
    <Dropdown
      key={word.ID}
      options={options}
      placeholder={placeholder}
      value={value}
      onChange={(e, data) => handleChange(e, word, data)}
      selection
      floating
      style={{
        minWidth: `${maximumLength}em`, width: `${maximumLength}em`, height: '1em', backgroundColor: color, minHeight: 0, lineHeight: 0, border: "none", borderRadius: '6px'
      }}
    />
  )
}

export default ExerciseMultipleChoice
