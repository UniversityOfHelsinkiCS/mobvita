import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar, Segment, Menu, Dropdown, Icon, Button } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Swipeable } from 'react-swipeable'

import { localeOptions } from 'Utilities/common'
import { setLocale } from 'Utilities/redux/localeReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { logout } from 'Utilities/redux/userReducer'
import { resetCurrentSnippet } from 'Utilities/redux/snippetsReducer'


export default function Bar() {
  const intl = useIntl()
  const dispatch = useDispatch()

  const [language, setLanguage] = useState('')

  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const open = useSelector(({ sidebar }) => sidebar.open)
  const focusedSnippet = useSelector(({ snippets }) => snippets.focused)


  const signOut = () => dispatch(logout())
  const chooseLanguage = code => () => dispatch(setLocale(code))


  const menuClickWrapper = (func) => {
    if (func) func()

    if (window.innerWidth <= 1024) {
      dispatch(sidebarSetOpen(false))
    }
  }

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      dispatch(sidebarSetOpen(true))
    } else {
      dispatch(sidebarSetOpen(false))
    }
  }, [])


  useEffect(() => {
    const currentLanguge = window.location.pathname.split('/')[2]
    setLanguage(currentLanguge)
  }, [window.location.pathname])


  return (
    <>
      <Icon
        name="bars"
        size="big"
        onClick={() => dispatch(sidebarSetOpen(!open))}
        id="sidebar-hamburger"
      />
      <Swipeable
        style={{ width: '3em', height: '100vh', position: 'absolute' }}
        onSwipedRight={() => dispatch(sidebarSetOpen(true))}
        onSwipedLeft={() => dispatch(sidebarSetOpen(false))}
        trackMouse
      >
        <Sidebar
          as={Menu}
          animation="push"
          icon="labeled"
          vertical
          visible={open}
        >

          <div id="sidebar-content">

            {user && (
              <>
                <Menu.Item>
                  <div>
                    <div>{user.user.username}</div>
                    <div>{user.user.email}</div>
                    <div>Streak data unavailable</div>
                  </div>
                </Menu.Item>

                <Menu.Item>
                  <Button fluid onClick={() => menuClickWrapper()}>
                    <Link to="/">Change learning language</Link>
                  </Button>
                </Menu.Item>
              </>
            )}

            <div style={{ marginTop: 'auto' }}>
              <Menu.Item style={{ display: 'flex', flexDirection: 'row' }}>
                <Button size="small">About us</Button>
                <Button size="small">Contact us</Button>
                { user && <Button size="small" onClick={() => menuClickWrapper(signOut)}>Log out</Button>}
              </Menu.Item>
            </div>
          </div>

        </Sidebar>
      </Swipeable>
    </>
  )
}
