import React, { useState } from 'react'
import { skillLevels } from 'Utilities/common'
import { Dropdown } from 'semantic-ui-react'

const CEFRDropdown = ({ grade }) => {
  const [chosenValue, setChosenValue] = useState(grade)
  const cefrLevelOptions = skillLevels.slice(1, 8 + 1).map((level, index) => ({
    key: index + 1,
    text: level,
    value: JSON.stringify(index + 1), // needs to be string
  }))

  return (
    <Dropdown
      text={skillLevels[chosenValue]}
      selection
      fluid
      options={cefrLevelOptions}
      onChange={(_, { value }) => setChosenValue(JSON.parse(value))}
    />
  )
}

export default CEFRDropdown
