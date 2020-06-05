import React, { useEffect, useState } from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { getTestQuestions, resetTest } from 'Utilities/redux/testReducer'
import { learningLanguageSelector } from 'Utilities/common'
import Spinner from 'Components/Spinner'
import { getGroups } from 'Utilities/redux/groupsReducer'
import TestView from './Test'
import TestReport from './TestReport'
import History from './History'


const TestIndex = () => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const currentGroupId = useSelector(({ user }) => user.data.user.last_selected_group)
  const [selectedGroup, setSelectedGroup] = useState('default')
  const [currentGroup, setCurrentGroup] = useState()
  const [showHistory, setShowHistory] = useState(false)
  const { sessionId, report, pending, language } = useSelector(({ tests }) => tests)
  const { groups } = useSelector(({ groups }) => groups)

  const startTest = () => {
    dispatch(getTestQuestions(learningLanguage, selectedGroup, true))
  }

  const continueTest = () => {
    dispatch(getTestQuestions(learningLanguage, selectedGroup))
  }

  const handleGroupChange = (key) => {
    setSelectedGroup(key)
  }

  const toggleHistory = () => {
    setShowHistory(!showHistory)
  }

  useEffect(() => {
    dispatch(getGroups())
  }, [])

  useEffect(() => {
    if (!groups) return
    setCurrentGroup(
      groups.find(group => group.group_id === selectedGroup) || { groupName: 'default', group_id: 'default' },
    )
  }, [groups, selectedGroup])

  useEffect(() => {
    if (currentGroupId) { setSelectedGroup(currentGroupId) }
  }, [currentGroupId])

  useEffect(() => {
    if (language !== learningLanguage) { dispatch(resetTest()) }
  }, [learningLanguage])

  if (pending) {
    return <Spinner />
  }

  return (
    <div className="component-container">
      {!sessionId && (
        <div>
          {groups && currentGroup
          && (
            <Dropdown
              style={{ marginBottom: '0.5em' }}
              className="auto-right"
              onSelect={key => handleGroupChange(key)}
            >
              <Dropdown.Toggle variant="primary" id="dropdown-basic" data-cy="select-group">
                {currentGroup.groupName}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="" key="default">default</Dropdown.Item>
                {groups.map(group => (
                  <Dropdown.Item
                    eventKey={group.group_id}
                    key={group.group_id}
                  >
                    {group.groupName}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
          <Button onClick={startTest}>
            <FormattedMessage id="start-a-new-test" />
          </Button>
          {language
            && (
            <Button onClick={continueTest}>
              <FormattedMessage id="continue-test" />
            </Button>
            )
          }
          <hr />
          <Button onClick={toggleHistory}>
            {showHistory ? 'hide history' : 'show history'}
          </Button>
          {showHistory && <History />}
        </div>
      )}
      {report && <TestReport />}
      {sessionId && <TestView />}
    </div>
  )
}

export default TestIndex
