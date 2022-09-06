import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { skillLevels } from 'Utilities/common'
import { Dropdown } from 'semantic-ui-react'

const CEFRDropdown = ({ estimate, index, updatedCEFRHistory, setUpdatedCEFRHistory }) => {
  const userId = useSelector(state => state.user.data.user.oid)
  const [chosenValue, setChosenValue] = useState(estimate.grade)
  const cefrLevelOptions = skillLevels.slice(1, 8 + 1).map((level, ind) => ({
    key: ind + 1,
    text: level,
    value: JSON.stringify(ind + 1), // needs to be string
  }))

  useEffect(() => {
    setChosenValue(estimate.grade)
  }, [estimate.grade])

  useEffect(() => {
    const newList = [...updatedCEFRHistory]
    newList[index] = {
      ...newList[index],
      grade: chosenValue,
      source: 'teacher',
      tagger: userId,
    }

    setUpdatedCEFRHistory(newList)
  }, [chosenValue])

  const handleCEFRChange = value => {
    setChosenValue(JSON.parse(value))
  }

  return (
    <Dropdown
      text={skillLevels[chosenValue]}
      selection
      fluid
      options={cefrLevelOptions}
      onChange={(_, { value }) => handleCEFRChange(value)}
    />
  )
}

export default CEFRDropdown
