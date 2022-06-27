import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Dropdown } from 'semantic-ui-react'
import { getTextWidth } from 'Utilities/common'

const ExerciseMultipleChoice = ({ word, choices, setShowRemoveTooltip }) => {
  const [options, setOptions] = useState([])
  const { ID: wordId } = word

  useEffect(() => {
    const temp = choices.sort().map(choice => ({
      key: `${word.ID}_${choice}`,
      value: choice,
      text: choice,
    }))
    setOptions(temp)
  }, [word])

  const handle = () => {
    setShowRemoveTooltip(true)
  }

  return (
    <Dropdown
      key={word.ID}
      options={options}
      placeholder={choices[0]}
      value={choices[0]}
      onClick={handle}
      selection
      floating
      style={{ width: getTextWidth(choices[0]), minWidth: getTextWidth(choices[0]) }}
      className="exercise-multiple control-mode control-mode-chosen"
    />
  )
}

export default ExerciseMultipleChoice
