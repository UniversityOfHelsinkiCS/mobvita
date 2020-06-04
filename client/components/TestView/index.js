import React, { useEffect, useState } from 'react'
import { Button, Dropdown } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { getTestQuestions, resetTest, getHistory } from 'Utilities/redux/testReducer'
import { learningLanguageSelector } from 'Utilities/common'
import Spinner from 'Components/Spinner'
import { getGroups } from 'Utilities/redux/groupsReducer'
import TestView from './Test'


const ReportDisplay = ({ report }) => {
  const { message, correctRate } = report
  if (message !== 'OK') {
    return <div>{message}</div>
  }

  return (
    <div>Test completed. Your score: {correctRate}%</div>
  )
}

const TestIndex = () => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const currentGroupId = useSelector(({ user }) => user.data.user.last_selected_group)
  const [selectedGroup, setSelectedGroup] = useState('no group')
  const { sessionId, report, pending, language, history } = useSelector(({ tests }) => tests)
  const { groups } = useSelector(({ groups }) => groups)

  const currentGroup = groups.find(group => group.group_id === selectedGroup)
   || { group_id: '', groupName: 'default' }

  const startTest = () => {
    dispatch(getTestQuestions(learningLanguage, selectedGroup, true))
  }

  const continueTest = () => {
    dispatch(getTestQuestions(learningLanguage, selectedGroup))
  }

  const handleGroupChange = (key) => {
    setSelectedGroup(key)
  }

  useEffect(() => {
    dispatch(getGroups())
    dispatch(getHistory(learningLanguage))
  }, [])

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
          {groups
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
          {history && history.length > 0 && (
            <div>
              <h3>Latest test:</h3>
              <div>{history[history.length - 1].date}</div>
              <div>
                {Object.entries(history[history.length - 1].section_counts).map(([name, result]) => (
                  <div>{name}: {result.correct} / {result.total}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {report && <ReportDisplay report={report} />}
      {sessionId && <TestView />}
    </div>
  )
}

export default TestIndex
