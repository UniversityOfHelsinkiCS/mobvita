import React from 'react'
import { useSelector } from 'react-redux'
import { Navbar } from 'react-bootstrap'
import { Route } from 'react-router-dom'
import Bar from './Bar'

export default () => {
  const { user } = useSelector(({ user }) => ({ user }))
  return (
    <Navbar style={{ height: '2em', alignItems: 'center' }} className="justify-content-between ">
      <div style={{ marginTop: '0.5em', display: 'flex' }}>
        <Route component={Bar} />
        <Navbar.Brand>
        Revita
        </Navbar.Brand>
      </div>
      {user.data
        && (
        <Navbar.Text style={{ marginRight: '1em' }}>
          {`Logged in as ${user.data.user.username}`}
        </Navbar.Text>
        )
      }
    </Navbar>
  )
}
