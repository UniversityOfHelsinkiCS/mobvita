import React, { useEffect, useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { getTestQuestions, resetTest, getHistory } from 'Utilities/redux/testReducer'
import { useLearningLanguage, hiddenFeatures } from 'Utilities/common'
import Spinner from 'Components/Spinner'
import { getGroups } from 'Utilities/redux/groupsReducer'
import TestView from './Test'
import TestReport from './TestReport'
import History from '../History'


const TestIndex = () => {
  const dispatch = useDispatch()
  const learningLanguage = useLearningLanguage()
  const currentGroupId = useSelector(({ user }) => user.data.user.last_selected_group)
  const [selectedGroup, setSelectedGroup] = useState('')
  const [currentGroup, setCurrentGroup] = useState()
  const [showHistory, setShowHistory] = useState(false)
  const { sessionId, report, pending, language, history } = useSelector(({ tests }) => tests)
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
    dispatch(getHistory(learningLanguage))
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
          <Button onClick={startTest} data-cy="start-test">
            <FormattedMessage id="start-a-new-test" />
          </Button>
          {language
            && (
            <Button onClick={continueTest}>
              <FormattedMessage id="Continue test" />
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
          {hiddenFeatures && (
            <>
              <hr />
              <Button onClick={toggleHistory}>
                <FormattedMessage id={showHistory ? 'Hide history' : 'Show history'} />
              </Button>

              {showHistory && <History history={history} />}
            </>
          )}
        </div>
      )}
      {report && <TestReport />}
      {sessionId && <TestView />}
    </div>
  )
}

export default TestIndex
