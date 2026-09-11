import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, shallowEqual, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { useIntl, FormattedMessage } from 'react-intl';
import {
  getSelf,
  getPreviousVocabularyData,
  getNewerVocabularyData,
  progressTourViewed,
} from 'Utilities/redux/userReducer'
import { getStoriesBlueFlashcards } from 'Utilities/redux/flashcardReducer'
import {
  closeEncouragement,
  hideIcon,
  openEncouragement,
  showIcon,
} from 'Utilities/redux/encouragementsReducer'
import { startProgressTour } from 'Utilities/redux/tourReducer'
import ProgressGraph from 'Components/ProgressGraph'
import AppTabs from 'Components/ui/AppTabs'
import ChartHeading from 'Components/ChartHeading'
import Spinner from 'Components/Spinner'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
import ResponsiveDatePicker from 'Components/ResponsiveDatePicker'
import History from 'Components/History'
import { getHistory as getExerciseHistory } from 'Utilities/redux/exerciseHistoryReducer'
import { getHistory as getTestHistory } from 'Utilities/redux/testReducer'
import { useLearningLanguage, useDictionaryLanguage, hiddenFeatures, ACCESS, useHasAccess } from 'Utilities/common'
import VocabularyGraph from 'Components/VocabularyView/VocabularyGraph'
import HexagonTest from 'Components/GridHexagon'
import { getPracticeHistory } from 'Utilities/redux/practiceHistoryReducer'
import Recommender from 'Components/NewEncouragements/Recommender'
import XpProgressGraph from 'Components/XpProgressGraph'
import ProgressStats from './ProgressStats'
import HoursProgressChart from 'Components/HoursProgressChart'
import { colors } from 'Assets/mui_theme/designTokens'

const PickDate = ({ date, setDate, onCalendarClose }) => (
  <ResponsiveDatePicker
    selected={date}
    onChange={date => setDate(date)}
    onCalendarClose={onCalendarClose}
  />
)

const Progress = () => {
  const dispatch = useDispatch()
  // Hex-map / beehive chart is high-access only (hidden for access <= 1).
  const canSeeHexmap = useHasAccess(ACCESS.HIGH)
  const element = useRef()
  const intl = useIntl()
  const [graphType, setGraphType] = useState('column mastered')
  const [initComplete, setInitComplete] = useState(false)
  const { enable_recmd } = useSelector(({ user }) => user.data.user)
  const { irtExerciseHistory: irtExerciseHistory } = useSelector(
    ({ practiceHistory }) => practiceHistory
  )
  const { flashcardHistory, xpHistory, practiceTimeHistory, pending } = useSelector(
    ({ practiceHistory }) => {
      const { flashcardHistory } = practiceHistory
      const { eloExerciseHistory } = practiceHistory
      const { xpHistory } = practiceHistory
      const { practiceTimeHistory } = practiceHistory
      const { pending } = practiceHistory
      return {
        flashcardHistory,
        eloExerciseHistory,
        xpHistory,
        practiceTimeHistory,
        pending,
      }
    }
  )

  useEffect(() => {
    const date_now = moment().toDate()
    const start_query_date = moment('2021-01-01').toDate()
    dispatch(getPracticeHistory(start_query_date, date_now))
  }, [])

  const user = useSelector(({ user }) => user.data)
  const { vocabularyData, vocabularyPending, newerVocabularyData, newerVocabularyPending } =
    useSelector(({ user }) => {
      const { vocabularyData } = user
      const { newerVocabularyData } = user
      const { newerVocabularyPending } = user
      const { vocabularyPending } = user
      return {
        vocabularyData,
        vocabularyPending,
        newerVocabularyData,
        newerVocabularyPending,
      }
    }, shallowEqual)
  const {
    concepts,
    lesson_topics,
    root_hex_coord,
    pending: conceptsPending,
  } = useSelector(({ metadata }) => metadata)

  useEffect(() => {
    setStartDate(getStartDate)
  }, [irtExerciseHistory])

  const getStartDate = () => {
    const sixMonthsAgo = moment(originalEndPoint).subtract(6, 'months').toDate()

    if (!irtExerciseHistory) {
      return sixMonthsAgo
    }
    const firstPractice = moment(irtExerciseHistory[0]?.date).toDate()

    if (firstPractice < sixMonthsAgo || !irtExerciseHistory) {
      return sixMonthsAgo
    }

    return firstPractice
  }

  const learningLanguage = useLearningLanguage()
  const dictionaryLanguage = useDictionaryLanguage()
  const { history: testHistory, pending: testPending } = useSelector(({ tests }) => tests)
  const shownChart = useSelector(({ progress }) => progress.currentChart)
  const isTourOn = useSelector(({ tour }) => tour.run)
  // const [notMastered, setNotMastered] = useState([])
  // const [notMasteredBefore, setNotMasteredBefore] = useState([])
  const [firstFetch, setFirstFetch] = useState(true)
  // const [targetCurve, setTargetCurve] = useState([])
  const [xAxisLength, setXAxisLength] = useState(102)
  const originalEndPoint =
    irtExerciseHistory?.length > 0
      ? moment(irtExerciseHistory[irtExerciseHistory.length - 1]?.date)
          .add(1, 'days')
          .toDate()
      : moment().toDate()
  const [startDate, setStartDate] = useState(getStartDate)
  const [endDate, setEndDate] = useState(originalEndPoint)

  useEffect(() => {
    if (!user.user.has_seen_progress_tour) {
      dispatch(progressTourViewed())
      dispatch({ type: 'SHOW_PROFILE_DROPDOWN' })
      if (user.user.email === 'anonymous_email') {
        dispatch({ type: 'ANONYMOUS_PROGRESS_TOUR_RESTART' })
      } else {
        dispatch(startProgressTour())
      }
    }
  }, [])

  const filterTestHistoryByDate = () =>
    testHistory?.filter(test => {
      const testTime = moment(test.date)
      return testTime.isAfter(startDate) && testTime.isBefore(endDate)
    })

  const { history: exerciseHistory, pending: historyPending } = useSelector(
    ({ exerciseHistory }) => exerciseHistory
  )

  const handlePreviousVocabulary = () => {
    if (moment(startDate, 'MM/DD/YYYY', true).isValid()) {
      dispatch(getPreviousVocabularyData(startDate.toJSON().slice(0, 10)))
    }
  }

  const handleVocabulary = () => {
    if (moment(endDate, 'MM/DD/YYYY', true).isValid()) {
      dispatch(getNewerVocabularyData(endDate.toJSON().slice(0, 10)))
    }
  }

  useEffect(() => {
    dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
  }, [])

  useEffect(() => {
    if (shownChart !== 'vocabulary') {
      dispatch(hideIcon())
      dispatch(closeEncouragement)
    } else if (!isTourOn && enable_recmd) {
      dispatch(showIcon())
      dispatch(openEncouragement())
    }
  }, [shownChart])

  useEffect(() => {
    if (
      firstFetch &&
      moment(endDate, 'MM/DD/YYYY', true).isValid() &&
      moment(startDate, 'MM/DD/YYYY', true).isValid()
    ) {
      dispatch(getNewerVocabularyData(endDate.toJSON().slice(0, 10)))
      dispatch(getPreviousVocabularyData(startDate.toJSON().slice(0, 10)))

      setFirstFetch(false)
    }
  }, [startDate, endDate])

  useEffect(() => {
    dispatch(getSelf())
    dispatch(getExerciseHistory(learningLanguage, startDate, endDate))
    dispatch(getTestHistory(learningLanguage, startDate, endDate))
    setGraphType('column mastered')
  }, [startDate, endDate])

  useEffect(() => {
    if (newerVocabularyData && vocabularyData) {
      // let initList = []
      let wordsAtEnd = 0
      // const B2 = newerVocabularyData.target_mastering_curves.B2.params
      const newBins = newerVocabularyData.mastering_percentage.vocab_bins
      const oldBins = vocabularyData.mastering_percentage.vocab_bins
      for (let i = 50; i < newBins?.length; i++) {
        /*
        initList = initList.concat(
          newBins[i].encountered - newBins[i].mastered - newBins[i].rewardable
        )
        */
        wordsAtEnd += newBins[i].encountered
      }
      /*
      setNotMastered(initList)
      let initBeforeList = []
      */
      for (let i = 50; i < oldBins?.length; i++) {
        /*
        initBeforeList = initBeforeList.concat(
          oldBins[i].encountered - oldBins[i].mastered - oldBins[i].rewardable
        )
        */
        wordsAtEnd += oldBins[i].encountered
      }
      wordsAtEnd < 700 ? setXAxisLength(50) : setXAxisLength(102)
      setInitComplete(true)
      /*
      setNotMasteredBefore(initBeforeList)
      let initTarget = []
      for (let i = 0; i < newBins.length; i++) {
        initTarget = initTarget.concat(B2.B / (B2.C * i + B2.D))
      }
      setTargetCurve(initTarget)
      */
    }
  }, [newerVocabularyData, vocabularyData])

  // Tab values are the chart keys `shownChart` holds; each carries the reducer action that selects
  // it. The classes are the progress tour's spotlight targets.
  const CHART_TABS = [
    {
      value: 'progress',
      labelId: 'progress-timeline',
      action: 'SET_TIMELINE_CHART',
      className: 'progress-tour-timeline-button',
    },
    {
      value: 'vocabulary',
      labelId: 'vocabulary-view',
      action: 'SET_VOCABULARY_CHART',
      className: 'progress-tour-vocabulary-button',
    },
    ...(canSeeHexmap
      ? [
          {
            value: 'hex-map',
            labelId: 'hex-map',
            action: 'SET_GRAMMAR_CHART',
            className: 'progress-tour-grammar-button',
          },
        ]
      : []),
    {
      value: 'exercise-history',
      labelId: 'exercise-history',
      action: 'SET_EXERCISE_HISTORY_CHART',
      className: 'progress-tour-exercise-history-button',
    },
    {
      value: 'test-history',
      labelId: 'Test History',
      action: 'SET_TEST_HISTORY_CHART',
      className: 'progress-tour-test-history-button',
    },
  ]

  const chartTabs = CHART_TABS.map(({ labelId, value, className }) => ({
    value,
    className,
    label: intl.formatMessage({ id: labelId }),
  }))

  const handleChartSelect = value =>
    handleChartChange(CHART_TABS.find(tab => tab.value === value).action)

  const handleChartChange = newChart => {
    dispatch({ type: newChart })
    setGraphType('column mastered')
  }

  if (pending || pending === undefined || testPending) return <Spinner fullHeight spinnerColor={colors.ink} size={60} />

  // console.log('num of words at end ', endWords)
  return (
    <div>
      {/* <Recommender /> */}
      <div className="cont ps-nm">
        {/* One responsive row, matching the group analytics page. */}
        <div className="date-pickers-container">
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
        </div>
        {/* Same segmented bar as the group analytics page. It replaces a row of radio buttons that
            only rendered above 700px, so the chart switcher now exists on small screens too. */}
        <div className="chart-tabs">
          <AppTabs
            tabs={chartTabs}
            value={shownChart}
            onChange={handleChartSelect}
            fullWidth
            bordered
          />
        </div>
        {shownChart === 'progress' ? (
          <div>
            <ChartHeading
              titleId="progress-timeline"
              tooltip={<FormattedHTMLMessage id="timeline-explanation" />}
            />
            <ProgressStats startDate={startDate} endDate={endDate} />
            <div className="progress-page-graph-cont">
              <ProgressGraph
                exerciseHistory={irtExerciseHistory}
                flashcardHistory={flashcardHistory}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
            <br />
            <div className="progress-page-graph-cont">
              <HoursProgressChart
                practiceTimeHistory={practiceTimeHistory}
                startDate={startDate}
                endDate={endDate}
              />
            </div>
            <br />
            <div className="progress-page-graph-cont">
              <XpProgressGraph xpHistory={xpHistory} startDate={startDate} endDate={endDate} />
            </div>
          </div>
        ) : shownChart === 'vocabulary' ? (
          <div>
            <ChartHeading
              titleId="vocabulary-view"
              tooltip={<FormattedHTMLMessage id="vocabulary-view-explanation" />}
            />
            <div>
              <div>
                {initComplete ? (
                  <div className="progress-page-graph-cont">
                    <VocabularyGraph
                      vocabularyData={vocabularyData}
                      vocabularyPending={vocabularyPending}
                      newerVocabularyData={newerVocabularyData}
                      newerVocabularyPending={newerVocabularyPending}
                      graphType={graphType}
                      setGraphType={setGraphType}
                      xAxisLength={xAxisLength}
                      element={element}
                    />
                  </div>
                ) : (
                  <Spinner fullHeight spinnerColor={colors.ink} size={60} />
                )}
              </div>
            </div>
          </div>
        ) : shownChart === 'exercise-history' ? (
          <div>
            <ChartHeading
              titleId="exercise-history"
              tooltip={<FormattedMessage id="exercise-history-explanation" />}
            />
            <History history={exerciseHistory} dateFormat="YYYY.MM" />
          </div>
        ) : shownChart === 'test-history' ? (
          <div>
            <ChartHeading
              titleId="Test History"
              tooltip={<FormattedMessage id="test-history-explanation" />}
            />
            <History history={filterTestHistoryByDate()} testView dateFormat="YYYY.MM.DD HH:mm" />
          </div>
        ) : (
          <div>
            <ChartHeading
              titleId="hex-map"
              tooltip={<FormattedMessage id="hex-map-explanation" />}
            />
            <HexagonTest
              exerciseHistory={exerciseHistory}
              pending={historyPending}
              concepts={concepts}
              conceptsPending={conceptsPending}
              root_hex_coord={root_hex_coord}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default Progress
