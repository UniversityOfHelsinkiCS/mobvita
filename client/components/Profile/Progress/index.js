import React, { useState, useEffect, shallowEqual } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import { getSelf } from 'Utilities/redux/userReducer'
import ProgressGraph from 'Components/ProgressGraph'
import Spinner from 'Components/Spinner'
import ResponsiveDatePicker from 'Components/ResponsiveDatePicker'
import History from 'Components/History'
import { getHistory } from 'Utilities/redux/exerciseHistoryReducer'
import { useLearningLanguage } from 'Utilities/common'
import ProgressStats from './ProgressStats'

const PickDate = ({ date, setDate }) => (
  <ResponsiveDatePicker selected={date} onChange={date => setDate(date)} />
)

const Progress = () => {
  const [startDate, setStartDate] = useState(moment().subtract(2, 'months').toDate())
  const [endDate, setEndDate] = useState(moment().toDate())

  const { exerciseHistory, flashcardHistory, pending } = useSelector(({ user }) => {
    const exerciseHistory = user.data.user.exercise_history
    const flashcardHistory = user.data.user.flashcard_history
    const { pending } = user
    return { exerciseHistory, flashcardHistory, pending }
  }, shallowEqual)

  const { history } = useSelector(({ exerciseHistory }) => exerciseHistory)

  const learningLanguage = useLearningLanguage()

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getSelf())
    dispatch(getHistory(learningLanguage, startDate, endDate))
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
          <b><FormattedMessage id="date-start" />:</b>
          <br />
          <PickDate id="start" date={startDate} setDate={setStartDate} />
        </div>
        <div>
          <b><FormattedMessage id="date-end" />:</b>
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
          exerciseHistory={exerciseHistory}
          flashcardHistory={flashcardHistory}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
      <div>
        <h3 className="header-3">
          <FormattedMessage id="Practice history" />
        </h3>
        <History history={history} dateFormat="YYYY.MM" />
      </div>
    </div>
  )
}

export default Progress
