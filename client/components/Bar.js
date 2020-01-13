import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar, Segment, Menu, Dropdown, Icon, Button, Header, Container } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Swipeable } from 'react-swipeable'

import { localeOptions } from 'Utilities/common'
import { setLocale } from 'Utilities/redux/localeReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { logout } from 'Utilities/redux/userReducer'
import { resetCurrentSnippet } from 'Utilities/redux/snippetsReducer'
import { images, getLearningLanguage } from 'Utilities/common'
import AboutUs from './StaticContent/AboutUs'
import ContactUs from './StaticContent/ContactUs'


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
    const currentLanguge = getLearningLanguage()
    setLanguage(currentLanguge)
  }, [window.location.pathname])


  return (
    <>
      <Icon
        name="bars"
        size="big"
        onClick={() => dispatch(sidebarSetOpen(!open))}
        className="sidebar-hamburger"
      />
      <Swipeable
        className="sidebar-swipeable"
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

          <div className="sidebar-content">

            <div style={{ padding: '1em' }}>
              <Header as="h2">MobVita - alpha</Header>
              <img style={{ width: '6em', margin: '0 auto' }} src={images.revitaLogoTransparent} alt="revitaLogo" />
            </div>

            {user && (
              <>
                <Menu.Item>
                  <div style={{ padding: '1em' }}>
                    <div>{user.user.username}</div>
                    <div>{user.user.email}</div>
                    <div>Streak data unavailable</div>
                  </div>
                </Menu.Item>

                <Menu.Item>
                  <Button color="teal" fluid as={Link} to="/" onClick={() => menuClickWrapper()}>
                    Change learning language
                  </Button>
                </Menu.Item>
              </>
            )}

            <div style={{ marginTop: 'auto' }}>
              <Menu.Item style={{ display: 'flex', flexDirection: 'row' }}>
                <AboutUs trigger={<Button size="small">About us</Button>} />
                <ContactUs trigger={<Button size="small">Contact us</Button>} />
                { user && <Button size="small" onClick={() => menuClickWrapper(signOut)}>Log out</Button>}

              </Menu.Item>
              {/* eslint-disable no-undef */}
              {<span>{`Built at: ${__VERSION__}`}</span>}

            </div>
          </div>


        </Sidebar>
      </Swipeable>
    </>
  )
}
