import React, { useEffect, useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { getTextWidth } from 'Utilities/common'

const ExerciseMultipleChoice = ({ word, choices, setShowRemoveTooltip }) => {
  const [options, setOptions] = useState([])
  const { ID: wordId } = word

  useEffect(() => {
    const temp = choices && Array.isArray(choices) ? choices.sort().map(choice => ({
      key: `${word.ID}_${choice}`,
      value: choice,
      text: choice,
    })) : []
    setOptions(temp)
  }, [word])

  const handle = () => {
    setShowRemoveTooltip(true)
  }

    const getLongestChoice = () => {
    if (!choices || !choices.length) return ''
    return choices.reduce((longest, c) => (c && c.length > (longest.length || 0) ? c : longest), '')
  }

  const getInputWidth = () => {
    const longest = getLongestChoice()
    const width = getTextWidth(longest, '400 18px Rubik') || 0
    if (width >= 150) {
      return width + 20
    }

    return width + 20 || 80
  }

  const longestChoice = getLongestChoice()

  return (
    <Dropdown
      key={word.ID}
      options={options}
      placeholder={longestChoice || (choices && choices[0])}
      value={choices && choices[0]}
      onClick={handle}
      selection
      floating
      style={{ width: getInputWidth(), minWidth: getInputWidth() }}
      className="exercise-multiple control-mode control-mode-chosen"
    />
  )
}

export default ExerciseMultipleChoice
