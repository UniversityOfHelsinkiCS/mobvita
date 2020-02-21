import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navbar } from 'react-bootstrap'
import Headroom from 'react-headroom'
import { Icon } from 'semantic-ui-react'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'

export default () => {
  const { user } = useSelector(({ user }) => ({ user }))
  const open = useSelector(({ sidebar }) => sidebar.open)
  const dispatch = useDispatch()

  return (
    <Headroom>
      <Navbar style={{ paddingLeft: '0.5em' }}>
        <div style={{ display: 'flex' }}>
          <Icon
            name="bars"
            size="big"
            onClick={() => dispatch(sidebarSetOpen(!open))}
            className="sidebar-hamburger"
            style={{ color: 'white' }}
            data-cy="hamburger"
          />
          <Navbar.Brand
            style={{ color: 'white', marginLeft: '0.5em' }}
            href="/home"
          >
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
    </Headroom>
  )
}
