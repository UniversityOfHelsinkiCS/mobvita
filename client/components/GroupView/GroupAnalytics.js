import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@mui/material'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import AppButton from 'Components/AppButton'
import AppSelect from 'Components/ui/AppSelect'
import AppTabs from 'Components/ui/AppTabs'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { CSVLink } from 'react-csv'
import { colors } from 'Assets/mui_theme/designTokens'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'
import { getSummary, getInitSummary } from 'Utilities/redux/groupSummaryReducer'
import {
  learningLanguageSelector,
  skillLevels,
  ACCESS,
  images,
  useHasAccess,
} from 'Utilities/common'
import {
  getStudentVocabulary,
  getPreviousStudentVocabulary,
} from 'Utilities/redux/groupVocabularyReducer'
import { setGroupTestDeadline } from 'Utilities/redux/groupsReducer'
import Spinner from 'Components/Spinner'
import ResponsiveDatePicker from 'Components/ResponsiveDatePicker'
import moment from 'moment'
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
import ChartHeading from 'Components/ChartHeading'

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
  const [summaryTab, setSummaryTab] = useState('group-exercise-summary')

  const [groupSummaryShown, setGroupSummaryShown] = useState(true)
  const [currentStudent, setCurrentStudent] = useState(null)
  const [startDate, setStartDate] = useState(
    moment().startOf('month').subtract(6, 'month').toDate(),
  )
  const [cefrHistory, setCefrHistory] = useState([])
  const [graphType, setGraphType] = useState('column mastered')
  const [shownChart, setShownChart] = useState('timeline')
  const [openEditModal, setOpenEditModal] = useState(false)
  const [firstFetch, setFirstFetch] = useState(true)
  const [endDate, setEndDate] = useState(moment().add(1, 'days').toDate())
  const dispatch = useDispatch()
  // Hex-map / beehive chart is high-access only (hidden for access <= 1).
  const canSeeHexmap = useHasAccess(ACCESS.HIGH)
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

  const [currentCEFR, setCurrentCEFR] = useState('-')
  const [showTokenGroupId, setShowTokenGroupId] = useState(null)
  const { summary, pending: summaryPending } = useSelector(({ summary }) => summary)
  const [showTestEnableMenuGroupId, setShowTestEnableMenuGroupId] = useState(null)

  const [currTestDeadline, setCurrTestDeadline] = useState(currentGroup?.test_deadline)
  const showToken = showTokenGroupId === currentGroupId
  const showTestEnableMenu = showTestEnableMenuGroupId === currentGroupId
  const groupRole = role || (currentGroup?.is_teaching ? 'teacher' : 'student')

  const studentOptions = currentGroup?.students.map(student => ({
    value: student._id,
    label: `${student?.userName} (${student?.email})`,
  }))

  const handleStudentChange = studentId => {
    const student = currentGroup?.students.find(s => s._id === studentId)
    const studentSummary = summary?.find(s => s.Email === student.email)
    setCurrentStudent(student)
    setCefrHistory(studentSummary[intl.formatMessage({ id: 'cefr_grade' })])
    setFirstFetch(true)
  }

  const handlePreviousVocabulary = () => {
    if (moment(startDate, 'MM/DD/YYYY', true).isValid() && currentStudent) {
      dispatch(
        getPreviousStudentVocabulary(
          currentStudent._id,
          currentGroup.group_id,
          startDate.toJSON().slice(0, 10),
        ),
      )
    }
  }

  const handleVocabulary = () => {
    if (moment(endDate, 'MM/DD/YYYY', true).isValid() && currentStudent) {
      dispatch(
        getStudentVocabulary(
          currentStudent._id,
          currentGroup.group_id,
          endDate.toJSON().slice(0, 10),
        ),
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
          startDate.toJSON().slice(0, 10),
        ),
      )
      dispatch(
        getStudentVocabulary(
          currentStudent._id,
          currentGroup.group_id,
          endDate.toJSON().slice(0, 10),
        ),
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
    return <Spinner fullHeight spinnerColor={colors.ink} size={60} />

  if (totalGroups.length === 0) return <NoGroupsView role={role} />

  const summaryTabs = [
    'group-exercise-summary',
    'group-vocab-summary',
    'group-test-summary',
    'group-grammar-progress',
  ].map(id => ({ value: id, label: intl.formatMessage({ id }) }))

  // The CSV export sits in the date row, so it lives here rather than inside <Summary/>.
  const showSummaryTable = content === 'summary' && currentGroup.is_teaching
  const csvFilename = `${currentGroup.groupName
    .toLowerCase()
    .split(' ')
    .join('_')
    .replace(/[^\w\s-]/gi, '')}_summary.csv`

  const showCefrRow = content !== 'summary' && !!currentCEFR && !!currentStudent

  const chartOptions = [
    { value: 'timeline', labelId: 'progress-timeline' },
    { value: 'vocabulary', labelId: 'vocabulary-view' },
    ...(canSeeHexmap ? [{ value: 'hex-map', labelId: 'hex-map' }] : []),
    { value: 'exercise', labelId: 'exercise-history' },
    { value: 'test', labelId: 'Test History' },
  ]

  const chartTabs = chartOptions.map(({ value, labelId }) => ({
    value,
    label: intl.formatMessage({ id: labelId }),
  }))

  // Every summary tab but the grammar one renders the same table, differing only in which columns
  // the backing summary is sliced down to.
  const summaryProps = {
    setStudent: setCurrentStudent,
    startDate,
    endDate,
    group: currentGroup,
    isTeaching: currentGroup.is_teaching,
    getSummary: (start, end) => dispatch(getSummary(currentGroupId, start, end)),
    getInitSummary: () => dispatch(getInitSummary(currentGroupId)),
    setContent,
    firstFetch,
    setCefrHistory,
    setFirstFetch,
    // Per-row ⋮ menu: jump straight to one chart for that student instead of clicking the row and
    // then picking from the radio group.
    chartOptions,
    setShownChart,
  }

  return (
    <div className="group-container">
      <Box
        sx={{
          backgroundColor: colors.card,
          color: colors.ink,
          border: `none`,
          borderRadius: '20px',
          p: { xs: '12px', sm: '20px' },          
        }}
      >
        <div className="group-analytics-top">
          <Link
            className="group-analytics-back"
            to={`/groups/${groupRole}`}
            aria-label={intl.formatMessage({ id: 'groups', defaultMessage: 'Back to groups' })}
          >
            <img src={images.arrowLeft} alt="" />
          </Link>
          <div className="group-analytics-heading">
            <div className="header-2">{currentGroup.groupName}</div>
            {currentGroup?.description && <div>{currentGroup.description}</div>}
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
        {/* The four summary views used to be a tab bar; they are long labels, so they now sit in a
            single wide dropdown next to the section heading. */}
        {showSummaryTable && (
          <div className="group-analytics-summary-head">
            <span className="group-analytics-summary-title">
              <FormattedMessage id="summary" />
            </span>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <AppSelect
                variant="contrast-outline"
                value={summaryTab}
                options={summaryTabs}
                onChange={setSummaryTab}
                matchTriggerWidth
              />
            </Box>
          </div>
        )}
        {content !== 'summary' && (
          <div>
            <div className="group-analytics-student-dropdown">
              <span className="group-analytics-student-label">
                <FormattedMessage id="student" />
              </span>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <AppSelect
                  variant="contrast-outline"
                  placeholder="-"
                  value={currentStudent?._id}
                  options={studentOptions}
                  onChange={handleStudentChange}
                  disabled={!currentStudent}
                  matchTriggerWidth
                />
              </Box>
              {/* Same destination as the "All students" item in the ⋮ menu, promoted to the row. */}
              <AppButton
                size="sm"
                onClick={() => setContent('summary')}
                data-cy="show-all-students-button"
                sx={{ flexShrink: 0, fontSize: 16 }}
              >
                <img src={images.users01} alt="" />
                <FormattedMessage id="show-all-students" />
              </AppButton>
            </div>
            {showCefrRow && (
              <StudentCEFRModal
                open={openEditModal}
                setOpen={setOpenEditModal}
                cefrHistory={cefrHistory}
                setCefrHistory={setCefrHistory}
                groupId={currentGroupId}
                sid={currentStudent._id}
              />
            )}
          </div>
        )}

        {/* One responsive row: label, the two date pills, and the CSV export on the right. */}
        <div className={`date-pickers-container${showCefrRow ? ' has-cefr' : ''}`}>
          {showCefrRow && (
            <div className="group-analytics-cefr">
              <span>
                <FormattedMessage id="current-cefr-level" />: <b>{currentCEFR}</b>
              </span>
              {/* Sized to the date pills beside it rather than the default 36px small button. */}
              <AppButton
                size="sm"
                onClick={() => setOpenEditModal(true)}
                sx={{ height: 24, padding: '0 12px', fontSize: 12 }}
              >
                <FormattedMessage id="view-previous-and-edit" />
              </AppButton>
            </div>
          )}
          <span className="group-analytics-daterow-label">
            <FormattedMessage id="Showing results for" />
          </span>
          <div className="group-analytics-dates">
            <label className="group-analytics-date">
              <FormattedMessage id="date-from" />
              <span className="group-analytics-date-pill">
                <CalendarTodayOutlinedIcon className="group-analytics-date-icon" />
                <PickDate
                  id="start"
                  date={startDate}
                  setDate={setStartDate}
                  onCalendarClose={handlePreviousVocabulary}
                />
              </span>
            </label>
            <label className="group-analytics-date">
              <FormattedMessage id="date-to" />
              <span className="group-analytics-date-pill">
                <CalendarTodayOutlinedIcon className="group-analytics-date-icon" />
                <PickDate date={endDate} setDate={setEndDate} onCalendarClose={handleVocabulary} />
              </span>
            </label>
          </div>
          {showSummaryTable && summary?.length > 0 && (
            <CSVLink className="group-analytics-csv" filename={csvFilename} data={summary}>
              {/* Sized to the date pills beside it rather than the default 36px small button. */}
              <AppButton size="sm" sx={{ height: 24, padding: '0 12px', fontSize: 12 }}>
                <FormattedMessage id="download-csv" />
              </AppButton>
            </CSVLink>
          )}
        </div>

        {/* Chart picker. The tab labels name the view, so the charts below no longer repeat it. */}
        {content !== 'summary' && (
          <div className="chart-tabs">
            <AppTabs
              tabs={chartTabs}
              value={shownChart}
              onChange={setShownChart}
              fullWidth
              bordered
            />
          </div>
        )}

        {content === 'summary' && currentGroup.is_teaching ? (
          <>
            <div style={{ marginTop: '1em' }}>
              {summaryTab === 'group-exercise-summary' && (
                <Summary {...summaryProps} summaryType="exercise" />
              )}
              {summaryTab === 'group-vocab-summary' && (
                <Summary {...summaryProps} summaryType="vocab" />
              )}
              {summaryTab === 'group-test-summary' && (
                <Summary {...summaryProps} summaryType="test" />
              )}
              {summaryTab === 'group-grammar-progress' && (
                <StudentGrammarProgress
                  summaryView
                  startDate={startDate}
                  endDate={endDate}
                  group={currentGroup}
                />
              )}
            </div>
          </>
        ) : content === 'progress' && shownChart === 'timeline' && currentGroup.is_teaching ? (
          <div>
            <ChartHeading titleId="progress-timeline" tooltip={<FormattedHTMLMessage id="timeline-explanation" tagName="div" />} />
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
            <ChartHeading
              titleId="vocabulary-view"
              tooltip={
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
            />
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
            <ChartHeading titleId="hex-map" tooltip={<FormattedHTMLMessage id="hex-map-explanation" tagName="div" />} />
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
      </Box>
    </div>
  )
}

export default GroupAnalytics
