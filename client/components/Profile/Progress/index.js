import React, { useState, useEffect, shallowEqual } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { Button } from 'react-bootstrap'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { getSelf, getVocabularyData } from 'Utilities/redux/userReducer'
import ProgressGraph from 'Components/ProgressGraph'
import Spinner from 'Components/Spinner'
import { Divider, Icon, Popup } from 'semantic-ui-react'
import ResponsiveDatePicker from 'Components/ResponsiveDatePicker'
import History from 'Components/History'
import { getHistory as getExerciseHistory } from 'Utilities/redux/exerciseHistoryReducer'
import { getHistory as getTestHistory } from 'Utilities/redux/testReducer'

import { hiddenFeatures, useLearningLanguage } from 'Utilities/common'
import useWindowDimension from 'Utilities/windowDimensions'
import { useHistory } from 'react-router-dom'
import VocabularyGraph from 'Components/VocabularyView/VocabularyGraph'
import ProgressStats from './ProgressStats'

const PickDate = ({ date, setDate }) => (
  <ResponsiveDatePicker selected={date} onChange={date => setDate(date)} />
)

const Progress = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [startDate, setStartDate] = useState(moment().subtract(2, 'months').toDate())
  const [endDate, setEndDate] = useState(moment().toDate())
  const [historyView, setHistoryView] = useState('exercise')

  const learningLanguage = useLearningLanguage()
  const { history: testHistory } = useSelector(({ tests }) => tests)

  const bigScreen = useWindowDimension().width >= 650

  const {
    exerciseHistory: exerciseHistoryGraph,
    flashcardHistory,
    vocabularyData,
    pending,
  } = useSelector(({ user }) => {
    const exerciseHistory = user.data.user.exercise_history
    const flashcardHistory = user.data.user.flashcard_history
    const { vocabularyData } = user
    const { pending } = user
    return { exerciseHistory, flashcardHistory, vocabularyData, pending }
  }, shallowEqual)

  const filterTestHistoryByDate = () =>
    testHistory.filter(test => {
      const testTime = moment(test.date)
      return testTime.isAfter(startDate) && testTime.isBefore(endDate)
    })

  const { history: exerciseHistory } = useSelector(({ exerciseHistory }) => exerciseHistory)

  useEffect(() => {
    dispatch(getSelf())
    dispatch(getExerciseHistory(learningLanguage, startDate, endDate))
    dispatch(getTestHistory(learningLanguage, startDate, endDate))
  }, [startDate, endDate])

  useEffect(() => {
    dispatch(getVocabularyData())
  }, [])

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
      {hiddenFeatures && (
        <div>
          <Divider />
          <div className="flex gap-col-nm">
            <Button onClick={() => history.push('/test-hexagon')}>Test hexagon grid</Button>
            <Button onClick={() => history.push('/vocabulary-view')}>Test vocabulary view</Button>
          </div>
        </div>
      )}
      <Divider />
      <div>
        <div className="row-flex">
          <div className="progress-page-header">
            <FormattedMessage id="vocabulary-chart-header" />
          </div>
          <Popup
            content={<FormattedHTMLMessage id="vocabulary-view-explanation" />}
            trigger={
              <Icon
                style={{ paddingLeft: '0.5em', marginBottom: '0.35em' }}
                name="info circle"
                color="grey"
              />
            }
          />
        </div>
        <div>
          <div className="progress-page-graph-cont">
            <div style={{ width: '1000px' }}>
              <VocabularyGraph vocabularyData={vocabularyData} />
            </div>
          </div>
        </div>
      </div>
      <Divider />

      <div>
        <div className="flex align center" style={{ gap: '3em' }}>
          <div className="progress-page-header">
            <FormattedMessage id="history" />
          </div>
          <div className="flex">
            <button
              type="button"
              onClick={() => setHistoryView('exercise')}
              style={{ border: 'none' }}
            >
              <div className="flex align-center" style={{ gap: '.5em' }}>
                <input
                  type="radio"
                  onChange={() => setHistoryView('exercise')}
                  checked={historyView === 'exercise'}
                />
                <FormattedMessage id="Exercise" />
              </div>
            </button>
            <button type="button" onClick={() => setHistoryView('test')} style={{ border: 'none' }}>
              <div className="flex align-center" style={{ gap: '.5em' }}>
                <input
                  type="radio"
                  onChange={() => setHistoryView('test')}
                  checked={historyView === 'test'}
                />
                <FormattedMessage id="Test" />
              </div>
            </button>
          </div>
        </div>
        {historyView === 'exercise' ? (
          <History history={exerciseHistory} dateFormat="YYYY.MM" />
        ) : (
          <History history={filterTestHistoryByDate()} testView dateFormat="YYYY.MM.DD HH:mm" />
        )}
      </div>
    </div>
  )
}

export default Progress
