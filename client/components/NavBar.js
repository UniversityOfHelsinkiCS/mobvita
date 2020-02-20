import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navbar } from 'react-bootstrap'
import { Route } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import Bar from './Bar'

export default () => {
  const { user } = useSelector(({ user }) => ({ user }))
  const open = useSelector(({ sidebar }) => sidebar.open)
  const dispatch = useDispatch()

  return (
    <Navbar>
      <div style={{ display: 'flex' }}>
        <Icon
          name="bars"
          size="big"
          onClick={() => dispatch(sidebarSetOpen(!open))}
          className="sidebar-hamburger"
          style={{ color: open ? '' : 'white' }}
        />
        <Navbar.Brand style={{ color: 'white' }} href="/home">
          Mobvita
        </Navbar.Brand>
      </div>
      {user.data
        && (
        <Navbar.Text style={{ color: 'white', marginRight: '1em' }}>
          <div>{user.data.user.username}</div>
        </Navbar.Text>
        )
      }
    </Navbar>
  )
}
