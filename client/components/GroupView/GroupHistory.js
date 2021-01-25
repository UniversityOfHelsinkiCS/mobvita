import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStudentHistory } from 'Utilities/redux/groupHistoryReducer'
import { FormattedMessage } from 'react-intl'
import History from 'Components/History'
import Spinner from 'Components/Spinner'
import ResponsiveDatePicker from 'Components/ResponsiveDatePicker'
import moment from 'moment'

const StudentHistory = ({ student, groupId, view }) => {
  const [startDate, setStartDate] = useState(moment().subtract(2, 'month').toDate())
  const [endDate, setEndDate] = useState(moment().toDate())

  const { pending, history } = useSelector(({ studentHistory }) => studentHistory)

  const dispatch = useDispatch()

  useEffect(() => {
    if (!student) return
    dispatch(getStudentHistory(student._id, groupId, startDate, endDate, view))
  }, [student, view, startDate, endDate])

  if (pending) return <Spinner />

  return (
    <div>
      <hr />
      {view == 'exercise' ? (
        <div>
          <FormattedMessage id="Practice history" />
          <br />
          <span className="sm-label pl-sm">
            <FormattedMessage id="Showing results for" />
          </span>
          <div className="flex pl-sm">
            <div className="gap-col-sm">
              <span className="sm-label">
                <FormattedMessage id="date-start" />
              </span>
              <ResponsiveDatePicker
                maxDate={Math.min(moment().valueOf(), endDate)}
                selected={startDate}
                onChange={date => setStartDate(date)}
              />
            </div>
            <div className="gap-col-sm pl-lg">
              <span className="sm-label">
                <FormattedMessage id="date-end" />
              </span>
              <ResponsiveDatePicker
                minDate={startDate}
                maxDate={moment().valueOf()}
                selected={endDate}
                onChange={date => setEndDate(date)}
              />
            </div>
          </div>
        </div>
      ) : (
        <FormattedMessage id="Test History" />
      )}
      {student ? (
        <div>
          {view == 'exercise' ? (
            <History history={history} dateFormat="MMM.YYYY" />
          ):(
            <History history={history} dateFormat="MMM.DD.YYYY" />
          )}
        </div>
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

export default StudentHistory
