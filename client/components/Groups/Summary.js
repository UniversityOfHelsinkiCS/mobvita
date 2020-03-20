import React from 'react'
import { useSelector } from 'react-redux'
import { Table, Spinner } from 'react-bootstrap'
import { CSVLink } from 'react-csv'

const Summary = ({ groupName }) => {
  const { summary, pending } = useSelector(({ summary }) => summary)

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
      <CSVLink filename={filename} data={summary}>download csv</CSVLink>
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
              <td>{user.quantity}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}

export default Summary
