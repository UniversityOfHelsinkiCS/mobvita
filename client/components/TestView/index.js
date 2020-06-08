import React, { useEffect, useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
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

  const groupOptions = [{ value: '', text: 'default', key: 'default' }]
    .concat(groups.map(({ group_id: groupId, groupName }) => (
      {
        value: groupId,
        text: groupName,
        key: groupId,
      }
    )))

  return (
    <div className="component-container">
      {!sessionId && (
        <div>
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
          {groups && currentGroup
          && (
            <div style={{ marginTop: '0.5em' }}>
              <div><FormattedMessage id="Group" /></div>
              <Dropdown
                selection
                options={groupOptions}
                value={currentGroup.group_id}
                onChange={(_, data) => handleGroupChange(data.value)}
                placeholder="Group"
              />
            </div>
          )}
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
