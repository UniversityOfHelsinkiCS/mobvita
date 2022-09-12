import React, { useEffect, useState } from 'react'
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

  const getInputWidth = () => {
    const width = getTextWidth(choices[0])
    if (width >= 150) {
      return width + 20
    }

    return width
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
      style={{ width: getInputWidth(), minWidth: getInputWidth() }}
      className="exercise-multiple control-mode control-mode-chosen"
    />
  )
}

export default ExerciseMultipleChoice
