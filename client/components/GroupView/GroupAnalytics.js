import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGroups, getGroupToken } from 'Utilities/redux/groupsReducer'
import { ButtonGroup, ToggleButton } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { getSummary } from 'Utilities/redux/groupSummaryReducer'
import { learningLanguageSelector } from 'Utilities/common'
import { updateGroupSelect } from 'Utilities/redux/userReducer'
import Spinner from 'Components/Spinner'
import useWindowDimension from 'Utilities/windowDimensions'
import ResponsiveDatePicker from 'Components/ResponsiveDatePicker'
import moment from 'moment'
import { Dropdown } from 'semantic-ui-react'
import Summary from './Summary'
import StudentProgress from './StudentProgress'
import NoGroupsView from './NoGroupsView'
import GroupHistory from './GroupHistory'

const GroupAnalytics = ({ role }) => {
  const [content, setContent] = useState('summary')
  const [historyView, setHistoryView] = useState('test')
  const [currentStudent, setCurrentStudent] = useState(null)
  const [startDate, setStartDate] = useState(
    moment().clone().startOf('month').subtract(6, 'month').toDate()
  )
  const [endDate, setEndDate] = useState(moment().clone().startOf('month').toDate())

  const dispatch = useDispatch()
  const currentGroupId = useSelector(({ user }) => user.data.user.last_selected_group)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { groups: totalGroups, created, pending } = useSelector(({ groups }) => groups)
  const groups = totalGroups.filter(group => group.is_teaching === (role === 'teacher'))
  const currentGroup = totalGroups.find(group => group.group_id === currentGroupId)
  const bigScreen = useWindowDimension().width >= 650
  const marginLeftButton = '2px'

  const dropDownMenuText = currentStudent
    ? `${currentStudent?.userName} (${currentStudent?.email})`
    : '-'

  const studentOptions = currentGroup?.students.map(student => ({
    key: student._id,
    text: `${student?.userName} (${student?.email})`,
    value: JSON.stringify(student), // needs to be string
  }))

  const PickDate = ({ date, setDate }) => (
    <ResponsiveDatePicker selected={date} onChange={date => setDate(date)} />
  )

  const handleStudentChange = value => {
    setCurrentStudent(JSON.parse(value))
  }

  useEffect(() => {
    dispatch(getGroups())
  }, [])

  useEffect(() => {
    if (!groups || groups.length === 0) return
    if (currentGroupId && groups.some(group => group.group_id === currentGroupId)) return
    dispatch(updateGroupSelect(groups[0].group_id))
  }, [totalGroups])

  useEffect(() => {
    if (currentGroup && currentGroup.is_teaching) {
      dispatch(getGroupToken(currentGroupId))
    }
  }, [currentGroup])

  useEffect(() => {
    if (!created) return
    dispatch(updateGroupSelect(created.group_id))
  }, [created])

  useEffect(() => {
    if (currentGroup?.students) {
      setCurrentStudent(currentGroup?.students[0])
    }
  }, [currentGroup])

  const compare = (a, b) => {
    if (a.userName.toLowerCase() < b.userName.toLowerCase()) return -1
    if (a.userName.toLowerCase() > b.userName.toLowerCase()) return 1
    return 0
  }

  if (currentGroup) {
    currentGroup.teachers.sort(compare)
    currentGroup.students.sort(compare)
  }

  if (pending || (totalGroups.length > 0 && !currentGroup))
    return (
      <div style={{ height: '80vh' }}>
        <Spinner />
      </div>
    )

  if (totalGroups.length === 0) return <NoGroupsView role={role} />

  return (
    <div className="group-container">
      <div className="group-analytics-top">
        <div style={{ margin: '1.5em 0em .75em 0em' }}>
          <div className="header-2">{currentGroup.groupName}</div>

          <p style={{ paddingLeft: '0.2rem', fontStyle: 'italic' }}>{currentGroup?.description}</p>
        </div>

        <div style={{ alignSelf: 'flex-end', marginBottom: '0.5em' }}>
          {currentGroup?.is_teaching && (
            <ButtonGroup toggle>
              <ToggleButton
                type="radio"
                value="summary"
                variant="info"
                checked={content === 'summary'}
                onChange={() => setContent('summary')}
              >
                <FormattedMessage id="summary" />
              </ToggleButton>
              <ToggleButton
                type="radio"
                value="progress"
                variant="info"
                style={{ marginLeft: marginLeftButton }}
                checked={content === 'progress'}
                onChange={() => setContent('progress')}
              >
                <FormattedMessage id="Progress" />
              </ToggleButton>
              <ToggleButton
                type="radio"
                value="history"
                variant="info"
                style={{ marginLeft: marginLeftButton }}
                checked={content === 'history'}
                onChange={() => setContent('history')}
              >
                <FormattedMessage id="History" />
              </ToggleButton>
            </ButtonGroup>
          )}
        </div>
      </div>

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
              <FormattedMessage id="date-end" /> <PickDate date={endDate} setDate={setEndDate} />
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

      {content !== 'summary' && (
        <div className="group-analytics-student-dropdown">
          <FormattedMessage id="student" />:{' '}
          <Dropdown
            text={dropDownMenuText}
            selection
            fluid
            options={studentOptions}
            onChange={(_, { value }) => handleStudentChange(value)}
            disabled={!currentStudent}
          />
        </div>
      )}

      {content === 'summary' && currentGroup.is_teaching && (
        <>
          <Summary
            setStudent={setCurrentStudent}
            startDate={startDate}
            endDate={endDate}
            group={currentGroup}
            groupName={currentGroup.groupName}
            isTeaching={currentGroup.is_teaching}
            learningLanguage={learningLanguage}
            getSummary={(start, end) => dispatch(getSummary(currentGroupId, start, end))}
            setContent={setContent}
          />
        </>
      )}
      {content === 'progress' && currentGroup.is_teaching && (
        <StudentProgress
          student={currentStudent}
          startDate={startDate}
          endDate={endDate}
          group={currentGroup}
          groupId={currentGroupId}
        />
      )}
      {content === 'history' && currentGroup.is_teaching && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ButtonGroup
              toggle
              style={{
                alignSelf: 'end',
                paddingTop: '1rem',
              }}
            >
              <ToggleButton
                type="radio"
                value="test"
                variant="success"
                checked={historyView === 'test'}
                onChange={() => setHistoryView('test')}
              >
                <FormattedMessage id="Test" />
              </ToggleButton>
              <ToggleButton
                type="radio"
                value="exercise"
                variant="success"
                style={{ marginLeft: marginLeftButton }}
                checked={historyView === 'exercise'}
                onChange={() => setHistoryView('exercise')}
              >
                <FormattedMessage id="Exercise" />
              </ToggleButton>
            </ButtonGroup>
          </div>
          <GroupHistory
            student={currentStudent}
            startDate={startDate}
            endDate={endDate}
            group={currentGroup}
            groupId={currentGroupId}
            view={historyView}
          />
        </div>
      )}
    </div>
  )
}

export default GroupAnalytics
