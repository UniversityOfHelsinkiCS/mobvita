import React from 'react'
import { useSelector } from 'react-redux'
import { Navbar } from 'react-bootstrap'
import { Route } from 'react-router-dom'
import Bar from './Bar'

export default () => {
  const { user } = useSelector(({ user }) => ({ user }))
  return (
    <Navbar>
      <div style={{ display: 'flex' }}>
        <Route component={Bar} />
        <Navbar.Brand style={{ color: 'white' }} href="/home">
          Mobvita
        </Navbar.Brand>
      </div>
      {user.data
        && (
        <Navbar.Text style={{ color: 'white', marginRight: '1em' }}>
          <div>{`Logged in as ${user.data.user.username}`}</div>
        </Navbar.Text>
        )
      }
    </Navbar>
  )
}
