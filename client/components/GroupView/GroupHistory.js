import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStudentHistory } from 'Utilities/redux/groupHistoryReducer'
import { FormattedMessage } from 'react-intl'
import History from 'Components/History'
import Spinner from 'Components/Spinner'
import { Dropdown } from 'semantic-ui-react'
import moment from 'moment'

const StudentHistory = ({ student, setStudent, startDate, endDate, group, view }) => {
  const { pending, history } = useSelector(({ studentHistory }) => studentHistory)

  const studentOptions = group?.students.map(student => ({
    key: student._id,
    text: `${student?.userName} (${student?.email})`,
    value: student,
  }))

  const filterTestHistoryByDate = () =>
    history?.filter(test => {
      const testTime = moment(test.date)
      return testTime.isAfter(startDate) && testTime.isBefore(endDate)
    })

  /*
  const windowWidth = useWindowDimensions().width
  useEffect(() => {
    if (windowWidth > 1040) setPageSize(6)
    else if (windowWidth > 950) setPageSize(6)
    else if (windowWidth > 800) setPageSize(5)
    else if (windowWidth > 675) setPageSize(4)
    else if (windowWidth > 550) setPageSize(2)
    else if (windowWidth > 425) setPageSize(2)
    else setPageSize(1)
  }, [windowWidth])
  */

  const dispatch = useDispatch()

  const handleStudentChange = student => {
    setStudent(student)
  }

  useEffect(() => {
    if (!student) return
    dispatch(getStudentHistory(student._id, group.group_id, startDate, endDate, view))
  }, [student, view, startDate, endDate])

  if (pending) return <Spinner />

  const dropDownMenuText = student ? `${student?.userName} (${student?.email})` : '-'

  return (
    <div>
      <div className="group-analytics-student-dropdown">
        <FormattedMessage id="student" />:{' '}
        <Dropdown
          text={dropDownMenuText}
          selection
          fluid
          options={studentOptions}
          onChange={(_, { value }) => handleStudentChange(value)}
          disabled={!student}
        />
      </div>

      <div>
        <h3>
          {view === 'exercise' ? (
            <FormattedMessage id="Practice history" />
          ) : (
            <FormattedMessage id="Test History" />
          )}
        </h3>
      </div>

      {student ? (
        <div>
          {view === 'exercise' ? (
            <History history={filterTestHistoryByDate()} dateFormat="YYYY.MM" />
          ) : (
            <History history={filterTestHistoryByDate()} dateFormat="YYYY.MM.DD" />
          )}
        </div>
      ) : (
        <div className="group-analytics-no-results">
          <FormattedMessage id="no-students-in-group" />
        </div>
      )}
    </div>
  )
}

export default StudentHistory
