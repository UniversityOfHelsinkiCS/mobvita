import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStudentHistory } from 'Utilities/redux/groupHistoryReducer'
import { Box } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import History from 'Components/History'
import Spinner from 'Components/Spinner'
import ChartHeading from 'Components/ChartHeading'
import dayjs from 'dayjs'
import { colors } from 'Assets/mui_theme/designTokens'

const StudentHistory = ({ student, startDate, endDate, group, view }) => {
  const { pending, history } = useSelector(({ studentHistory }) => studentHistory)

  const filterTestHistoryByDate = () =>
    history?.filter(test => {
      const testTime = dayjs(test.date)
      return testTime.isAfter(startDate) && testTime.isBefore(endDate)
    })

  const reverseOrder = object =>
    object?.sort((a, b) => {
      return new Date(a.date) - new Date(b.date)
    })

  const dispatch = useDispatch()

  useEffect(() => {
    if (!student) return
    dispatch(getStudentHistory(student._id, group.group_id, startDate, endDate, view))
  }, [student, view, startDate, endDate])

  if (pending) return <Spinner fullHeight spinnerColor={colors.ink} size={60} />

  return (
    <div>
      <div>
        {view === 'exercise' ? (
          <ChartHeading
            titleId="exercise-history"
            tooltip={<FormattedMessage id="exercise-history-explanation" />}
          />
        ) : (
          <ChartHeading
            titleId="Test History"
            tooltip={<FormattedMessage id="test-history-explanation" />}
          />
        )}
        <Box sx={{ height: '2em' }} />
      </div>

      {student ? (
        <div>
          {view === 'exercise' ? (
            <History history={reverseOrder(filterTestHistoryByDate())} dateFormat="MM/YYYY" />
          ) : (
            <History
              history={reverseOrder(filterTestHistoryByDate())}
              testView
              dateFormat="YYYY.MM.DD HH:mm"
            />
          )}
        </div>
      ) : (
        <div className="group-analytics-no-results" data-cy="group-history-no-students">
          <FormattedMessage id="no-students-in-group" />
        </div>
      )}
    </div>
  )
}

export default StudentHistory
