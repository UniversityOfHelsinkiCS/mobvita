import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStudentHistory } from 'Utilities/redux/groupHistoryReducer'
import { Divider, Icon, Popup } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import History from 'Components/History'
import Spinner from 'Components/Spinner'
import moment from 'moment'

const StudentHistory = ({ student, startDate, endDate, group, view }) => {
  const { pending, history } = useSelector(({ studentHistory }) => studentHistory)

  const filterTestHistoryByDate = () =>
    history?.filter(test => {
      const testTime = moment(test.date)
      return testTime.isAfter(startDate) && testTime.isBefore(endDate)
    })

  const reverseOrder = object =>
    object?.sort((a, b) => {
      return new Date(a.date) - new Date(b.date)
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

  useEffect(() => {
    if (!student) return
    dispatch(getStudentHistory(student._id, group.group_id, startDate, endDate, view))
  }, [student, view, startDate, endDate])

  if (pending) return <Spinner fullHeight size={60} />

  return (
    <div>
      <div>
        {view === 'exercise' ? (
          <div className="row-flex align center">
            <Popup
              content={
                <div>
                  <FormattedMessage id="exercise-history-explanation" />
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
              <FormattedMessage id="exercise-history" />
            </div>
          </div>
        ) : (
          <div className="row-flex align center">
            <Popup
              content={
                <div>
                  <FormattedMessage id="test-history-explanation" />
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
              <FormattedMessage id="Test History" />
            </div>
          </div>
        )}
        <Divider />
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
        <div className="group-analytics-no-results">
          <FormattedMessage id="no-students-in-group" />
        </div>
      )}
    </div>
  )
}

export default StudentHistory
