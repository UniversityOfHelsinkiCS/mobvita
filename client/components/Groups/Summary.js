import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Table, Spinner, Button } from 'react-bootstrap'
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
  const { summary, pending } = useSelector(({ summary }) => summary)
  const [startDate, setStartDate] = useState(moment().subtract(7, 'days').toDate())
  const [endDate, setEndDate] = useState(moment().toDate())

  useEffect(() => {
    getSummary(startDate, endDate)
  }, [startDate, endDate])

  if (!summary) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
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
              <th>Email</th>
              <th>Completed Exercises</th>
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
