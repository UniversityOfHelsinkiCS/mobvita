import React, { useState, useEffect, shallowEqual } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import { getSelf } from 'Utilities/redux/userReducer'
import ProgressGraph from 'Components/ProgressGraph'
import Spinner from 'Components/Spinner'
import 'react-datepicker/dist/react-datepicker.css'
import ProgressStats from './ProgressStats'

const PickDate = ({ date, setDate }) => (
  <DatePicker
    selected={date}
    onChange={date => setDate(date)}
    dateFormat="yyyy/MM/dd"
  />
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

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getSelf())
  }, [])

  if (pending || pending === undefined) return <Spinner />

  return (
    <div className="component-container">
      <div className="date-pickers gap-1">
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
      <ProgressStats startDate={startDate} endDate={endDate} />
      <ProgressGraph
        exerciseHistory={exerciseHistory}
        flashcardHistory={flashcardHistory}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  )
}

export default Progress
