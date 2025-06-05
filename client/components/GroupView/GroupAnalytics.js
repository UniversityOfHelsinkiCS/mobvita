import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ButtonGroup, ToggleButton, Button, Tabs, Tab } from 'react-bootstrap'
import { FormattedMessage, useIntl, FormattedHTMLMessage } from 'react-intl'
import { getSummary, getInitSummary } from 'Utilities/redux/groupSummaryReducer'
import {
  learningLanguageSelector,
  skillLevels,
  downloadReadingReport,
  downloadReadingHistory,
} from 'Utilities/common'
import {
  getStudentVocabulary,
  getPreviousStudentVocabulary,
} from 'Utilities/redux/groupVocabularyReducer'
import { setGroupTestDeadline } from 'Utilities/redux/groupsReducer'
import Spinner from 'Components/Spinner'
import useWindowDimension from 'Utilities/windowDimensions'
import ResponsiveDatePicker from 'Components/ResponsiveDatePicker'
import moment from 'moment'
import { Divider, Dropdown, Icon, Popup } from 'semantic-ui-react'
import Summary from './Summary'
import StudentProgress from './StudentProgress'
import StudentCEFRModal from './StudentCEFRModal'
import StudentVocabularyProgress from './StudentVocabularyProgress'
import StudentGrammarProgress from './StudentGrammarProgress'
import NoGroupsView from './NoGroupsView'
import GroupHistory from './GroupHistory'
import GroupFunctions from './GroupFunctions'
import GroupKey from './GroupKey'
import EnableTestMenu from './EnableTestMenu'

const PickDate = ({ date, setDate, onCalendarClose }) => (
  <ResponsiveDatePicker
    selected={date}
    onChange={date => setDate(date)}
    onCalendarClose={onCalendarClose}
  />
)

const GroupAnalytics = ({ role }) => {
  const intl = useIntl()
  const [content, setContent] = useState('summary')
  const [summaryTab, setSummaryTab] = useState('group-exercise-summary');

  const [groupSummaryShown, setGroupSummaryShown] = useState(true)
  const [currentStudent, setCurrentStudent] = useState(null)
  const [startDate, setStartDate] = useState(
    moment().startOf('month').subtract(6, 'month').toDate()
  )
  const [cefrHistory, setCefrHistory] = useState([])
  const [graphType, setGraphType] = useState('column mastered')
  const [shownChart, setShownChart] = useState('timeline')
  const [openEditModal, setOpenEditModal] = useState(false)
  const [firstFetch, setFirstFetch] = useState(true)
  const [endDate, setEndDate] = useState(moment().add(1, 'days').toDate())
  const dispatch = useDispatch()
  const currentGroupId = useSelector(({ user }) => user.data.user.last_selected_group)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { start_date, end_date } = useSelector(({ summary }) => summary)
  const {
    studentVocabulary,
    pending: vocabularyPending,
    previousStudentVocabulary,
    previousPending,
  } = useSelector(({ studentVocabulary }) => studentVocabulary)
  const { groups: totalGroups, pending } = useSelector(({ groups }) => groups)
  const currentGroup = totalGroups.find(group => group.group_id === currentGroupId)
  const bigScreen = useWindowDimension().width >= 650
  const dropDownMenuText = currentStudent
    ? `${currentStudent?.userName} (${currentStudent?.email})`
    : '-'

  const [currentCEFR, setCurrentCEFR] = useState('-')
  const [showTokenGroupId, setShowTokenGroupId] = useState(null)
  const { summary, pending: summaryPending } = useSelector(({ summary }) => summary)
  const [showTestEnableMenuGroupId, setShowTestEnableMenuGroupId] = useState(null)

  const [currTestDeadline, setCurrTestDeadline] = useState(currentGroup?.test_deadline)
  const showToken = showTokenGroupId === currentGroupId
  const showTestEnableMenu = showTestEnableMenuGroupId === currentGroupId

  const studentOptions = currentGroup?.students.map(student => ({
    key: student._id,
    text: `${student?.userName} (${student?.email})`,
    value: JSON.stringify(student), // needs to be string
  }))

  const handleStudentChange = value => {
    const parsedValue = JSON.parse(value)
    const studentSummary = summary?.find(student => student.Email === parsedValue.email)
    setCurrentStudent(parsedValue)
    setCefrHistory(studentSummary[intl.formatMessage({ id: 'cefr_grade' })])
    setFirstFetch(true)
  }

  const handlePreviousVocabulary = () => {
    if (moment(startDate, 'MM/DD/YYYY', true).isValid() && currentStudent) {
      dispatch(
        getPreviousStudentVocabulary(
          currentStudent._id,
          currentGroup.group_id,
          startDate.toJSON().slice(0, 10)
        )
      )
    }
  }

  const handleVocabulary = () => {
    if (moment(endDate, 'MM/DD/YYYY', true).isValid() && currentStudent) {
      dispatch(
        getStudentVocabulary(
          currentStudent._id,
          currentGroup.group_id,
          endDate.toJSON().slice(0, 10)
        )
      )
    }
  }

  useEffect(() => {
    if (cefrHistory != undefined && cefrHistory.length > 0) {
      setCurrentCEFR(skillLevels[cefrHistory[0].grade])
    } else setCurrentCEFR('-')
  }, [cefrHistory])

  useEffect(() => {
    if (
      firstFetch &&
      currentGroup &&
      currentStudent &&
      moment(endDate, 'MM/DD/YYYY', true).isValid() &&
      moment(startDate, 'MM/DD/YYYY', true).isValid()
    ) {
      dispatch(
        getPreviousStudentVocabulary(
          currentStudent._id,
          currentGroup.group_id,
          startDate.toJSON().slice(0, 10)
        )
      )
      dispatch(
        getStudentVocabulary(
          currentStudent._id,
          currentGroup.group_id,
          endDate.toJSON().slice(0, 10)
        )
      )

      setFirstFetch(false)
    }
  }, [startDate, endDate, currentStudent, currentGroup])

  useEffect(() => {
    if (start_date) {
      setStartDate(moment.unix(start_date).toDate())
    }

    if (end_date) {
      setEndDate(moment.unix(end_date).add(1, 'days').toDate())
    }
  }, [start_date, end_date])

  useEffect(() => {
    if (currentGroup?.students) {
      setCurrentStudent(currentGroup?.students[0])
      setFirstFetch(true)
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

  // Styles for the Tabs
  const tabsStyle = {
    marginTop: '1em',
  }

  const tabStyle = isActive => ({
    color: 'black',
    fontWeight: isActive ? 'bold' : '300',
  })

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
              {currentGroup?.reading_comprehension && (
                <>
                  <Button onClick={() => downloadReadingReport(currentGroupId, startDate, endDate)}>
                    <FormattedMessage id="download-reading-comprehension-report" />
                  </Button>
                  <Button
                    onClick={() =>
                      downloadReadingHistory(
                        currentGroupId,
                        currentGroup.groupName,
                        startDate,
                        endDate
                      )
                    }
                  >
                    <FormattedMessage id="download-exercise-history" />
                  </Button>
                </>
              )}
            </ButtonGroup>
          )}
        </div>
      </div>
      <GroupFunctions
        group={currentGroup}
        showToken={showToken}
        setShowTokenGroupId={setShowTokenGroupId}
        showTestEnableMenuGroupId={showTestEnableMenuGroupId}
        setShowTestEnableMenuGroupId={setShowTestEnableMenuGroupId}
        currTestDeadline={currTestDeadline}
        setCurrTestDeadline={setCurrTestDeadline}
      />
      {showToken && <GroupKey />}
      {showTestEnableMenu && (
        <EnableTestMenu
          setGroupTestDeadline={setGroupTestDeadline}
          setCurrTestDeadline={setCurrTestDeadline}
          setShowTestEnableMenuGroupId={setShowTestEnableMenuGroupId}
          id={currentGroupId}
        />
      )}
      <hr />
      <div className="date-pickers-container">
        {bigScreen ? (
          <div className="date-pickers gap-col-sm">
            <span className="bold">
              <FormattedMessage id="Showing results for" />
            </span>
            <div style={{ marginLeft: '2em' }}>
              <FormattedMessage id="date-start" />{' '}
              <PickDate
                id="start"
                date={startDate}
                setDate={setStartDate}
                onCalendarClose={handlePreviousVocabulary}
              />
            </div>
            <div style={{ marginLeft: '2em' }}>
              <FormattedMessage id="date-end" />{' '}
              <PickDate date={endDate} setDate={setEndDate} onCalendarClose={handleVocabulary} />
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
                <PickDate
                  id="start"
                  date={startDate}
                  setDate={setStartDate}
                  onCalendarClose={handlePreviousVocabulary}
                />
              </div>
              <div>
                <FormattedMessage id="date-end" />
                <br />
                <PickDate date={endDate} setDate={setEndDate} onCalendarClose={handleVocabulary} />
              </div>
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
          {currentCEFR && (
            <div>
              <StudentCEFRModal
                open={openEditModal}
                setOpen={setOpenEditModal}
                cefrHistory={cefrHistory}
                setCefrHistory={setCefrHistory}
                groupId={currentGroupId}
                sid={currentStudent._id}
              />
              <FormattedMessage id="current-cefr-level" />:{' '}
              <b style={{ marginRight: '1em' }}>{currentCEFR}</b>
              <Button
                variant="primary"
                onClick={() => setOpenEditModal(true)}
                style={{ padding: '5px' }}
              >
                <FormattedMessage id="view-previous-and-edit" />
              </Button>
            </div>
          )}
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
        <Tabs
          activeKey={summaryTab}
          id="group-analytics-tabs"
          className="mb-3"
          style={tabsStyle}
          onSelect={(key) => setSummaryTab(key)}
        >
          <Tab
            eventKey="group-exercise-summary"
            title={<span style={tabStyle(summaryTab === 'group-exercise-summary')}>{intl.formatMessage({ id: 'group-exercise-summary' })}</span>}
          >
            <Summary
              setStudent={setCurrentStudent}
              startDate={startDate}
              endDate={endDate}
              group={currentGroup}
              isTeaching={currentGroup.is_teaching}
              getSummary={(start, end) => dispatch(getSummary(currentGroupId, start, end))}
              getInitSummary={() => dispatch(getInitSummary(currentGroupId))}
              setContent={setContent}
              firstFetch={firstFetch}
              setCefrHistory={setCefrHistory}
              setFirstFetch={setFirstFetch}
              summaryType="exercise"
            />
          </Tab>
          <Tab
            eventKey="group-vocab-summary"
            title={<span style={tabStyle(summaryTab === 'group-vocab-summary')}>{intl.formatMessage({ id: 'group-vocab-summary' })}</span>}
          >
            <Summary
              setStudent={setCurrentStudent}
              startDate={startDate}
              endDate={endDate}
              group={currentGroup}
              isTeaching={currentGroup.is_teaching}
              getSummary={(start, end) => dispatch(getSummary(currentGroupId, start, end))}
              getInitSummary={() => dispatch(getInitSummary(currentGroupId))}
              setContent={setContent}
              firstFetch={firstFetch}
              setCefrHistory={setCefrHistory}
              setFirstFetch={setFirstFetch}
              summaryType="vocab"
            />
          </Tab>
          <Tab
            eventKey="group-test-summary"
            title={<span style={tabStyle(summaryTab === 'group-test-summary')}>{intl.formatMessage({ id: 'group-test-summary' })}</span>}
          >
            <Summary
              setStudent={setCurrentStudent}
              startDate={startDate}
              endDate={endDate}
              group={currentGroup}
              isTeaching={currentGroup.is_teaching}
              getSummary={(start, end) => dispatch(getSummary(currentGroupId, start, end))}
              getInitSummary={() => dispatch(getInitSummary(currentGroupId))}
              setContent={setContent}
              firstFetch={firstFetch}
              setCefrHistory={setCefrHistory}
              setFirstFetch={setFirstFetch}
              summaryType="test"
            />
          </Tab>
          <Tab
            eventKey="group-grammar-progress"
            title={<span style={tabStyle(summaryTab === 'group-grammar-progress')}>{intl.formatMessage({ id: 'group-grammar-progress' })}</span>}
          >
            <StudentGrammarProgress
              summaryView
              startDate={startDate}
              endDate={endDate}
              group={currentGroup}
            />
          </Tab>
        </Tabs>
      
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
              studentVocabulary={studentVocabulary}
              vocabularyPending={vocabularyPending}
              previousStudentVocabulary={previousStudentVocabulary}
              previousPending={previousPending}
              graphType={graphType}
              setGraphType={setGraphType}
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
