import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { Link } from 'react-router-dom'
import AppSelect from 'Components/ui/AppSelect'
import AppButton from 'Components/AppButton'
import { colors, font } from 'Assets/mui_theme/designTokens'
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

const linkStyle = { color: colors.ink, textDecoration: 'underline', fontWeight: 600 }

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
    return <Spinner fullHeight spinnerColor={colors.ink} size={60} />
  }

  const testEnabledGroups = groups.filter(group => group.test_deadline - Date.now() > 0)

  const groupOptions = testEnabledGroups.map(({ group_id: groupId, groupName }) => ({
    value: groupId,
    label: groupName,
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
          <Box
            sx={{
              backgroundColor: colors.card,
              color: colors.ink,
              fontFamily: font.family,
              borderRadius: '20px',
              p: { xs: '16px', sm: '24px' },
              mt: '1.5rem',
            }}
          >
            <AppButton onClick={startTest} size="lg" data-cy="start-test">
              <FormattedMessage id="start-a-new-test" />
            </AppButton>
            {language && (
              <AppButton
                variant="secondary"
                size="lg"
                onClick={continueTest}
                style={{ marginLeft: '1rem' }}
                data-cy="resume-test"
              >
                <FormattedMessage id="resume-test" />
              </AppButton>
            )}
            {groups && currentGroup && (
              <div style={{ marginTop: '1.5em' }}>
                <div>
                  <FormattedMessage id="Group" />
                </div>
                {groupOptions.length > 0 ? (
                  <div data-cy="exhaustive-test-group-select" style={{ display: 'inline-block' }}>
                    <AppSelect
                      variant="contrast-outline"
                      options={groupOptions}
                      value={currentGroup.group_id}
                      onChange={handleGroupChange}
                      placeholder="Group"
                      minWidth={220}
                    />
                  </div>
                ) : (
                  <div
                    data-cy="exhaustive-test-no-groups"
                    style={{ marginTop: '0.25em', color: colors.muted }}
                  >
                    <FormattedMessage
                      id="no-test-enabled-groups"
                      values={{
                        link: chunks => (
                          <Link to="/groups/teacher" style={linkStyle}>
                            {chunks}
                          </Link>
                        ),
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            <>
              <Box sx={{ borderTop: `1px solid ${colors.border}`, my: '1.5rem' }} />
              <AppButton
                variant="contrast-outline"
                onClick={toggleHistory}
                data-cy="exhaustive-test-toggle-history"
              >
                <FormattedMessage id={showHistory ? 'Hide history' : 'Show history'} />
              </AppButton>

              {showHistory && history && (
                <>
                  <div className="date-pickers-container" style={{ marginTop: '1.5rem' }}>
                    {bigScreen ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2em' }}>
                        <span style={{ fontWeight: 600, color: colors.ink }}>
                          <FormattedMessage id="Showing results for" />
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75em' }}>
                          <span style={{ color: colors.muted }}>
                            <FormattedMessage id="date-start" />
                          </span>
                          <PickDate id="start" date={startDate} setDate={setStartDate} />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75em' }}>
                          <span style={{ color: colors.muted }}>
                            <FormattedMessage id="date-end" />
                          </span>
                          <PickDate date={endDate} setDate={setEndDate} />
                        </div>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontWeight: 600, fontSize: '1.2em', color: colors.ink }}>
                          <FormattedMessage id="Showing results for" />
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: '1.5em',
                            marginTop: '0.75em',
                            flexWrap: 'wrap',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35em' }}>
                            <span style={{ color: colors.muted }}>
                              <FormattedMessage id="date-start" />
                            </span>
                            <PickDate id="start" date={startDate} setDate={setStartDate} />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35em' }}>
                            <span style={{ color: colors.muted }}>
                              <FormattedMessage id="date-end" />
                            </span>
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
          </Box>
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
