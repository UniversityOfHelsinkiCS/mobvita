import React, { useEffect, useRef, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AppSelect from 'Components/ui/AppSelect'
import { useTextWidth } from 'Utilities/common'

const ExerciseMultipleChoice = ({ word }) => {
  const [options, setOptions] = useState([])
  const triggerRef = useRef(null)

  useEffect(() => {
    if (Array.isArray(word.choices)) {
      const temp = word.choices.map(choice => ({
        value: choice,
        label: choice,
      }))
      setOptions(temp)
    } else {
      let temp = []
      Object.keys(word.choices).map(key =>
        word.choices[key].forEach(choice => {
          temp = [
            ...temp,
            {
              value: choice,
              label: choice,
            },
          ]
        })
      )
      setOptions(temp)
    }
  }, [word])

  let testString = ''
  if (Array.isArray(word.choices)) {
    word.choices.forEach(choice => {
      if (choice.length > testString.length) {
        testString = choice
      }
    })
  } else {
    Object.keys(word.choices).map(key =>
      word.choices[key].forEach(choice => {
        if (choice.length > testString.length) {
          testString = choice
        }
      })
    )
  }

  // Measured off the trigger button, which `.exercise-multiple` puts on the reading font. Called
  // before the early return below, so the hook order stays fixed however many choices arrive.
  const buttonWidth = useTextWidth(testString, triggerRef)

  if (options.length < 2) {
    return null
  }

  return (
    <AppSelect
      key={word.ID}
      value=""
      options={options}
      onChange={() => {}}
      minWidth={120}
      trigger={
        <button
          ref={triggerRef}
          type="button"
          data-cy="previous-chosen-multiple-choice"
          className="exercise-multiple control-mode control-mode-chosen"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            font: 'inherit',
            cursor: 'pointer',
            width: buttonWidth,
            minWidth: buttonWidth,
            height: '1.5em',
          }}
        >
          {word.choices[0] || options[0].value}
          <KeyboardArrowDownIcon fontSize="small" />
        </button>
      }
    />
  )
}

export default ExerciseMultipleChoice
