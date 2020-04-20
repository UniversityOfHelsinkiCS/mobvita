import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { FormattedMessage, useIntl } from 'react-intl'
import { getPersonalSummary } from 'Utilities/redux/groupSummaryReducer'
import { Spinner } from 'react-bootstrap'
import { learningLanguageSelector, images, capitalize } from '../../util/common'
import EloChart from '../LandingPage/EloChart'

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

  const getLearningLanguageFlag = () => {
    if (learningLanguage) {
      return images[`flag${capitalize(learningLanguage.split('-').join(''))}`]
    }
    return null
  }

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
      {pending ? (
        <div className="spinner-container">
          <Spinner animation="border" variant="primary" size="lg" />
        </div>
      ) : (
          <div className="center gap-2 padding-top-3 padding-bottom-3">
            <img
              src={getLearningLanguageFlag()}
              alt="learning language flag"
              height="90px"
              style={{ border: '1px solid gray' }}
            />
            <div className="stat">
              <span>{summary[0] && summary[0].number_of_exercises}</span>
              <span>{intl.formatMessage({ id: 'completed-exercises' })}: </span>
            </div>
            <div className="stat">
              <span>{summary[0] && summary[0].number_of_snippets}</span>
              <span>{intl.formatMessage({ id: 'completed-snippets' })}: </span>
            </div>
          </div>
        )}
      <EloChart width="100%" />
    </div>
  )
}

export default Progress
