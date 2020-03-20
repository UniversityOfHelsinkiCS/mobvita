import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Table, Spinner } from 'react-bootstrap'

const Summary = () => {
  const { summary, pending } = useSelector(({ summary }) => summary)

  if (pending) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    )
  }
  return (
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
  )
}

export default Summary
