/* eslint-disable no-nested-ternary */
import React, { useState, useEffect, shallowEqual } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { getSelf, getPreviousVocabularyData } from 'Utilities/redux/userReducer'
import ProgressGraph from 'Components/ProgressGraph'
import Spinner from 'Components/Spinner'
import { Button } from 'react-bootstrap'
import { Divider, Icon, Popup } from 'semantic-ui-react'
import ResponsiveDatePicker from 'Components/ResponsiveDatePicker'
import History from 'Components/History'
import { getHistory as getExerciseHistory } from 'Utilities/redux/exerciseHistoryReducer'
import { getHistory as getTestHistory } from 'Utilities/redux/testReducer'
import { useLearningLanguage, hiddenFeatures } from 'Utilities/common'
import useWindowDimension from 'Utilities/windowDimensions'
import { useHistory } from 'react-router-dom'
import VocabularyGraph from 'Components/VocabularyView/VocabularyGraph'
import HexagonTest from 'Components/GridHexagon'
import ProgressStats from './ProgressStats'

const PickDate = ({ date, setDate }) => (
  <ResponsiveDatePicker selected={date} onChange={date => setDate(date)} />
)

const Progress = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const intl = useIntl()

  const [startDate, setStartDate] = useState(moment().subtract(2, 'months').toDate())
  const [endDate, setEndDate] = useState(moment().toDate())

  const learningLanguage = useLearningLanguage()
  const { history: testHistory } = useSelector(({ tests }) => tests)
  const [shownChart, setShownChart] = useState('progress')
  const [parsedDate, setParsedDate] = useState(startDate.toJSON().slice(0, 10))
  const bigScreen = useWindowDimension().width >= 650

  const {
    exerciseHistory: exerciseHistoryGraph,
    flashcardHistory,
    vocabularyData,
    vocabularyPending,
    pending,
  } = useSelector(({ user }) => {
    const exerciseHistory = user.data.user.exercise_history
    const flashcardHistory = user.data.user.flashcard_history
    const { vocabularyData } = user
    const { pending } = user
    const { vocabularyPending } = user
    return { exerciseHistory, flashcardHistory, vocabularyData, pending, vocabularyPending }
  }, shallowEqual)

  const filterTestHistoryByDate = () =>
    testHistory.filter(test => {
      const testTime = moment(test.date)
      return testTime.isAfter(startDate) && testTime.isBefore(endDate)
    })

  const { history: exerciseHistory, pending: historyPending } = useSelector(
    ({ exerciseHistory }) => exerciseHistory
  )

  useEffect(() => {
    dispatch(getPreviousVocabularyData(parsedDate))
  }, [parsedDate])

  /*
  useEffect(() => {
    if (exerciseHistoryGraph.length > 0) {
      setEndDate(exerciseHistoryGraph[exerciseHistoryGraph.length - 1].date)
    }
  }, [exerciseHistoryGraph])
  */

  useEffect(() => {
    setParsedDate(startDate.toJSON().slice(0, 10))
    dispatch(getSelf())
    dispatch(getExerciseHistory(learningLanguage, startDate, endDate))
    dispatch(getTestHistory(learningLanguage, startDate, endDate))
  }, [startDate, endDate])

  if (pending || pending === undefined) return <Spinner />

  return (
    <div className="cont ps-nm">
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
      <br />
      <div className="space-evenly">
        <button type="button" onClick={() => setShownChart('progress')} style={{ border: 'none' }}>
          <div className="flex align-center" style={{ gap: '.5em' }}>
            <input
              type="radio"
              onChange={() => setShownChart('progress')}
              checked={shownChart === 'progress'}
            />
            <FormattedMessage id="Progress graph" />
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
        <button type="button" onClick={() => setShownChart('hex-map')} style={{ border: 'none' }}>
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
          onClick={() => setShownChart('exercise-history')}
          style={{ border: 'none' }}
        >
          <div className="flex align-center" style={{ gap: '.5em' }}>
            <input
              type="radio"
              onChange={() => setShownChart('exercise-history')}
              checked={shownChart === 'exercise-history'}
            />
            <FormattedMessage id="exercise-history" />
          </div>
        </button>
        <button
          type="button"
          onClick={() => setShownChart('test-history')}
          style={{ border: 'none' }}
        >
          <div className="flex align-center" style={{ gap: '.5em' }}>
            <input
              type="radio"
              onChange={() => setShownChart('test-history')}
              checked={shownChart === 'test-history'}
            />
            <FormattedMessage id="Test History" />
          </div>
        </button>
      </div>
      <Divider />

      {shownChart === 'progress' ? (
        <div>
          <div className="progress-page-header">
            <FormattedMessage id="Progress graph" />
          </div>
          <ProgressStats startDate={startDate} endDate={endDate} />
          <div className="progress-page-graph-cont">
            <ProgressGraph
              exerciseHistory={exerciseHistoryGraph}
              flashcardHistory={flashcardHistory}
              startDate={startDate}
              endDate={endDate}
            />
          </div>
        </div>
      ) : shownChart === 'vocabulary' ? (
        <div>
          <div className="row-flex align center">
            <Popup
              content={
                <div>
                  <FormattedHTMLMessage id="vocabulary-view-explanation" />
                  <br />
                  <br />
                  <b>{intl.formatMessage({ id: 'vocabulary-total' })}</b>
                  {''}
                  {`: ${intl.formatMessage({
                    id: 'vocabulary-total-explanation',
                  })}`}
                  <br />
                  <br />
                  <b>{intl.formatMessage({ id: 'vocabulary-seen' })}</b>
                  {''}
                  {`: ${intl.formatMessage({
                    id: 'vocabulary-seen-explanation',
                  })}`}
                  <br />
                  <br />
                  <b>{intl.formatMessage({ id: 'vocabulary-visit' })}</b>
                  {''}
                  {`: ${intl.formatMessage({
                    id: 'vocabulary-visit-explanation',
                  })}`}
                  <br />
                  <br />
                  <b>{intl.formatMessage({ id: 'vocabulary-flashcard' })}</b>
                  {''}
                  {`: ${intl.formatMessage({
                    id: 'vocabulary-flashcard-explanation',
                  })}`}
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
              <div className="progress-page-graph-cont">
                <VocabularyGraph vocabularyData={vocabularyData} pending={vocabularyPending} />
              </div>
            </div>
          </div>
        </div>
      ) : shownChart === 'exercise-history' ? (
        <div>
          <div className="progress-page-header">
            <FormattedMessage id="exercise-history" />
          </div>
          <History history={exerciseHistory} dateFormat="YYYY.MM" />
        </div>
      ) : shownChart === 'test-history' ? (
        <div>
          <div className="progress-page-header">
            <FormattedMessage id="Test History" />
          </div>
          <History history={filterTestHistoryByDate()} testView dateFormat="YYYY.MM.DD HH:mm" />
        </div>
      ) : (
        <div>
          <div className="progress-page-header">
            <FormattedMessage id="hex-map" />
          </div>
          <HexagonTest exerciseHistory={exerciseHistory} pending={historyPending} />
        </div>
      )}
    </div>
  )
}

export default Progress
