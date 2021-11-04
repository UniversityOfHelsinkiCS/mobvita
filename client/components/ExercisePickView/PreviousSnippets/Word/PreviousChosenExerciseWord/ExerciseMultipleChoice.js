import React, { useEffect, useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { getTextWidth } from 'Utilities/common'

const ExerciseMultipleChoice = ({ word }) => {
  const [options, setOptions] = useState([])

  useEffect(() => {
    const temp = word.choices.sort().map(choice => ({
      key: `${word.ID}_${choice}`,
      value: choice,
      text: choice,
    }))
    setOptions(temp)
  }, [word])

  let testString = ''
  word.choices.forEach(choice => {
    if (choice.length > testString.length) {
      testString = choice
    }
  })

  return (
    <Dropdown
      key={word.ID}
      options={options}
      placeholder=" "
      value=""
      selection
      floating
      style={{
        width: getTextWidth(testString),
        minWidth: getTextWidth(testString),
        height: '1.5em',
      }}
      className="exercise-multiple control-mode control-mode-previous-chosen"
    />
  )
}

export default ExerciseMultipleChoice