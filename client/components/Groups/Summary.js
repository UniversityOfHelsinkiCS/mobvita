import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table, Spinner } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import { CSVLink } from 'react-csv'
import DatePicker from 'react-datepicker'
import moment from 'moment'

import 'react-datepicker/dist/react-datepicker.css'


const PickDate = ({ date, setDate }) => (
  <DatePicker
    selected={date}
    onChange={date => setDate(date)}
    dateFormat="yyyy/MM/dd"
  />
)


const Summary = ({ groupName, getSummary }) => {
  const [sorter, setSorter] = useState({ field: 'email', direction: { email: 1, exercises: 1 } })
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days').toDate())
  const [endDate, setEndDate] = useState(moment().toDate())

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
    getSummary(startDate, endDate)
  }, [startDate, endDate, groupName])

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

  const filename = `${cleanGroupName}_summary.csv`

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            From:
            <PickDate id="start" date={startDate} setDate={setStartDate} />
          </div>
          <div style={{ marginLeft: '1em' }}>
            To:
            <PickDate date={endDate} setDate={setEndDate} />
          </div>
        </div>
        <CSVLink filename={filename} data={summary}>download csv</CSVLink>
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
                Email
                <Icon name={sorter.direction.email === 1 ? 'caret up' : 'caret down'} />

              </th>
              <th
                className="column-sort"
                onClick={() => handleSort('exercises')}
              >
                Completed Exercises
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
