import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStudentHistory } from 'Utilities/redux/groupHistoryReducer'
import { FormattedMessage } from 'react-intl'
import History from 'Components/History'
import Spinner from 'Components/Spinner'
import ResponsiveDatePicker from 'Components/ResponsiveDatePicker'
import { Icon, Button } from 'semantic-ui-react'
import useWindowDimensions from 'Utilities/windowDimensions'
import moment from 'moment'

const StudentHistory = ({ student, groupId, view }) => {
  const [startDate, setStartDate] = useState(moment().subtract(6, 'month').toDate())
  const [endDate, setEndDate] = useState(moment().toDate())
  const maxDate = moment().valueOf()
  const minDate = 0
  const [pageSize, setPageSize] = useState(2)
  const { pending, history } = useSelector(({ studentHistory }) => studentHistory)

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

  const switchPage = change => {
    console.log(endDate>=maxDate)
    setStartDate(Math.max(minDate, moment(startDate).add(pageSize * change, 'month')))
    setEndDate(Math.min(maxDate, moment(endDate).add(pageSize * change, 'month')))
  }

  const dispatch = useDispatch()

  useEffect(() => {
    if (!student) return
    dispatch(getStudentHistory(student._id, groupId, startDate, endDate, view))
  }, [student, view, startDate, endDate])

  if (pending) return <Spinner />
 // <ResponsiveDatePicker maxDate={Math.min(moment().valueOf(), endDate)} selected={startDate} onChange={date => setStartDate(date)} />
 // <ResponsiveDatePicker minDate={startDate} maxDate={moment().valueOf()} selected={endDate} onChange={date => setEndDate(date)}/>
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
              <span>{moment(startDate).format('YYYY-MM-DD')}</span>
            </div>
            <div className="gap-col-sm pl-lg">
              <span className="sm-label">
                <FormattedMessage id="date-end" />
              </span>
              <span>{moment(endDate).format('YYYY-MM-DD')}</span>
            </div>
          </div>
          <div>
              <Button  onClick={() => switchPage(1)} disabled={endDate>=moment(maxDate).subtract(1, 'day')}>
                <Icon name='angle left' />  
              </Button>
              <Button  onClick={() => switchPage(-1)} disabled={startDate<=minDate}>
                <Icon name='angle right' /> 
              </Button>
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
