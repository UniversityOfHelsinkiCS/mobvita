import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar as SemanticSidebar, Menu, Icon, Dropdown } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { Swipeable } from 'react-swipeable'
import { FormattedMessage } from 'react-intl'
import { localeOptions, capitalize, localeNameToCode, images } from 'Utilities/common'
import { setLocale } from 'Utilities/redux/localeReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { logout, updateLocale } from 'Utilities/redux/userReducer'
import TermsAndConditions from 'Components/StaticContent/TermsAndConditions'
import { Button } from 'react-bootstrap'
import useWindowDimensions from 'Utilities/windowDimensions'
import AboutUs from './StaticContent/AboutUs'
import ContactUs from './StaticContent/ContactUs'
import LearningSettingsModal from './LearningSettingsModal'

export default function Sidebar({ history }) {
  const dispatch = useDispatch()
  const sidebar = useRef()

  const user = useSelector(({ user }) => user.data)
  const open = useSelector(({ sidebar }) => sidebar.open)

  const locale = useSelector(({ locale }) => locale)

  const [localeDropdownOptions, setLocaleDropdownOptions] = useState([])

  const handleLocaleChange = newLocale => {
    dispatch(setLocale(newLocale)) // Sets locale in root reducer...
    if (user) dispatch(updateLocale(newLocale)) // Updates user-object
  }

  useEffect(() => {
    const temp = localeOptions.map(option => ({
      value: option.code,
      text: option.displayName,
      key: option.code,
    }))
    setLocaleDropdownOptions(temp)
  }, [])

  const handleOutSideClick = useCallback(event => {
    if (sidebar.current && !sidebar.current.contains(event.target)) dispatch(sidebarSetOpen(false))
  }, [])

  useEffect(() => {
    if (open) document.addEventListener('mousedown', handleOutSideClick, false)
    else document.removeEventListener('mousedown', handleOutSideClick, false)
  }, [open])

  const signOut = () => {
    dispatch(logout())
    history.push('/')
  }

  const menuClickWrapper = func => {
    if (func) func()

    dispatch(sidebarSetOpen(false))
  }

  const getLearningLanguageFlag = () => {
    const lastUsedLanguage = user.user.last_used_language

    if (lastUsedLanguage) {
      return images[`flag${capitalize(lastUsedLanguage.split('-').join(''))}`]
    }
    return null
  }

  let actualLocale = locale
  if (user && user.user.interfaceLanguage) {
    // If user has logged in, use locale from user object, else use value from localeReducer
    actualLocale = localeNameToCode(user.user.interfaceLanguage)
  }

  const smallWindow = useWindowDimensions().width < 640

  return (
    <>
      <Swipeable
        className="sidebar-swipeable"
        onSwipedRight={() => dispatch(sidebarSetOpen(true))}
        onSwipedLeft={() => dispatch(sidebarSetOpen(false))}
        trackMouse
      >
        <SemanticSidebar as={Menu} animation="push" icon="labeled" vertical visible={open}>
          <div className="sidebar-content" ref={sidebar}>
            <div style={{ padding: '0.5em 1em 0em 0.5em', display: 'flex' }}>
              <Icon
                name="bars"
                size="big"
                onClick={() => menuClickWrapper()}
                className="sidebar-hamburger"
                style={{ position: 'fixed', paddingTop: 0 }}
              />
              <div
                style={{
                  padding: '2.5em 1.5em 1em 1.5em',
                  display: 'flex',
                  flexDirection: 'column',
                  marginRight: 'auto',
                  marginLeft: 'auto',
                }}
              >
                <Link to="/home" onClick={() => menuClickWrapper()}>
                  <img
                    style={{ width: '15em', margin: '0 auto' }}
                    src={images.logo}
                    alt="revitaLogo"
                  />
                </Link>
              </div>
              {user && (
                <button
                  type="button"
                  data-cy="logout"
                  onClick={() => menuClickWrapper(signOut)}
                  className="logout-button"
                >
                  <span className="padding-right-1">
                    <FormattedMessage
                      id={user.user.email === 'anonymous_email' ? 'Login' : 'sign-out'}
                    />
                  </span>
                  <Icon name="sign out" />
                </button>
              )}
            </div>
            {!smallWindow && (
              <a className="padding-bottom-1" href="https://revita-old.cs.helsinki.fi/">
                <i>
                  <FormattedMessage id="take-me-to-old-revita" /> ⇒
                </i>
              </a>
            )}

            {user && (
              <>
                {user.user.email === 'anonymous_email' && (
                  <Menu.Item>
                    <div style={{ padding: '1em 0em' }}>
                      <Link onClick={() => menuClickWrapper()} to="/register">
                        <Button block variant="primary">
                          <FormattedMessage id="register-to-save-your-progress" />
                        </Button>
                      </Link>
                    </div>
                  </Menu.Item>
                )}

                <Menu.Item>
                  <Link to="/learningLanguage" onClick={() => menuClickWrapper()}>
                    <Button variant="primary" block>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-around',
                          alignItems: 'center',
                        }}
                      >
                        <span>
                          <FormattedMessage id="Learning-language" />
                        </span>
                        {user && user.user.last_used_language && (
                          <img
                            style={{
                              height: '1.8em',
                              position: 'absolute',
                              left: '2em',
                              border: '1px solid black',
                            }}
                            src={getLearningLanguageFlag()}
                            alt="learningLanguageFlag"
                          />
                        )}
                      </div>
                    </Button>
                  </Link>

                  <>
                    <LearningSettingsModal
                      trigger={
                        <Button
                          onClick={() => menuClickWrapper()}
                          variant="secondary"
                          block
                          style={{ marginTop: '0.5em' }}
                        >
                          <FormattedMessage id="learning-settings" />
                        </Button>
                      }
                    />
                    <Link to="/profile/progress">
                      <Button
                        data-cy="settings-link"
                        variant="secondary"
                        style={{ marginTop: '0.5em' }}
                        onClick={() => menuClickWrapper()}
                        block
                      >
                        <FormattedMessage id="Profile" />
                      </Button>
                    </Link>
                  </>

                  <Link to="/groups">
                    <Button
                      data-cy="groups-link"
                      variant="secondary"
                      style={{ marginTop: '0.5em' }}
                      onClick={() => menuClickWrapper()}
                      block
                    >
                      <FormattedMessage id="Groups" />
                    </Button>
                  </Link>
                </Menu.Item>
              </>
            )}

            <Menu.Item>
              <div style={{ textAlign: 'left', paddingBottom: '3px' }}>
                <FormattedMessage id="interface-language" />
              </div>
              <Dropdown
                fluid
                placeholder="Choose interface language..."
                value={actualLocale}
                options={localeDropdownOptions}
                selection
                onChange={(e, data) => handleLocaleChange(data.value)}
                data-cy="ui-lang-select"
                style={{ color: '#777' }}
              />
            </Menu.Item>
            {user && !smallWindow && (
              <div style={{ fontSize: '20px', color: '#777' }}>{`${user.user.username}`}</div>
            )}

            <div style={{ marginTop: 'auto', color: 'slateGrey' }}>
              <Menu.Item
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <AboutUs
                  trigger={
                    <Button
                      onClick={() => menuClickWrapper()}
                      data-cy="about-button"
                      variant="secondary"
                      style={{ flexBasis: '50%', marginRight: '0.5em' }}
                    >
                      <FormattedMessage id="About" />
                    </Button>
                  }
                />
                <ContactUs
                  trigger={
                    <Button
                      variant="secondary"
                      onClick={() => menuClickWrapper()}
                      style={{ flexBasis: '50%', marginRight: '0.5em' }}
                    >
                      <FormattedMessage id="Contact" />
                    </Button>
                  }
                />
                <Button
                  variant="secondary"
                  style={{
                    flexBasis: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onClick={() => menuClickWrapper()}
                  as={Link}
                  to="/help"
                >
                  <FormattedMessage id="Help" />
                </Button>
              </Menu.Item>
              <TermsAndConditions
                trigger={
                  <Button data-cy="tc-button" onClick={() => menuClickWrapper()} variant="link">
                    {' '}
                    Terms and Conditions, Privacy Policy{' '}
                  </Button>
                }
              />
              {/* eslint-disable no-undef */}
              <div>{`Built: ${__VERSION__}`}</div>
              <div>{`${__COMMIT__}`}</div>
            </div>
          </div>
        </SemanticSidebar>
      </Swipeable>
    </>
  )
}
