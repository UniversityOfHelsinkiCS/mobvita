import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import { skillLevels } from 'Utilities/common'
import { Dropdown } from 'semantic-ui-react'
import { isNumber } from 'lodash'

const CEFRDropdown = ({
  addNew = false,
  estimate,
  index,
  updatedCEFRHistory,
  setUpdatedCEFRHistory,
  setModified,
}) => {
  const intl = useIntl()
  const userId = useSelector(state => state.user.data.user.oid)
  const [chosenValue, setChosenValue] = useState(
    addNew ? `${intl.formatMessage({ id: 'student-cefr-placeholder' })}` : estimate.grade
  )
  const cefrLevelOptions = skillLevels.map((level, ind) => ({
    key: ind,
    text: level,
    value: JSON.stringify(ind), // needs to be string
  }))

  useEffect(() => {
    if (estimate) {
      setChosenValue(estimate.grade)
    }
  }, [estimate?.grade])

  useEffect(() => {
    if (index !== undefined) {
      // index 0 wont come here
      const newList = [...updatedCEFRHistory]
      newList[index] = {
        ...newList[index],
        grade: chosenValue,
        source: updatedCEFRHistory[index].source, // 'teacher',
        tagger: userId,
      }
      setUpdatedCEFRHistory(newList)
    } else if (isNumber(chosenValue)) {
      const newList = [
        {
          grade: chosenValue,
          source: 'teacher',
          tagger: userId,
          timestamp: parseInt(new Date() / 1000),
        },
        ...updatedCEFRHistory,
      ]
      setUpdatedCEFRHistory(newList)
    }
  }, [chosenValue])

  const handleCEFRChange = value => {
    setChosenValue(JSON.parse(value))
    setModified(true)
  }

  return (
    <Dropdown
      style={{ width: addNew && '280px' }}
      className="interactable"
      text={addNew ? chosenValue : skillLevels[chosenValue]}
      selection
      fluid
      options={cefrLevelOptions}
      onChange={(_, { value }) => handleCEFRChange(value)}
    />
  )
}

export default CEFRDropdown
