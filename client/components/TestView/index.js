import React, { useEffect, useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { getTestQuestions, resetTest, getHistory } from 'Utilities/redux/testReducer'
import { useLearningLanguage, hiddenFeatures } from 'Utilities/common'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import Spinner from 'Components/Spinner'
import { getGroups } from 'Utilities/redux/groupsReducer'
import TestView from './Test'
import TestReport from './TestReport'
import History from '../History'

const PickDate = ({ date, setDate }) => (
  <DatePicker
    selected={date}
    onChange={date => setDate(date)}
    dateFormat="yyyy/MM/dd"
  />
)

const TestIndex = () => {
  const dispatch = useDispatch()
  const [startDate, setStartDate] = useState(moment().subtract(2, 'months').toDate())
  const [endDate, setEndDate] = useState(moment().toDate())
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
    if (!sessionId) {
      dispatch(getGroups())
      dispatch(getHistory(learningLanguage, startDate, endDate))
    }
  }, [sessionId])

  useEffect(() => {
    dispatch(getHistory(learningLanguage, startDate, endDate))
  }, [startDate, endDate])

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
  const filterHistoryByDate = () => history.filter((test) => {
    const testTime = moment(test.date)
    return testTime.isAfter(startDate) && testTime.isBefore(endDate)
  })

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
              <FormattedMessage id="resume-test" />
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

          <>
            <hr />
            <Button onClick={toggleHistory}>
              <FormattedMessage id={showHistory ? 'Hide history' : 'Show history'} />
            </Button>

            {showHistory && history && (
              <>
                <div className="date-pickers gap-1">
                  <div>
                    <FormattedMessage id="date-start" />
                    <br />
                    <PickDate id="start" date={startDate} setDate={setStartDate} />
                  </div>
                  <div>
                    <FormattedMessage id="date-end" />
                    <br />
                    <PickDate date={endDate} setDate={setEndDate} />
                  </div>
                </div>
                <History history={filterHistoryByDate()} />
              </>
            )}
          </>

        </div>
      )}
      {report && <TestReport />}
      {sessionId && <TestView />}
    </div>
  )
}

export default TestIndex
