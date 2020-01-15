import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar, Segment, Menu, Button, Icon, Header, Container, Dropdown } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Swipeable } from 'react-swipeable'

import { localeOptions } from 'Utilities/common'
import { setLocale } from 'Utilities/redux/localeReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { logout } from 'Utilities/redux/userReducer'
import { resetCurrentSnippet } from 'Utilities/redux/snippetsReducer'
import { images } from 'Utilities/common'
import AboutUs from './StaticContent/AboutUs'
import ContactUs from './StaticContent/ContactUs'


export default function Bar({ history }) {
  const intl = useIntl()
  const dispatch = useDispatch()

  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const locale = useSelector(({ locale }) => locale)
  const open = useSelector(({ sidebar }) => sidebar.open)
  const focusedSnippet = useSelector(({ snippets }) => snippets.focused)

  const [localeDropdownOptions, setLocaleDropdownOptions] = useState([])

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      dispatch(sidebarSetOpen(true))
    } else {
      dispatch(sidebarSetOpen(false))
    }

    const temp = localeOptions.map(option => ({
      value: option.code,
      text: option.name,
      key: option.code,
    }))
    setLocaleDropdownOptions(temp)
  }, [])


  const signOut = () => {
    dispatch(logout())
    history.push('/')
  }
  const chooseLanguage = code => () => dispatch(setLocale(code))


  const menuClickWrapper = (func) => {
    if (func) func()

    if (window.innerWidth <= 1024) {
      dispatch(sidebarSetOpen(false))
    }
  }


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
              <Link to="/home" onClick={() => menuClickWrapper()}>
                <Header as="h2">MobVita - alpha</Header>
                <img style={{ width: '6em', margin: '0 auto' }} src={images.revitaLogoTransparent} alt="revitaLogo" />
              </Link>
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
                  <Button color="teal" fluid as={Link} to="/learningLanguage" onClick={() => menuClickWrapper()}>
                    Change learning language
                  </Button>
                </Menu.Item>
              </>
            )}

            <Menu.Item>
              <Dropdown
                fluid
                placeholder="Change UI-language"
                options={localeDropdownOptions}
                selection
                onChange={(e, data) => dispatch(setLocale(data.value))}
              />
            </Menu.Item>

            <div style={{ marginTop: 'auto' }}>
              <Menu.Item style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                <AboutUs trigger={<Button size="small">About us</Button>} />
                <ContactUs trigger={<Button size="small">Contact us</Button>} />
                { user && <Button size="small" onClick={() => menuClickWrapper(signOut)}>Log out</Button>}

              </Menu.Item>
              {/* eslint-disable no-undef */}
              <div>{`Built at: ${__VERSION__}`}</div>
              <div>{`Commit: ${__COMMIT__}`}</div>

            </div>
          </div>
        </Sidebar>
      </Swipeable>
    </>
  )
}
