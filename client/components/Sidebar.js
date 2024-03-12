import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  Sidebar as SemanticSidebar, 
  Menu, 
  Icon, 
  Dropdown, 
  Segment,
  DropdownItem,
  DropdownMenu
} from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl } from 'react-intl' 
import { Swipeable } from 'react-swipeable'
import { FormattedMessage } from 'react-intl'
import { localeOptions, capitalize, localeNameToCode, images, timerExpired } from 'Utilities/common'
import { setLocale } from 'Utilities/redux/localeReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { logout, updateLocale } from 'Utilities/redux/userReducer'
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
import { hiddenFeatures } from 'Utilities/common'

export default function Sidebar({ history }) {
  const dispatch = useDispatch()
  const sidebar = useRef()
  const user = useSelector(({ user }) => user.data)
  // const irtScore = useSelector(({ user }) => user.irt_dummy_score)
  const open = useSelector(({ sidebar }) => sidebar.open)
  const learningLanguage = user?.user?.last_used_language
  const locale = useSelector(({ locale }) => locale)
  const [localeDropdownOptions, setLocaleDropdownOptions] = useState([])
  const [practiceModalOpen, setPracticeModalOpen] = useState(false)
  const intl = useIntl()
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

  let actualLocale = locale
  if (user && user.user.interfaceLanguage) {
    // If user has logged in, use locale from user object, else use value from localeReducer
    actualLocale = localeNameToCode(user.user.interfaceLanguage)
  }

  const smallWindow = useWindowDimensions().width < 640

  const cefr_num2cefr_str = num => {
    if (num == null || num === undefined) return '?'
    if (num < 1) return 'Pre-A1';
    if (num > 13) return 'C2+';
  
    const levels = [
      'Pre-A1', 
      'A1',
      'A1/A2',
      'A2',
      'A2/B1',
      'B1',
      'B1/B2',
      'B2',
      'B2/C1',
      'C1',
      'C1/C2',
      'C2',
      'C2+'
    ];
  
    return levels[Math.round(num)];
  };

  return (
    <SemanticSidebar as={Menu} animation="push" icon="labeled" vertical visible={open} >
      <PracticeModal open={practiceModalOpen} setOpen={setPracticeModalOpen} />
      <div className="sidebar-content" ref={sidebar}>
        <div style={{ padding: '0.5em 1em 0em 0.5em', display: 'flex' }}>
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
                style={{ width: '15em', margin: '6px auto' }}
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
                  style={{ marginTop: marginTopButton }}
                  onClick={() => setPracticeModalOpen(true)}
                  block
                >
                  <Icon name="user" /> <FormattedMessage id="practice-now" />
                </Button>
                <Link to="/library">
                  <Button
                    className="sidebar-library-button"
                    variant="secondary"
                    style={{ marginTop: marginTopButton }}
                    
                    block
                  >
                    <Icon name="book" /> <FormattedMessage id="Library" />
                  </Button>
                </Link>
                <Link to="/lessons/library">
                  <Button
                    variant="secondary"
                    style={{ marginTop: marginTopButton }}
                    
                    block
                  >
                    <Icon size="small" name="calendar check outline" bordered />{' '}
                    <FormattedMessage id="Lessons" />
                  </Button>
                </Link>
                <Link to="/flashcards">
                  <Button
                    variant="secondary"
                    style={{ marginTop: marginTopButton }}
                    block
                  >
                    <Icon size="small" name="question" bordered />{' '}
                    <FormattedMessage id="Flashcards" />
                  </Button>
                </Link>

                {hiddenFeatures && (
                  <>
                    <Link to="/test-construction">
                      <Button 
                        variant="secondary"
                        style={{ marginTop: marginTopButton }}
                        block
                      >
                        Grammar check
                      </Button>
                    </Link>
                    <Link to="/test-debug">
                      <Button 
                        variant="secondary"
                        style={{ marginTop: marginTopButton }}
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
          <div style={{ fontSize: '18px', color: '#777', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ paddingRight: '5px', width: '50%', textAlign: 'right' }}>{`${user.user.username}`}</div>
            <div style={{ paddingLeft: '5px', width: '50%', textAlign: 'left' }}>{`${cefr_num2cefr_str(user.user.current_cerf)}`}</div>
          </div>
        )}
        <div
          style={{
            marginTop: 'auto',
            color: 'slateGrey',
          }}
        >
          <Menu.Item style={{ paddingBottom: '0px' }}>
          <Dropdown item text='More'>
            <DropdownMenu style={{minHeight: '18.5em'}}>
              <DropdownItem text={intl.formatMessage({id: 'groups'})} icon='group' as={Link} to={isTeacher ? '/groups/teacher' : '/groups/student'}/>
              <DropdownItem 
                text={intl.formatMessage({id: 'Settings'})} 
                icon='settings' 
                as={Link} 
                to={'/profile/settings'}
                data-cy="navbar-settings-button"
              />
              <DropdownItem as={Link} to="/profile/main" text={intl.formatMessage({id: 'Profile'})} icon="user outline" />
              {learningLanguage && (
                <DropdownItem
                  className='tour-mobile-start-button'
                  onClick={() => handleTourStart()}
                  text={intl.formatMessage({id: 'start-tour'})} icon='info circle'
                />
              )}
              <DropdownItem as={Link} to="/help" text={intl.formatMessage({id: 'help'})} icon='help circle' />
              <DropdownItem
                data-cy="about-button"
                as={Link}
                to={{pathname: "https://www2.helsinki.fi/en/projects/revita-language-learning-and-ai/about-the-project"}}
                target="_blank"
                rel="noopener noreferrer"
                text={intl.formatMessage({id: 'about'})}
              />
              <DropdownItem>
                <ContactUs trigger={<a><FormattedMessage id="contact-us" /></a>} />
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
           
            
          </Menu.Item>
        </div>
        <div style={{ color: 'slateGrey' }}>
          <TermsAndConditions
            trigger={
              <Button data-cy="tc-button"  variant="link">
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
  )
}
