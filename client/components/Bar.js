import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar, Segment, Menu, Button, Icon, Header, Container, Dropdown } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Swipeable } from 'react-swipeable'
import { FormattedMessage } from 'react-intl'

import { localeOptions, capitalize, localeNameToCode, images } from 'Utilities/common'
import { setLocale } from 'Utilities/redux/localeReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { logout, updateLocale } from 'Utilities/redux/userReducer'
import { resetCurrentSnippet } from 'Utilities/redux/snippetsReducer'
import TermsAndConditions from 'Components/TermsAndConditions'
import AboutUs from './StaticContent/AboutUs'
import ContactUs from './StaticContent/ContactUs'


export default function Bar({ history }) {
  const dispatch = useDispatch()

  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const open = useSelector(({ sidebar }) => sidebar.open)
  const focusedSnippet = useSelector(({ snippets }) => snippets.focused)


  const locale = useSelector(({ locale }) => locale)

  const [localeDropdownOptions, setLocaleDropdownOptions] = useState([])

  const handleLocaleChange = (newLocale) => {
    dispatch(setLocale(newLocale)) // Sets locale in root reducer...
    if (user)dispatch(updateLocale(newLocale)) // Updates user-object
  }


  useEffect(() => {
    if (window.innerWidth >= 1024) {
      dispatch(sidebarSetOpen(true))
    } else {
      dispatch(sidebarSetOpen(false))
    }

    const temp = localeOptions.map(option => ({
      value: option.code,
      text: option.displayName,
      key: option.code,
    }))
    setLocaleDropdownOptions(temp)
  }, [])


  const signOut = () => {
    dispatch(logout())
    history.push('/')
  }

  const menuClickWrapper = (func) => {
    if (func) func()

    if (window.innerWidth <= 1024) {
      dispatch(sidebarSetOpen(false))
    }
  }

  const getLearningLanguageFlag = () => {
    const lastUsedLanguage = (user.user.last_used_language)

    if (lastUsedLanguage) {
      return images[`flag${capitalize(lastUsedLanguage.split('-').join(''))}`]
    }
    return null
  }

  let actualLocale = locale
  if (user && user.user.interfaceLanguage) { // If user has logged in, use locale from user object, else use value from localeReducer
    actualLocale = localeNameToCode(user.user.interfaceLanguage)
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

            <div style={{ padding: '1em', display: 'flex', flexDirection: 'column' }}>
              <Link to="/home" onClick={() => menuClickWrapper()}>
                <Header as="h2">MobVita - alpha</Header>
                <img style={{ width: '6em', margin: '0 auto' }} src={images.revitaLogoTransparent} alt="revitaLogo" />
              </Link>
              {user && user.user.last_used_language && <img style={{ width: '6em', margin: '0 auto' }} src={getLearningLanguageFlag()} alt="learningLanguageFlag" />}

            </div>

            {user && (
              <>
                <Menu.Item>
                  <div style={{ padding: '1em 0em' }}>
                    <div>{user.user.username}</div>
                    <div>{user.user.email}</div>
                    {user.user.email === 'anonymous_email'
                      && <Link onClick={() => menuClickWrapper()} to="/register"><button type="button" className="btn btn-primary btn-block"><FormattedMessage id="register-to-upload-your-own-stories" /></button></Link>}
                  </div>
                </Menu.Item>

                <Menu.Item>


                  <Link to="/learningLanguage" onClick={() => menuClickWrapper()}>
                    <button type="button" className="btn btn-primary btn-block">
                      <FormattedMessage id="Learning-language" />
                    </button>
                  </Link>

                </Menu.Item>
              </>
            )}

            <Menu.Item>
              <FormattedMessage id="interface-language" />
              <Dropdown
                fluid
                placeholder="Choose interface language..."
                value={actualLocale}
                options={localeDropdownOptions}
                selection
                onChange={(e, data) => handleLocaleChange(data.value)}
              />
            </Menu.Item>
            <TermsAndConditions trigger={<button type="button" className="btn btn-link"> Terms and Conditions </button>} />


            <div style={{ marginTop: 'auto' }}>
              <Menu.Item style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <AboutUs trigger={<button type="button" className="btn btn-secondary" style={{ flexBasis: '50%' }}><FormattedMessage id="About" /></button>} />
                <ContactUs trigger={<button type="button" className="btn btn-secondary" style={{ flexBasis: '50%' }}><FormattedMessage id="Contact" /></button>} />
                { user && <button type="button" className="btn btn-secondary" style={{ flexBasis: '50%' }} onClick={() => menuClickWrapper(signOut)}><FormattedMessage id="sign-out" /></button>}
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
