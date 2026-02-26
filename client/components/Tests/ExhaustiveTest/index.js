import React, { useEffect, useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import {
  getTestQuestions,
  resetTests,
  getHistory,
  removeFromHistory,
} from 'Utilities/redux/testReducer'

import { updateGroupSelect } from 'Utilities/redux/userReducer'
import { useLearningLanguage } from 'Utilities/common'
import useWindowDimension from 'Utilities/windowDimensions'
import moment from 'moment'
import Spinner from 'Components/Spinner'
import ResponsiveDatePicker from 'Components/ResponsiveDatePicker'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import { getGroups } from 'Utilities/redux/groupsReducer'
import ReportButton from 'Components/ReportButton'
import StartModal from 'Components/TimedActivityStartModal'
import ExhaustiveTest from './ExhaustiveTest'
import TestReport from './TestReport'
import History from '../../History'

const PickDate = ({ date, setDate }) => (
  <ResponsiveDatePicker selected={date} onChange={date => setDate(date)} />
)

const ExhaustiveTestView = () => {
  const dispatch = useDispatch()
  const [startDate, setStartDate] = useState(moment().subtract(2, 'months').toDate())
  const [endDate, setEndDate] = useState(moment().endOf('day').toDate())
  const learningLanguage = useLearningLanguage()
  const currentGroupId = useSelector(({ user }) => user.data.user.last_selected_group)
  const [selectedGroup, setSelectedGroup] = useState(currentGroupId || '')
  const [currentGroup, setCurrentGroup] = useState()
  const [startModalOpen, setStartModalOpen] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [sessionToDelete, setSessionToDelete] = useState(false)
  const { exhaustiveTestSessionId, report, pending, language, history } = useSelector(
    ({ tests }) => tests
  )
  const { groups } = useSelector(({ groups }) => groups)
  const bigScreen = useWindowDimension().width >= 650

  const startTest = () => {
    setStartModalOpen(true)
    dispatch(getTestQuestions(learningLanguage, selectedGroup, true))
  }

  const continueTest = () => {
    dispatch(getTestQuestions(learningLanguage, selectedGroup))
  }

  const handleGroupChange = key => {
    setSelectedGroup(key)
    if (!(key === '')) dispatch(updateGroupSelect(key))
  }

  const handleSessionDeleteClick = sessionId => {
    setSessionToDelete(sessionId)
  }

  const deleteSession = () => {
    dispatch(removeFromHistory(learningLanguage, sessionToDelete))
  }

  const toggleHistory = () => {
    setShowHistory(!showHistory)
  }

  useEffect(() => {
    if (!exhaustiveTestSessionId) {
      dispatch(getGroups())
      dispatch(getHistory(learningLanguage, startDate, endDate))
    }
  }, [exhaustiveTestSessionId])

  useEffect(() => {
    dispatch(getHistory(learningLanguage, startDate, endDate))
  }, [startDate, endDate])

  useEffect(() => {
    if (!groups) return
    setCurrentGroup(
      groups.find(group => group.group_id === selectedGroup) || {
        groupName: 'default',
        group_id: 'default',
      }
    )
  }, [groups, selectedGroup])

  useEffect(() => {
    if (currentGroupId) {
      setSelectedGroup(currentGroupId)
    }
  }, [currentGroupId])

  useEffect(() => {
    if (language !== learningLanguage) {
      dispatch(resetTests())
    }
  }, [learningLanguage])

  if (pending) {
    return <Spinner fullHeight size={60} />
  }

  const testEnabledGroups = groups.filter(group => group.test_deadline - Date.now() > 0)

  const groupOptions = testEnabledGroups.map(({ group_id: groupId, groupName }) => ({
    value: groupId,
    text: groupName,
    key: groupId,
  }))

  const filterHistoryByDate = () =>
    history.filter(test => {
      const testTime = moment(test.date)
      return testTime.isAfter(startDate) && testTime.isBefore(endDate)
    })

  return (
    <div className="cont-tall cont flex-col auto gap-row-sm">
      <div className="grow ps-nm flex-col gap-row-sm">
        {!exhaustiveTestSessionId && (
          <div className="pl-nm pt-nm">
            <Button onClick={startTest} data-cy="start-test">
              <FormattedMessage id="start-a-new-test" />
            </Button>
            {language && (
              <Button onClick={continueTest} style={{ marginLeft: '1rem' }}>
                <FormattedMessage id="resume-test" />
              </Button>
            )}
            {groups && currentGroup && (
              <div style={{ marginTop: '1.5em' }}>
                <div>
                  <FormattedMessage id="Group" />
                </div>
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
              <hr style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }} />
              <Button onClick={toggleHistory}>
                <FormattedMessage id={showHistory ? 'Hide history' : 'Show history'} />
              </Button>

              {showHistory && history && (
                <>
                  <div className="date-pickers-container">
                    {bigScreen ? (
                      <div className="date-pickers gap-col-sm">
                        <span className="bold">
                          <FormattedMessage id="Showing results for" />
                        </span>
                        <div style={{ marginLeft: '2em' }}>
                          <FormattedMessage id="date-start" />{' '}
                          <PickDate id="start" date={startDate} setDate={setStartDate} />
                        </div>
                        <div style={{ marginLeft: '2em' }}>
                          <FormattedMessage id="date-end" />{' '}
                          <PickDate date={endDate} setDate={setEndDate} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="bold" style={{ fontSize: '1.3em' }}>
                          <FormattedMessage id="Showing results for" />
                        </span>
                        <br />
                        <div className="date-pickers gap-col-sm" style={{ marginTop: '0.5em' }}>
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
                      </>
                    )}
                  </div>
                  <ConfirmationWarning
                    open={!!sessionToDelete}
                    setOpen={setSessionToDelete}
                    action={deleteSession}
                  >
                    <FormattedMessage id="test-results-remove-confirmation" />
                  </ConfirmationWarning>
                  <History
                    history={filterHistoryByDate()}
                    testView
                    handleDelete={handleSessionDeleteClick}
                  />
                </>
              )}
            </>
          </div>
        )}
        {report && <TestReport />}
        {exhaustiveTestSessionId && <ExhaustiveTest showingInfo={startModalOpen} />}
        <StartModal
          open={startModalOpen}
          setOpen={setStartModalOpen}
          activity="exhaustive-test"
          onBackClick={() => dispatch(resetTests())}
        />
        <ReportButton extraClass="align-self-end mb-sm" />
      </div>
    </div>
  )
}

export default ExhaustiveTestView
