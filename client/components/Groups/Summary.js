import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Spinner, Button } from 'react-bootstrap'
import { CSVLink } from 'react-csv'

const Summary = ({ groupName, getSummary }) => {
  const { summary, pending } = useSelector(({ summary }) => summary)
  const [days, setDays] = useState(7)

  if (pending) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    )
  }

  const cleanGroupName = groupName.toLowerCase().split(' ').join('_').replace(/[^\w\s-]/gi, '')
  const filename = `${cleanGroupName}_summary.csv`

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          from last <input value={days} onChange={e => setDays(e.target.value)} /> days
          <Button onClick={() => getSummary(days)}>refresh</Button>
        </div>
        <CSVLink filename={filename} data={summary}>download csv</CSVLink>
      </div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Email</th>
            <th>Completed Exercises</th>
          </tr>
        </thead>
        <tbody>
          {summary.map(user => (
            <tr>
              <td>{user.email}</td>
              <td>{user.number_of_exercises}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default Summary
