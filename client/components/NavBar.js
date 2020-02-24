import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navbar } from 'react-bootstrap'
import Headroom from 'react-headroom'
import { Icon } from 'semantic-ui-react'
import { Shake } from 'reshake'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'

export default () => {
  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const open = useSelector(({ sidebar }) => sidebar.open)
  const dispatch = useDispatch()

  const [eloChanged, setEloChanged] = useState(false)
  const [timeoutObj, setTimeoutObj] = useState(null)

  useEffect(() => {
    if (!timeoutObj && user) {
      setEloChanged(true)
      const temp = setTimeout(() => {
        setEloChanged(false)
        setTimeoutObj(null)
      }, 1000)
      setTimeoutObj(temp)
    }
  }, [user.user.exercise_history[user.user.exercise_history.length - 1].score])

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
        {user
          && (
            <Navbar.Text style={{ color: 'white', marginRight: '1em' }}>
              <div>{user.user.username}</div>
            </Navbar.Text>
          )
        }
        {user && user.user.exercise_history.length > 0 && (
        <Shake
          h={5}
          v={5}
          r={3}
          dur={500}
          int={10}
          max={100}
          fixed
          fixedStop={false}
          freez={false}
          active={eloChanged}
        >
          <Navbar.Text style={{ color: 'white', marginRight: '1em' }}>
            <div>{`Points: ${user.user.exercise_history[user.user.exercise_history.length - 1].score}`}</div>
          </Navbar.Text>
        </Shake>
        )}
      </Navbar>
    </Headroom>
  )
}
