import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Divider, FormControlLabel, RadioGroup } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import AppButton from 'Components/AppButton'
import AppRadio from 'Components/ui/AppRadio'
import AppSelect from 'Components/ui/AppSelect'
import AppTabs from 'Components/ui/AppTabs'
import CustomTooltip from 'Components/CustomTooltip'
import { colors } from 'Assets/mui_theme/designTokens'
import { FormattedMessage, useIntl } from 'react-intl'
import { getSummary, getInitSummary } from 'Utilities/redux/groupSummaryReducer'
import {
  learningLanguageSelector,
  skillLevels,
  downloadReadingReport,
  downloadReadingHistory,
  ACCESS,
  useHasAccess,
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
  const bigScreen = useWindowDimension().width >= 650

  const [currentCEFR, setCurrentCEFR] = useState('-')
  const [showTokenGroupId, setShowTokenGroupId] = useState(null)
  const { summary, pending: summaryPending } = useSelector(({ summary }) => summary)
  const [showTestEnableMenuGroupId, setShowTestEnableMenuGroupId] = useState(null)

  const [currTestDeadline, setCurrTestDeadline] = useState(currentGroup?.test_deadline)
  const showToken = showTokenGroupId === currentGroupId
  const showTestEnableMenu = showTestEnableMenuGroupId === currentGroupId

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

  if (pending || (totalGroups.length > 0 && !currentGroup)) return <Spinner fullHeight spinnerColor={colors.ink} size={60} />

  if (totalGroups.length === 0) return <NoGroupsView role={role} />

  const summaryTabs = [
    'group-exercise-summary',
    'group-vocab-summary',
    'group-test-summary',
    'group-grammar-progress',
  ].map(id => ({ value: id, label: intl.formatMessage({ id }) }))

  const chartOptions = [
    { value: 'timeline', labelId: 'progress-timeline' },
    { value: 'vocabulary', labelId: 'vocabulary-view' },
    ...(canSeeHexmap ? [{ value: 'hex-map', labelId: 'hex-map' }] : []),
    { value: 'exercise', labelId: 'exercise-history' },
    { value: 'test', labelId: 'Test History' },
  ]

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
  }

  return (
    <div className="group-container">
      <Box
        sx={{
          backgroundColor: colors.card,
          color: colors.ink,
          border: `1px solid ${colors.border}`,
          borderRadius: '20px',
          p: { xs: '12px', sm: '20px' },
          mt: '2rem',
          mb: '2rem',
        }}
      >
        <div className="group-analytics-top">
          <div style={{ margin: '1.5em 0em .75em 0em' }}>
            <div className="header-2">{currentGroup.groupName}</div>

            <p style={{ paddingLeft: '0.2rem', fontStyle: 'italic' }}>
              {currentGroup?.description}
            </p>
          </div>

          <div style={{ alignSelf: 'flex-end', marginBottom: '0.5em' }}>
            {currentGroup?.is_teaching && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.5em' }}>
                <AppButton
                  variant={content === 'summary' ? 'tan' : 'contrast-outline'}
                  onClick={() => setContent('summary')}
                >
                  <FormattedMessage id="summary" />
                </AppButton>
                {currentGroup?.reading_comprehension && (
                  <>
                    <AppButton
                      onClick={() => downloadReadingReport(currentGroupId, startDate, endDate)}
                    >
                      <FormattedMessage id="download-reading-comprehension-report" />
                    </AppButton>
                    <AppButton
                      onClick={() =>
                        downloadReadingHistory(
                          currentGroupId,
                          currentGroup.groupName,
                          startDate,
                          endDate,
                        )
                      }
                    >
                      <FormattedMessage id="download-exercise-history" />
                    </AppButton>
                  </>
                )}
              </Box>
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
                  <PickDate
                    date={endDate}
                    setDate={setEndDate}
                    onCalendarClose={handleVocabulary}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {content !== 'summary' && (
          <div>
            <div className="group-analytics-student-dropdown">
              <FormattedMessage id="student" />:{' '}
              <Box sx={{ flexGrow: 1 }}>
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
                <AppButton
                  variant="primary"
                  onClick={() => setOpenEditModal(true)}
                  style={{ padding: '5px' }}
                >
                  <FormattedMessage id="view-previous-and-edit" />
                </AppButton>
              </div>
            )}
            <Divider />
            <RadioGroup
              row
              value={shownChart}
              onChange={e => setShownChart(e.target.value)}
              sx={{ justifyContent: 'space-evenly' }}
            >
              {chartOptions.map(option => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<AppRadio />}
                  label={intl.formatMessage({ id: option.labelId })}
                />
              ))}
            </RadioGroup>
            <Divider />
          </div>
        )}

        {content === 'summary' && currentGroup.is_teaching ? (
          <>
            <div style={{ marginTop: '1em', overflowX: 'auto' }}>
              {/* fullWidth so the bar spans the container like the old bootstrap <Tabs> nav;
                sm because these four labels are long enough to overflow at the default size. */}
              <AppTabs
                tabs={summaryTabs}
                value={summaryTab}
                onChange={setSummaryTab}
                fullWidth
                size="xs"
              />
            </div>
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
            <div className="row-flex align center">
              <CustomTooltip permanent keyId="timeline-explanation">
                <InfoOutlinedIcon
                  fontSize="small"
                  sx={{ color: 'grey', mr: '0.75em', mb: '0.35em' }}
                />
              </CustomTooltip>
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
              <CustomTooltip
                permanent
                title={
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
              >
                <InfoOutlinedIcon
                  fontSize="small"
                  sx={{ color: 'grey', mr: '0.75em', mb: '0.35em' }}
                />
              </CustomTooltip>
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
              <CustomTooltip permanent keyId="hex-map-explanation">
                <InfoOutlinedIcon
                  fontSize="small"
                  sx={{ color: 'grey', mr: '0.75em', mb: '0.35em' }}
                />
              </CustomTooltip>
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
      </Box>
    </div>
  )
}

export default GroupAnalytics
