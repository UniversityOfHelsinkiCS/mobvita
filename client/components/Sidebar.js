import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  Sidebar as SemanticSidebar, 
  Menu, 
  Icon, 
  Dropdown, 
  Segment,
  DropdownItem,
  DropdownMenu,
  Popup,
  Checkbox,
} from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl } from 'react-intl' 
import { Swipeable } from 'react-swipeable'
import { FormattedMessage } from 'react-intl'
import { localeOptions, capitalize, localeNameToCode, images, timerExpired } from 'Utilities/common'
import { setLocale } from 'Utilities/redux/localeReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { logout, updateLocale, teacherSwitchView } from 'Utilities/redux/userReducer'
import {
  startAnonymousProgressTour,
  startLessonsTour,
  startLibraryTour,
  startProgressTour,
  startPracticeTour,
} from 'Utilities/redux/tourReducer'
import TermsAndConditions from 'Components/StaticContent/TermsAndConditions'
import { Button } from 'react-bootstrap'
import useWindowDimensions from 'Utilities/windowDimensions'
import ContactUs from './StaticContent/ContactUs'
import LearningSettingsModal from './LearningSettingsModal'
import PracticeModal from './HomeView/PracticeModal'
import { hiddenFeatures, getHelpLink, cefrNum2Cefr } from 'Utilities/common'

export default function Sidebar({ history }) {
  const dispatch = useDispatch()
  const sidebar = useRef()
  const user = useSelector(({ user }) => user.data)
  // const irtScore = useSelector(({ user }) => user.irt_dummy_score)
  const open = useSelector(({ sidebar }) => sidebar.open)
  const learningLanguage = user?.user?.last_used_language
  const { locale } = useSelector(({ locale }) => locale)
  const { hasTests, hasAdaptiveTests } = useSelector(({ metadata }) => metadata)
  const [localeDropdownOptions, setLocaleDropdownOptions] = useState([])
  const [practiceModalOpen, setPracticeModalOpen] = useState(false)
  const intl = useIntl()
  const isTeacher = user?.user.is_teacher
  const teacherView = user?.teacherView
  const [helpLink, setHelpLink] = useState(null)

  const handleLocaleChange = newLocale => {
    dispatch(setLocale(newLocale)) // Sets locale in root reducer...
    if (user) dispatch(updateLocale(newLocale)) // Updates user-object
  }

  const marginTopButton = '8px'

  useEffect(() => {
    if (user) {
      setHelpLink(getHelpLink(locale, isTeacher, learningLanguage))
    }
  }, [user, learningLanguage])

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

  const handleTourStart = () => {
    if (history.location.pathname.includes('profile')) {
      if (!history.location.pathname.includes('progress')) {
        history.push('/profile/progress')
      }
      if (user.user.email === 'anonymous_email') {
        dispatch(startAnonymousProgressTour())
      } else {
        dispatch(startProgressTour())
      }
    } else if (history.location.pathname.includes('lessons') && hiddenFeatures) {
      dispatch(startLessonsTour())
    } else if (history.location.pathname.includes('library')) {
      dispatch(startLibraryTour())
    } else if (history.location.pathname.includes('preview') && hiddenFeatures) {
      dispatch(sidebarSetOpen(false))
      dispatch(startPracticeTour())
    } else if (history.location.pathname.includes('/practice') && hiddenFeatures) {
      dispatch(sidebarSetOpen(false))
      dispatch({ type: 'PRACTICE_TOUR_ALTERNATIVE' })
    } else {
      dispatch({ type: 'TOUR_RESTART' })
    }
  }

  const handleStudentViewSwitch = () => {
    dispatch(teacherSwitchView())
    if (teacherView) {
      dispatch({ type: 'SET_STUDENT_HOME_TOUR_STEPS' })
    } else {
      dispatch({ type: 'SET_TEACHER_HOME_TOUR_STEPS' })
    }
  }

  let actualLocale = locale
  if (user && user.user.interfaceLanguage) {
    // If user has logged in, use locale from user object, else use value from localeReducer
    actualLocale = localeNameToCode(user.user.interfaceLanguage)
  }

  const smallWindow = useWindowDimensions().width < 640

  

  return (
    <SemanticSidebar
      as={Menu}
      animation="push"
      icon="labeled"
      vertical
      visible={open}
      style={{ width: smallWindow ? '80%' : '350px', zIndex: 1001 }}
    >
      <PracticeModal open={practiceModalOpen} setOpen={setPracticeModalOpen} />
      <div className="sidebar-content" ref={sidebar}>
        <div className="revitaLogo"
             style={{ padding: '0.5em 1em 0em 0.5em', display: 'flex' }}>
          <Icon
            name="bars"
            size="big"
            className="sidebar-hamburger"
            onClick={() => dispatch(sidebarSetOpen(!open))}
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
            <Link to="/home">
              <img
                style={{ width: '100%', margin: '6px auto' }}
                src={images.logo}
                alt="revitaLogo"
              />
            </Link>
          </div>
        </div>
        {!smallWindow && <a className="padding-bottom-1" />}

        {user && (
          <>
            {user.user.email === 'anonymous_email' && (
              <Menu.Item>
                <div style={{ padding: '0.5em 0em' }}>
                  <Link  to="/register">
                    <Button 
                      block 
                      variant="primary"
                      className="sidebar-register-button"
                    >
                      <FormattedMessage id="register-to-save-your-progress" />
                    </Button>
                  </Link>
                </div>
              </Menu.Item>
            )}

            <Menu.Item>
              <>
                <Button
                  className='sidebar-profile-button'
                  // data-cy="practice-now"
                  variant="secondary"
                  style={{ 
                    marginTop: marginTopButton, 
                    color: 'darkslateblue', 
                    borderColor: 'slateblue', 
                    fontSize: 'larger', 
                    fontWeight: 'bold'
                  }}
                  onClick={() => setPracticeModalOpen(true)}
                  block
                >
                  <Icon name="flag checkered" OLD="user" />
                  <FormattedMessage id="practice-now" />
                </Button>
                <Link to="/library">
                  <Button
                    className="sidebar-library-button"
                    variant="secondary"
                    style={{ 
                    marginTop: marginTopButton, 
                    color: 'darkslateblue', 
                    borderColor: 'slateblue', 
                    fontSize: 'larger', 
                    fontWeight: 'bold'
                  }}
                    
                    block
                  >
                    <Icon name="book" /> <FormattedMessage id="Library" />
                  </Button>
                </Link>
                <Link to="/lessons/library">
                  <Button
                    variant="secondary"
                    style={{ 
                    marginTop: marginTopButton, 
                    color: 'darkslateblue', 
                    borderColor: 'slateblue', 
                    fontSize: 'larger', 
                    fontWeight: 'bold'
                  }}
                    
                    block
                  >
                    <Icon oldsize="small" old="calendar check outline / bordered"
                          name="file alternate"/>
                      {' '}
                    <FormattedMessage id="Lessons" />
                  </Button>
                </Link>
                <Link to="/flashcards/fillin">
                  <Button
                    variant="secondary"
                    style={{ 
                    marginTop: marginTopButton, 
                    color: 'darkslateblue', 
                    borderColor: 'slateblue', 
                    fontSize: 'larger', 
                    fontWeight: 'bold'
                  }}
                    block
                  >
                    <Icon oldsize="small / bordered" name="clone outline" OLD="question" />{' '}
                    <FormattedMessage id="Flashcards" />
                  </Button>
                </Link>
                {hasAdaptiveTests && (<Link to="/adaptive-test">
                  <Button
                    variant="secondary"
                    style={{ 
                    marginTop: marginTopButton, 
                    color: 'darkslateblue', 
                    borderColor: 'slateblue', 
                    fontSize: 'larger', 
                    fontWeight: 'bold'
                  }}
                    block
                  >
                    <Icon OLDsize="small / bordered" name="trophy" />{' '}
                    <FormattedMessage id="adaptive-test" />
                  </Button>
                </Link>)}
                {hiddenFeatures && (
                  <>
                    <Link to="/test-construction">
                      <Button 
                        variant="secondary"
                        style={{ 
                    marginTop: marginTopButton, 
                    color: 'darkslateblue', 
                    borderColor: 'slateblue', 
                    fontSize: 'larger', 
                    fontWeight: 'bold'
                  }}
                        block
                      >
                        Grammar check
                      </Button>
                    </Link>
                    <Link to="/test-debug">
                      <Button 
                        variant="secondary"
                        style={{ 
                    marginTop: marginTopButton, 
                    color: 'darkslateblue', 
                    borderColor: 'slateblue', 
                    fontSize: 'larger', 
                    fontWeight: 'bold'
                  }}
                        block
                      >
                        Feedback check
                      </Button>
                    </Link>
                  </>
                )}


              </>

              
            </Menu.Item>
          </>
        )}
        {user && (
          <Popup
            content={<FormattedMessage id="Sidebar-user-score-EXPLANATION" />}
            trigger={
              <Link 
                to="/profile/progress" 
                style={{ fontSize: '18px', color: '#777', textDecoration: 'none', marginTop: '50px' }}
              > 
                <div style={{ width: '100%', textAlign: 'center' }}>{`${user.user.username}`}</div>
                <div style={{ width: '100%', textAlign: 'center', color: 'black' }}>{`${cefrNum2Cefr(user.user.current_cefr)}`}</div>
              </Link>
            }
          />
          
        )}
        <div
          style={{
            marginTop: 'auto',
            color: 'slateGrey',
          }}
        >
          <Menu.Item style={{ paddingBottom: '0px' }}>
          <Link to="/profile/settings">
            <Button
              variant="secondary"
              style={{ 
                marginBottom: marginTopButton, 
                color: 'darkslateblue', 
                borderColor: 'slateblue',
                fontSize: 'larger',
                fontWeight: 'bold'
              }}
              block
              data-cy="navbar-settings-button"
            >
              <Icon OLDsize="small / bordered" name="settings" />{' '}
              <FormattedMessage id="Settings" />
            </Button>
          </Link>
            {isTeacher && smallWindow && (
              <Popup
                content={<FormattedMessage id="teacher-view-explanation" />}
                trigger={
                  <div>
                    <Checkbox
                      style={{ marginTop: '0.5em', marginRight: '0.5em' }}
                      toggle
                      label={intl.formatMessage({ id: 'student-view' })}
                      checked={!teacherView}
                      onChange={handleStudentViewSwitch}
                    />
                  </div>
                }
                position="bottom center"
              />
            )}
          <Dropdown item direction={smallWindow ? "left" : "right"} style={{color: 'darkslateblue', 
                                 borderColor: 'slateblue',
                                 fontSize: 'larger',
                                 fontWeight: 'bold'}}
                    text={intl.formatMessage({id: 'Menu-more'})} >
            <DropdownMenu style={{minHeight: '16em'}}>
              <DropdownItem text={intl.formatMessage({id: 'groups'})} icon='group' as={Link} to={isTeacher ? '/groups/teacher' : '/groups/student'}/>
              <DropdownItem as={Link} to="/profile/main" text={intl.formatMessage({id: 'Profile'})} icon="user outline" />
              {learningLanguage && (
                <DropdownItem
                  className='tour-mobile-start-button'
                  onClick={() => handleTourStart()}
                  text={intl.formatMessage({id: 'start-tour'})} icon='map signs'
                  disabled={history.location.pathname.includes('lessons/library')}
                />
              )}
              {/* <DropdownItem as={Link} to={helpLink} text={intl.formatMessage({id: 'help'})} icon='help circle' /> */}
              <DropdownItem
                data-cy="about-button"
                as={Link}
                to={{pathname: "https://revitaai.github.io/"}}
                target="_blank"
                rel="noopener noreferrer"
                text={intl.formatMessage({id: 'about'})}
                icon='info circle'
              />
              
              <ContactUs trigger={
                <DropdownItem
                  text={intl.formatMessage({id: 'contact-us'})}
                  icon='envelope outline'
                />
              } />
              
              <DropdownItem 
                data-cy="logout-button" 
                onClick={signOut} 
                icon='sign out alternate' 
                text={intl.formatMessage({id: 'sign-out'})}
              />
            </DropdownMenu>
          </Dropdown>
           
            
          </Menu.Item>
        </div>
        <div style={{ color: 'slateGrey' }}>
          {/* <TermsAndConditions
            trigger={
              <Button data-cy="tc-button"  variant="link">
                {' '}
                Terms and Conditions, Privacy Policy{' '}
              </Button>
            }
          /> */}
          {/* eslint-disable no-undef */}
          <div>{`Built: ${__VERSION__}`}</div>
          <div>{`${__COMMIT__}`}</div>
        </div>
      </div>
    </SemanticSidebar>
  )
}
