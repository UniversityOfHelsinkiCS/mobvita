import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { learningLanguageSelector } from 'Utilities/common'
import { getStudentProgress } from 'Utilities/redux/groupProgressReducer'
import { FormattedMessage } from 'react-intl'
import ProgressGraph from 'Components/ProgressGraph'
import Spinner from 'Components/Spinner'
import moment from 'moment'
import DatePicker from 'react-datepicker'

const StudentProgress = ({ student, groupId }) => {
  const [startDate, setStartDate] = useState(moment().subtract(2, 'month').toDate())
  const [endDate, setEndDate] = useState(moment().toDate())

  const {
    pending,
    exerciseHistory,
    flashcardHistory,
  } = useSelector(({ studentProgress }) => {
    const { progress, pending } = studentProgress
    const { exercise_history: exerciseHistory, flashcard_history: flashcardHistory } = progress
    return { pending, exerciseHistory, flashcardHistory }
  })
  const learningLanguage = useSelector(learningLanguageSelector)

  const dispatch = useDispatch()

  useEffect(() => {
    if (!student) return
    dispatch(getStudentProgress(student._id, groupId, learningLanguage))
  }, [student])

  if (pending) return <Spinner />

  return (
    <div className="group-container">
      <hr />
      <div className="flex padding-left-1">
        <div className="gap-1">
          <FormattedMessage id="date-start" />
          <DatePicker
            dateFormat="yyyy/MM/dd"
            maxDate={Math.min(moment().valueOf(), endDate)}
            selected={startDate}
            onChange={date => setStartDate(date)}
          />
        </div>
        <div className="gap-1 padding-left-3">
          <FormattedMessage id="date-end" />
          <DatePicker
            dateFormat="yyyy/MM/dd"
            minDate={startDate}
            maxDate={moment().valueOf()}
            selected={endDate}
            onChange={date => setEndDate(date)}
          />
        </div>
      </div>
      {student
        ? (
          <ProgressGraph
            exerciseHistory={exerciseHistory}
            flashcardHistory={flashcardHistory}
            startDate={startDate}
            endDate={endDate}
          />
        ) : <FormattedMessage id="select-a-student-from-list" />
      }
    </div>
  )
}

export default StudentProgress
