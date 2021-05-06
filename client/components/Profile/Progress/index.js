import React, { useState, useEffect, shallowEqual } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { ButtonGroup, ToggleButton } from 'react-bootstrap'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import { getSelf } from 'Utilities/redux/userReducer'
import ProgressGraph from 'Components/ProgressGraph'
import Spinner from 'Components/Spinner'
import ResponsiveDatePicker from 'Components/ResponsiveDatePicker'
import History from 'Components/History'
import { getHistory as getExerciseHistory } from 'Utilities/redux/exerciseHistoryReducer'
import { getHistory as getTestHistory } from 'Utilities/redux/testReducer'
import { useLearningLanguage } from 'Utilities/common'
import ProgressStats from './ProgressStats'

const PickDate = ({ date, setDate }) => (
  <ResponsiveDatePicker selected={date} onChange={date => setDate(date)} />
)

const marginLeftButton = '2px'

const Progress = () => {
  const dispatch = useDispatch()

  const [startDate, setStartDate] = useState(moment().subtract(2, 'months').toDate())
  const [endDate, setEndDate] = useState(moment().toDate())
  const [historyView, setHistoryView] = useState('exercise')

  const learningLanguage = useLearningLanguage()
  const { history: testHistory } = useSelector(({ tests }) => tests)

  const { exerciseHistory: exerciseHistoryGraph, flashcardHistory, pending } = useSelector(
    ({ user }) => {
      const exerciseHistory = user.data.user.exercise_history
      const flashcardHistory = user.data.user.flashcard_history
      const { pending } = user
      return { exerciseHistory, flashcardHistory, pending }
    },
    shallowEqual
  )

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

  if (pending || pending === undefined) return <Spinner />

  return (
    <div className="cont ps-nm">
      <h2 className="header-2 bold">
        <FormattedMessage id="Showing results for" />
      </h2>
      <br />
      <div className="date-pickers gap-col-sm">
        <div>
          <b>
            <FormattedMessage id="date-start" />:
          </b>
          <br />
          <PickDate id="start" date={startDate} setDate={setStartDate} />
        </div>
        <div>
          <b>
            <FormattedMessage id="date-end" />:
          </b>
          <br />
          <PickDate date={endDate} setDate={setEndDate} />
        </div>
      </div>
      <br />
      <hr />
      <div>
        <h3 className="header-3">
          <FormattedMessage id="Progress graph" />
        </h3>
        <ProgressStats startDate={startDate} endDate={endDate} />
        <ProgressGraph
          exerciseHistory={exerciseHistoryGraph}
          flashcardHistory={flashcardHistory}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
      <ButtonGroup
        toggle
        style={{
          float: 'right',
          paddingTop: '1rem',
        }}
      >
        <ToggleButton
          type="radio"
          value="exercise"
          variant="success"
          checked={historyView === 'exercise'}
          onChange={() => setHistoryView('exercise')}
        >
          <FormattedMessage id="Exercise" />
        </ToggleButton>
        <ToggleButton
          type="radio"
          value="test"
          variant="success"
          style={{ marginLeft: marginLeftButton }}
          checked={historyView === 'test'}
          onChange={() => setHistoryView('test')}
          disabled={testHistory?.length === 0}
        >
          <FormattedMessage id="Test" />
        </ToggleButton>
      </ButtonGroup>
      <div>
        {historyView === 'exercise' ? (
          <>
            <h3 className="header-3">
              <FormattedMessage id="Practice history" />
            </h3>
            <History history={exerciseHistory} dateFormat="YYYY.MM" />
          </>
        ) : (
          <>
            <h3 className="header-3">
              <FormattedMessage id="Test History" />
            </h3>
            <History history={filterTestHistoryByDate()} dateFormat="YYYY.MM" />
          </>
        )}
      </div>
    </div>
  )
}

export default Progress
