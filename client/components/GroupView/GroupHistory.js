import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStudentHistory } from 'Utilities/redux/groupHistoryReducer'
import { Divider } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CustomTooltip from 'Components/CustomTooltip'
import { FormattedMessage } from 'react-intl'
import History from 'Components/History'
import Spinner from 'Components/Spinner'
import moment from 'moment'
import { colors } from 'Assets/mui_theme/designTokens'

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

  if (pending) return <Spinner fullHeight spinnerColor={colors.ink} size={60} />

  return (
    <div>
      <div>
        {view === 'exercise' ? (
          <div className="row-flex align center">
            <CustomTooltip
              permanent
              title={
                <div>
                  <FormattedMessage id="exercise-history-explanation" />
                </div>
              }
            >
              <InfoOutlinedIcon
                sx={{ paddingRight: '0.75em', marginBottom: '0.35em', color: 'grey' }}
              />
            </CustomTooltip>
            <div className="progress-page-header">
              <FormattedMessage id="exercise-history" />
            </div>
          </div>
        ) : (
          <div className="row-flex align center">
            <CustomTooltip
              permanent
              title={
                <div>
                  <FormattedMessage id="test-history-explanation" />
                </div>
              }
            >
              <InfoOutlinedIcon
                sx={{ paddingRight: '0.75em', marginBottom: '0.35em', color: 'grey' }}
              />
            </CustomTooltip>
            <div className="progress-page-header">
              <FormattedMessage id="Test History" />
            </div>
          </div>
        )}
        <Divider sx={{ my: '1em' }} />
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
