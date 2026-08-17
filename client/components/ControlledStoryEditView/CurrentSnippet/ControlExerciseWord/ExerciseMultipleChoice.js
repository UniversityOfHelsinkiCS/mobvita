import React, { useEffect, useState } from 'react'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AppSelect from 'Components/ui/AppSelect'
import { getTextWidth } from 'Utilities/common'

const ExerciseMultipleChoice = ({ word, choices, setShowRemoveTooltip }) => {
  const [options, setOptions] = useState([])
  const { ID: wordId } = word

  useEffect(() => {
    const temp = choices && Array.isArray(choices) ? choices.sort().map(choice => ({
      key: `${word.ID}_${choice}`,
      value: choice,
      label: choice,
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

  return (
    // The click handler lives on the wrapper (AppSelect's trigger gets its own open handler), so a
    // click anywhere on the control still flags the remove tooltip, as the semantic Dropdown did.
    <span
      key={word.ID}
      onClick={handle}
      data-cy={`control-exercise-multiple-choice-${wordId}`}
      style={{ display: 'inline-flex' }}
    >
      <AppSelect
        options={options}
        value={choices && choices[0]}
        // The semantic Dropdown had no onChange either — the value is fixed, picking a row is a no-op.
        onChange={() => {}}
        minWidth={120}
        trigger={
          <button
            type="button"
            className="exercise-multiple control-mode control-mode-chosen"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              font: 'inherit',
              width: getInputWidth(),
              minWidth: getInputWidth(),
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            {choices && choices[0]}
            <KeyboardArrowDownIcon fontSize="small" style={{ flexShrink: 0 }} />
          </button>
        }
      />
    </span>
  )
}

export default ExerciseMultipleChoice
