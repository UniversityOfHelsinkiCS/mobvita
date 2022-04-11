/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ButtonGroup, ToggleButton } from 'react-bootstrap'
import { FormattedMessage, useIntl, FormattedHTMLMessage } from 'react-intl'
import { getSummary } from 'Utilities/redux/groupSummaryReducer'
import { learningLanguageSelector } from 'Utilities/common'
import Spinner from 'Components/Spinner'
import useWindowDimension from 'Utilities/windowDimensions'
import ResponsiveDatePicker from 'Components/ResponsiveDatePicker'
import moment from 'moment'
import { Divider, Dropdown, Icon, Popup } from 'semantic-ui-react'
import Summary from './Summary'
import StudentProgress from './StudentProgress'
import StudentVocabularyProgress from './StudentVocabularyProgress'
import StudentGrammarProgress from './StudentGrammarProgress'
import NoGroupsView from './NoGroupsView'
import GroupHistory from './GroupHistory'

const GroupAnalytics = ({ role }) => {
  const intl = useIntl()
  const [content, setContent] = useState('summary')
  const [currentStudent, setCurrentStudent] = useState(null)
  const [startDate, setStartDate] = useState(
    moment().clone().startOf('month').subtract(6, 'month').toDate()
  )
  const [shownChart, setShownChart] = useState('timeline')
  const [endDate, setEndDate] = useState(moment().clone().add(1, 'days').toDate())
  const [parsedDate, setParsedDate] = useState(startDate.toJSON().slice(0, 10))
  const dispatch = useDispatch()
  const currentGroupId = useSelector(({ user }) => user.data.user.last_selected_group)
  const learningLanguage = useSelector(learningLanguageSelector)

  const { groups: totalGroups, pending } = useSelector(({ groups }) => groups)
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
    if (currentGroup?.students) {
      setCurrentStudent(currentGroup?.students[0])
    }
  }, [currentGroup])

  useEffect(() => {
    setParsedDate(startDate.toJSON().slice(0, 10))
  }, [startDate])

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
            {shownChart !== 'vocabulary' && (
              <div style={{ marginLeft: '2em' }}>
                <FormattedMessage id="date-end" /> <PickDate date={endDate} setDate={setEndDate} />
              </div>
            )}
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
              {shownChart !== 'vocabulary' && (
                <div>
                  <FormattedMessage id="date-end" />
                  <br />
                  <PickDate date={endDate} setDate={setEndDate} />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {content !== 'summary' && (
        <div>
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
          <Divider />
          <div className="space-evenly">
            <button
              type="button"
              onClick={() => setShownChart('timeline')}
              style={{ border: 'none' }}
            >
              <div className="flex align-center" style={{ gap: '.5em' }}>
                <input
                  type="radio"
                  onChange={() => setShownChart('timeline')}
                  checked={shownChart === 'timeline'}
                />
                <FormattedMessage id="progress-timeline" />
              </div>
            </button>
            <button
              type="button"
              onClick={() => setShownChart('vocabulary')}
              style={{ border: 'none' }}
            >
              <div className="flex align-center" style={{ gap: '.5em' }}>
                <input
                  type="radio"
                  onChange={() => setShownChart('vocabulary')}
                  checked={shownChart === 'vocabulary'}
                />
                <FormattedMessage id="vocabulary-view" />
              </div>
            </button>
            <button
              type="button"
              onClick={() => setShownChart('hex-map')}
              style={{ border: 'none' }}
            >
              <div className="flex align-center" style={{ gap: '.5em' }}>
                <input
                  type="radio"
                  onChange={() => setShownChart('hex-map')}
                  checked={shownChart === 'hex-map'}
                />
                <FormattedMessage id="hex-map" />
              </div>
            </button>
            <button
              type="button"
              onClick={() => setShownChart('exercise')}
              style={{ border: 'none' }}
            >
              <div className="flex align-center" style={{ gap: '.5em' }}>
                <input
                  type="radio"
                  onChange={() => setShownChart('exercise')}
                  checked={shownChart === 'exercise'}
                />
                <FormattedMessage id="exercise-history" />
              </div>
            </button>
            <button type="button" onClick={() => setShownChart('test')} style={{ border: 'none' }}>
              <div className="flex align-center" style={{ gap: '.5em' }}>
                <input
                  type="radio"
                  onChange={() => setShownChart('test')}
                  checked={shownChart === 'test'}
                />
                <FormattedMessage id="Test History" />
              </div>
            </button>
          </div>
          <Divider />
        </div>
      )}

      {content === 'summary' && currentGroup.is_teaching ? (
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
      ) : content === 'progress' && shownChart === 'timeline' && currentGroup.is_teaching ? (
        <div>
          <div className="row-flex align center">
            <Popup
              content={
                <div>
                  <FormattedHTMLMessage id="timeline-explanation" />
                </div>
              }
              trigger={
                <Icon
                  style={{ paddingRight: '0.75em', marginBottom: '0.35em' }}
                  name="info circle"
                  color="grey"
                />
              }
            />
            <div className="progress-page-header">
              <FormattedMessage id="progress-timeline" />
            </div>
          </div>
          <Divider />
          <StudentProgress
            student={currentStudent}
            startDate={startDate}
            endDate={endDate}
            group={currentGroup}
            groupId={currentGroupId}
          />
        </div>
      ) : content === 'progress' && shownChart === 'vocabulary' && currentGroup.is_teaching ? (
        <div>
          <div className="row-flex align center">
            <Popup
              content={
                <div>
                  <FormattedHTMLMessage id="vocabulary-view-explanation" />
                  <br />
                  <br />
                  <b>{intl.formatMessage({ id: 'vocabulary-total' })}</b>
                  {': '}
                  <FormattedHTMLMessage id="vocabulary-total-explanation" />
                  <br />
                  <br />
                  <b>{intl.formatMessage({ id: 'vocabulary-seen' })}</b>
                  {': '}
                  <FormattedHTMLMessage id="vocabulary-seen-explanation" />
                  <br />
                  <br />
                  <b>{intl.formatMessage({ id: 'vocabulary-visit' })}</b>
                  {': '}
                  <FormattedHTMLMessage id="vocabulary-visit-explanation" />
                  <br />
                  <br />
                  <b>{intl.formatMessage({ id: 'vocabulary-flashcard' })}</b>
                  {': '}
                  <FormattedHTMLMessage id="vocabulary-flashcard-explanation" />
                </div>
              }
              trigger={
                <Icon
                  style={{ paddingRight: '0.75em', marginBottom: '0.35em' }}
                  name="info circle"
                  color="grey"
                />
              }
            />
            <div className="progress-page-header">
              <FormattedMessage id="vocabulary-view" />
            </div>
          </div>
          <Divider />
          <div className="progress-page-graph-cont">
            <StudentVocabularyProgress
              student={currentStudent}
              earlierDate={parsedDate}
              group={currentGroup}
            />
          </div>
        </div>
      ) : content === 'progress' && shownChart === 'hex-map' && currentGroup.is_teaching ? (
        <div>
          <div className="row-flex align center">
            <Popup
              content={
                <div>
                  <FormattedMessage id="hex-map-explanation" />
                </div>
              }
              trigger={
                <Icon
                  style={{ paddingRight: '0.75em', marginBottom: '0.35em' }}
                  name="info circle"
                  color="grey"
                />
              }
            />
            <div className="progress-page-header">
              <FormattedMessage id="hex-map" />
            </div>
          </div>
          <Divider />
          <StudentGrammarProgress
            student={currentStudent}
            startDate={startDate}
            endDate={endDate}
            group={currentGroup}
          />
        </div>
      ) : (
        <GroupHistory
          student={currentStudent}
          startDate={startDate}
          endDate={endDate}
          group={currentGroup}
          groupId={currentGroupId}
          view={shownChart}
        />
      )}
    </div>
  )
}

export default GroupAnalytics
