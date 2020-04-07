import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { FormattedMessage, useIntl } from 'react-intl'
import { getPersonalSummary } from 'Utilities/redux/groupSummaryReducer'
import { Spinner } from 'react-bootstrap'
import { learningLanguageSelector } from '../../util/common'


import 'react-datepicker/dist/react-datepicker.css'


const PickDate = ({ date, setDate }) => (
  <DatePicker
    selected={date}
    onChange={date => setDate(date)}
    dateFormat="yyyy/MM/dd"
  />
)


const Progress = () => {
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days').toDate())
  const [endDate, setEndDate] = useState(moment().toDate())

  const intl = useIntl()

  const learningLanguage = useSelector(learningLanguageSelector)

  const summary = useSelector(({ summary }) => summary.summary)

  const pending = useSelector(({ summary }) => summary.pending)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getPersonalSummary(learningLanguage, startDate, endDate))
  }, [startDate, endDate, learningLanguage])

  if (!summary) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    )
  }

  return (
    <div className="component-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1em' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <FormattedMessage id="date-start" />
            <PickDate id="start" date={startDate} setDate={setStartDate} />
          </div>
          <div style={{ marginLeft: '1em', marginRight: '1em' }}>
            <FormattedMessage id="date-end" />
            <PickDate date={endDate} setDate={setEndDate} />
          </div>
        </div>
      </div>
      {pending ? (
        <div className="spinner-container">
          <Spinner animation="border" variant="primary" size="lg" />
        </div>
      ) : (
          <div>

            <div>
              <b>{intl.formatMessage({ id: 'completed-exercises' })}: </b>
              {summary[0].number_of_exercises}
            </div>
            <div>
              <b>{intl.formatMessage({ id: 'completed-snippets' })}: </b>
              {summary[0].number_of_snippets}
            </div>
          </div>
        )}
    </div>
  )
}

export default Progress
