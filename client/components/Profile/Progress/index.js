/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, shallowEqual, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { useIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl'
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
import Spinner from 'Components/Spinner'
import { Divider, Icon, Popup } from 'semantic-ui-react'
import ResponsiveDatePicker from 'Components/ResponsiveDatePicker'
import History from 'Components/History'
import { getHistory as getExerciseHistory } from 'Utilities/redux/exerciseHistoryReducer'
import { getHistory as getTestHistory } from 'Utilities/redux/testReducer'
import { useLearningLanguage, useDictionaryLanguage, hiddenFeatures } from 'Utilities/common'
import useWindowDimension from 'Utilities/windowDimensions'
import VocabularyGraph from 'Components/VocabularyView/VocabularyGraph'
import HexagonTest from 'Components/GridHexagon'
import { getPracticeHistory } from 'Utilities/redux/practiceHistoryReducer'
import Recommender from 'Components/NewEncouragements/Recommender'
import XpProgressGraph from 'Components/XpProgressGraph'
import ProgressStats from './ProgressStats'
import HoursProgressChart from 'Components/HoursProgressChart'

const PickDate = ({ date, setDate, onCalendarClose }) => (
  <ResponsiveDatePicker
    selected={date}
    onChange={date => setDate(date)}
    onCalendarClose={onCalendarClose}
  />
)

const Progress = () => {
  const dispatch = useDispatch()
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

  const { user } = useSelector(({ user }) => ({ user: user.data }))
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
  const bigScreen = useWindowDimension().width >= 700
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

  const handleChartChange = newChart => {
    dispatch({ type: newChart })
    setGraphType('column mastered')
  }

  if (pending || pending === undefined || testPending) return <Spinner fullHeight size={60} />

  // console.log('num of words at end ', endWords)
  return (
    <div>
      {/* <Recommender /> */}
      <div className="cont ps-nm">
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
        <br />
        {bigScreen && (
          <div>
            <div className="space-evenly">
              <button
                className="progress-tour-timeline-button"
                type="button"
                onClick={() => handleChartChange('SET_TIMELINE_CHART')}
                style={{ border: 'none' }}
              >
                <div className="flex align-center" style={{ gap: '.5em' }}>
                  <input
                    type="radio"
                    onChange={() => handleChartChange('SET_TIMELINE_CHART')}
                    checked={shownChart === 'progress'}
                  />
                  <FormattedMessage id="progress-timeline" />
                </div>
              </button>
              <button
                className="progress-tour-vocabulary-button"
                type="button"
                onClick={() => handleChartChange('SET_VOCABULARY_CHART')}
                style={{ border: 'none' }}
              >
                <div className="flex align-center" style={{ gap: '.5em' }}>
                  <input
                    type="radio"
                    onChange={() => handleChartChange('SET_VOCABULARY_CHART')}
                    checked={shownChart === 'vocabulary'}
                  />
                  <FormattedMessage id="vocabulary-view" />
                </div>
              </button>
              <button
                className="progress-tour-grammar-button"
                type="button"
                onClick={() => handleChartChange('SET_GRAMMAR_CHART')}
                style={{ border: 'none' }}
              >
                <div className="flex align-center" style={{ gap: '.5em' }}>
                  <input
                    type="radio"
                    onChange={() => handleChartChange('SET_GRAMMAR_CHART')}
                    checked={shownChart === 'hex-map'}
                  />
                  <FormattedMessage id="hex-map" />
                </div>
              </button>
              <button
                className="progress-tour-exercise-history-button"
                type="button"
                onClick={() => handleChartChange('SET_EXERCISE_HISTORY_CHART')}
                style={{ border: 'none' }}
              >
                <div className="flex align-center" style={{ gap: '.5em' }}>
                  <input
                    type="radio"
                    onChange={() => handleChartChange('SET_EXERCISE_HISTORY_CHART')}
                    checked={shownChart === 'exercise-history'}
                  />
                  <FormattedMessage id="exercise-history" />
                </div>
              </button>
              <button
                className="progress-tour-test-history-button"
                type="button"
                onClick={() => handleChartChange('SET_TEST_HISTORY_CHART')}
                style={{ border: 'none' }}
              >
                <div className="flex align-center" style={{ gap: '.5em' }}>
                  <input
                    type="radio"
                    onChange={() => handleChartChange('SET_TEST_HISTORY_CHART')}
                    checked={shownChart === 'test-history'}
                  />
                  <FormattedMessage id="Test History" />
                </div>
              </button>
            </div>
            <Divider />
          </div>
        )}
        {shownChart === 'progress' ? (
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
            <div className="row-flex align center">
              <Popup
                content={
                  <div>
                    <FormattedHTMLMessage id="vocabulary-view-explanation" />
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
            <div>
              <div>
                <Divider />
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
                  <Spinner fullHeight size={60} />
                )}
              </div>
            </div>
          </div>
        ) : shownChart === 'exercise-history' ? (
          <div>
            <div className="row-flex align center">
              <Popup
                content={
                  <div>
                    <FormattedMessage id="exercise-history-explanation" />
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
                <FormattedMessage id="exercise-history" />
              </div>
            </div>
            <Divider />
            <History history={exerciseHistory} dateFormat="YYYY.MM" />
          </div>
        ) : shownChart === 'test-history' ? (
          <div>
            <div className="row-flex align center">
              <Popup
                content={
                  <div>
                    <FormattedMessage id="test-history-explanation" />
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
                <FormattedMessage id="Test History" />
              </div>
            </div>
            <Divider />
            <History history={filterTestHistoryByDate()} testView dateFormat="YYYY.MM.DD HH:mm" />
          </div>
        ) : (
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
