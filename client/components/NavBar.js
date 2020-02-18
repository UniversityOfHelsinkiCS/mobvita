import React from 'react'
import { useSelector } from 'react-redux'
import { Navbar } from 'react-bootstrap'
import { Route } from 'react-router-dom'
import Bar from './Bar'

export default () => {
  const { user } = useSelector(({ user }) => ({ user }))
  return (
    <Navbar className="justify-content-between ">
      <div style={{ marginTop: '0.5em', display: 'flex' }}>
        <Route component={Bar} />
        <Navbar.Brand href="/home">
          Mobvita
        </Navbar.Brand>
      </div>
      {user.data
        && (
        <Navbar.Text style={{ marginTop: '0.5em', marginRight: '1em' }}>
          <div>{`Logged in as ${user.data.user.username}`}</div>
        </Navbar.Text>
        )
      }
    </Navbar>
  )
}
