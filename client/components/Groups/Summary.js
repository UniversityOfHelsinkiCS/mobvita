import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table, Spinner } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { CSVLink } from 'react-csv'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'

import { supportedLearningLanguages, newCapitalize } from '../../util/common'

import 'react-datepicker/dist/react-datepicker.css'


const PickDate = ({ date, setDate }) => (
  <DatePicker
    selected={date}
    onChange={date => setDate(date)}
    dateFormat="yyyy/MM/dd"
  />
)


const Summary = ({ groupName, getSummary, learningLanguage }) => {
  const [sorter, setSorter] = useState({ field: 'email', direction: { email: 1, exercises: 1 } })
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days').toDate())
  const [endDate, setEndDate] = useState(moment().toDate())
  const [summaryLanguage, setSummaryLanguage] = useState(learningLanguage)

  const summary = useSelector(({ summary: { summary } }) => {
    if (!summary) return null

    const { field, direction } = sorter

    if (field === 'email') {
      return summary.sort((a, b) => direction[field] * a.email.localeCompare(b.email))
    }
    if (field === 'exercises') {
      return summary.sort((a, b) => direction[field] * (b.number_of_exercises - a.number_of_exercises))
    }

    return summary
  })

  const pending = useSelector(({ summary }) => summary.pending)

  useEffect(() => {
    getSummary(startDate, endDate, summaryLanguage)
  }, [startDate, endDate, groupName, summaryLanguage])

  if (!summary) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    )
  }

  const handleSort = (field) => {
    setSorter(
      {
        field,
        direction: { ...sorter.direction, [field]: -1 * sorter.direction[field] },
      },
    )
  }

  const cleanGroupName = groupName
    .toLowerCase()
    .split(' ')
    .join('_')
    .replace(/[^\w\s-]/gi, '') // only allow letters, undescore and dash

  const filename = `${cleanGroupName}_summary_${summaryLanguage}.csv`

  return (
    <>
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
          <div>
            <FormattedMessage id="summary-for-language" />
            <select value={summaryLanguage} onChange={e => setSummaryLanguage(e.target.value)}>
              {supportedLearningLanguages.minor.concat(supportedLearningLanguages.major).map((lang) => {
                const temp = newCapitalize(lang)

                return (
                  <option value={temp} key={temp}>{temp}</option>
                )
              })}
            </select>
          </div>
        </div>
        <CSVLink filename={filename} data={summary}>
          <FormattedMessage id="download-csv" />
        </CSVLink>
      </div>
      {pending ? (
        <div className="spinner-container">
          <Spinner animation="border" variant="primary" size="lg" />
        </div>
      ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th
                  className="column-sort"
                  onClick={() => handleSort('email')}
                >
                  <FormattedMessage id="email-address" />
                  <Icon name={sorter.direction.email === 1 ? 'caret up' : 'caret down'} />

                </th>
                <th
                  className="column-sort"
                  onClick={() => handleSort('exercises')}
                >
                  <FormattedMessage id="completed-exercises" />
                  <Icon name={sorter.direction.exercises === -1 ? 'caret up' : 'caret down'} />
                </th>
              </tr>
            </thead>
            <tbody>
              {summary.map(user => (
                <tr key={user.email}>
                  <td>{user.email}</td>
                  <td>{user.number_of_exercises}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
    </>
  )
}

export default Summary
