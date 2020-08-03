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

  const { pending, exerciseHistory, flashcardHistory } = useSelector(({ studentProgress }) => {
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
    <div>
      <hr />
      <div className="flex padding-left-1">
        <div className="gap-1">
          <span className="sm-label">
            <FormattedMessage id="date-start" />
          </span>
          <DatePicker
            dateFormat="yyyy/MM/dd"
            maxDate={Math.min(moment().valueOf(), endDate)}
            selected={startDate}
            onChange={date => setStartDate(date)}
            withPortal
          />
        </div>
        <div className="gap-1 padding-left-3">
          <span className="sm-label">
            <FormattedMessage id="date-end" />
          </span>
          <DatePicker
            dateFormat="yyyy/MM/dd"
            minDate={startDate}
            maxDate={moment().valueOf()}
            selected={endDate}
            onChange={date => setEndDate(date)}
            withPortal
          />
        </div>
      </div>
      {student ? (
        <ProgressGraph
          exerciseHistory={exerciseHistory}
          flashcardHistory={flashcardHistory}
          startDate={startDate}
          endDate={endDate}
        />
      ) : (
        <div
          style={{
            paddingTop: '5rem',
            fontSize: '1.3rem',
            fontStyle: 'italic',
            display: 'flex',
            justifyContent: 'center',
            color: '#777',
          }}
        >
          <FormattedMessage id="select-a-student-from-list" />
        </div>
      )}
    </div>
  )
}

export default StudentProgress
