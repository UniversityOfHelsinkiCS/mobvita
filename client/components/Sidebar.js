import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar as SemanticSidebar, Menu, Icon, Dropdown, Segment } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { Swipeable } from 'react-swipeable'
import { FormattedMessage } from 'react-intl'
import { localeOptions, capitalize, localeNameToCode, images, timerExpired } from 'Utilities/common'
import { setLocale } from 'Utilities/redux/localeReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { logout, updateLocale } from 'Utilities/redux/userReducer'
import TermsAndConditions from 'Components/StaticContent/TermsAndConditions'
import { Button } from 'react-bootstrap'
import useWindowDimensions from 'Utilities/windowDimensions'
import ContactUs from './StaticContent/ContactUs'
import LearningSettingsModal from './LearningSettingsModal'
import { hiddenFeatures } from 'Utilities/common'

export default function Sidebar({ history }) {
  const dispatch = useDispatch()
  const sidebar = useRef()
  const user = useSelector(({ user }) => user.data)
  const open = useSelector(({ sidebar }) => sidebar.open)
  const learningLanguage = user?.user?.last_used_language
  const locale = useSelector(({ locale }) => locale)
  const [localeDropdownOptions, setLocaleDropdownOptions] = useState([])

  const isTeacher = user?.user.is_teacher

  const handleLocaleChange = newLocale => {
    dispatch(setLocale(newLocale)) // Sets locale in root reducer...
    if (user) dispatch(updateLocale(newLocale)) // Updates user-object
  }

  const marginTopButton = '8px'

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

  const activityCheckInterval = setInterval(() => {
    const requestStorage = localStorage.getItem('last_request')
    const parsedDate = Date.parse(requestStorage)

    const needsRefreshing = timerExpired(parsedDate, 10)
    if (needsRefreshing) {
      const requestSentAt = new Date()
      window.localStorage.setItem('last_request', requestSentAt)
      history.push('/welcome')
    }
  }, 36_000_000)

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

  const handleTourStart = () => {
    if (history.location.pathname.includes('progress') && hiddenFeatures) {
      dispatch({ type: 'PROGRESS_TOUR_RESTART' })
    } else if (history.location.pathname.includes('library') && hiddenFeatures) {
      dispatch(sidebarSetOpen(false))
      dispatch({ type: 'LIBRARY_TOUR_RESTART' })
    } else {
      dispatch(sidebarSetOpen(false))
      dispatch({ type: 'TOUR_RESTART' })
    }
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
                    style={{ width: '15em', margin: '6px auto' }}
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
                    &nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  <Icon name="sign out" />
                </button>
              )}
            </div>
            {!smallWindow && <a className="padding-bottom-1" />}

            {user && (
              <>
                {user.user.email === 'anonymous_email' && (
                  <Menu.Item>
                    <div style={{ padding: '0.5em 0em' }}>
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
                    <Button variant="primary" block className="tour-learning-language">
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
                              height: '1.7em',
                              position: 'absolute',
                              left: '2em',
                              border: '1px solid black',
                              borderRadius: '6px',
                            }}
                            src={getLearningLanguageFlag()}
                            alt="learningLanguageFlag"
                          />
                        )}
                      </div>
                    </Button>
                  </Link>

                  <>
                    {/* <LearningSettingsModal
                      trigger={
                        <Button
                          onClick={() => menuClickWrapper()}
                          variant="secondary"
                          block
                          style={{ marginTop: marginTopButton }}
                        >
                          <Icon name="settings" /> <FormattedMessage id="learning-settings" />
                        </Button>
                      }
                    /> */}
                    <Link to="/profile/progress">
                      <Button
                        className = 'sidebar-profile-button'
                        data-cy="settings-link"
                        variant="secondary"
                        style={{ marginTop: marginTopButton }}
                        onClick={() => menuClickWrapper()}
                        block
                      >
                        <Icon name="user" /> <FormattedMessage id="Profile" />
                      </Button>
                    </Link>
                    <Link to="/library">
                      <Button
                        className="sidebar-library-button"
                        variant="secondary"
                        style={{ marginTop: marginTopButton }}
                        onClick={() => menuClickWrapper()}
                        block
                      >
                        <Icon name="book" /> <FormattedMessage id="Library" />
                      </Button>
                    </Link>
                    <Link to="/flashcards">
                      <Button
                        variant="secondary"
                        style={{ marginTop: marginTopButton }}
                        onClick={() => menuClickWrapper()}
                        block
                      >
                        <Icon size="small" name="question" bordered />{' '}
                        <FormattedMessage id="Flashcards" />
                      </Button>
                    </Link>
                  </>

                  <Link to={isTeacher ? '/groups/teacher' : '/groups/student'}>
                    <Button
                      data-cy="groups-link"
                      variant="secondary"
                      style={{ marginTop: marginTopButton }}
                      onClick={() => menuClickWrapper()}
                      block
                    >
                      <Icon name="group" /> <FormattedMessage id="groups" />
                    </Button>
                  </Link>
                </Menu.Item>
              </>
            )}

            <Menu.Item>
              <div style={{ textAlign: 'left', marginTop: marginTopButton, paddingBottom: '3px' }}>
                <FormattedMessage id="interface-language" />:
              </div>
              <Dropdown
                fluid
                placeholder="Choose interface language..."
                value={actualLocale}
                options={localeDropdownOptions}
                selection
                onChange={(e, data) => handleLocaleChange(data.value)}
                data-cy="ui-lang-select"
                style={{ color: '#777', marginTop: marginTopButton }}
              />
            </Menu.Item>
            {user && (
              <div style={{ fontSize: '18px', color: '#777' }}>{`${user.user.username}`}</div>
            )}
            <div
              style={{
                marginTop: 'auto',
                color: 'slateGrey',
              }}
            >
              <Menu.Item style={{ paddingBottom: '0px' }}>
                {learningLanguage && (
                  <Button
                    className='tour-mobile-start-button'
                    variant="secondary"
                    block
                    style={{ marginTop: marginTopButton }}
                    onClick={() => handleTourStart()}
                    as={Link}
                  >
                    <Icon name="info circle" /> <FormattedMessage id="start-tour" />
                  </Button>
                )}
                <Button
                  variant="secondary"
                  block
                  style={{ marginTop: marginTopButton }}
                  onClick={() => menuClickWrapper()}
                  as={Link}
                  to="/help"
                >
                  <Icon name="help circle" /> <FormattedMessage id="help" />
                </Button>
              </Menu.Item>
            </div>
            <div style={{ color: 'slateGrey' }}>
              <Menu.Item
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <Button
                  onClick={() => menuClickWrapper()}
                  data-cy="about-button"
                  variant="secondary"
                  href="https://www2.helsinki.fi/en/projects/revita-language-learning-and-ai/about-the-project"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ flexBasis: '50%', marginRight: '0.5em' }}
                >
                  <FormattedMessage id="about" />
                </Button>
                <ContactUs
                  trigger={
                    <Button
                      variant="secondary"
                      onClick={() => menuClickWrapper()}
                      style={{ flexBasis: '50%', marginRight: '0.5em' }}
                    >
                      <FormattedMessage id="contact-us" />
                    </Button>
                  }
                />
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
