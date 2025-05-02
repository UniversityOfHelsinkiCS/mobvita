import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { Navbar, Nav, NavDropdown, NavItem, Button } from 'react-bootstrap'
import Headroom from 'react-headroom'
import { Icon, Label, Popup, Checkbox } from 'semantic-ui-react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { 
  logout, 
  getLatestIRTScore,
  calculateIRTScore, 
  getSelf, 
  setIrtDummyScore, 
  teacherSwitchView } from 'Utilities/redux/userReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { getMetadata } from 'Utilities/redux/metadataReducer'
import { getPracticeHistory } from 'Utilities/redux/practiceHistoryReducer'
import {
  hideIcon,
  openEncouragement,
  hideFCIcon,
  openFCEncouragement,
  showIcon,
  closeEncouragement,
  closeFCEncouragement,
} from 'Utilities/redux/encouragementsReducer'
import {
  startAnonymousProgressTour,
  startLessonsTour,
  startLibraryTour,
  startProgressTour,
  startPracticeTour,
} from 'Utilities/redux/tourReducer'
import { getNews } from 'Utilities/redux/newsReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import {
  hiddenFeatures,
  capitalize,
  images,
  learningLanguageSelector,
  getBackgroundColor,
  supportedLearningLanguages,
  getHelpLink
} from 'Utilities/common'
import { Offline } from 'react-detect-offline'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { setAnnotationsVisibility } from 'Utilities/redux/annotationsReducer'

import TermsAndConditions from 'Components/StaticContent/TermsAndConditions'
import ContactUs from './StaticContent/ContactUs'
import Tour from './Tour'

const NavbarIcon = ({ imgSrc, altText, extraClass }) => {
  return (
    <img
      className={extraClass ?? ''}
      src={imgSrc}
      alt={altText}
      style={{ width: '21px', height: '21px' }}
    />
  )
}

const NewsWebSite = "https://revitaai.github.io/faq-LEARNER-TOC.html"


export default function NavBar() {
  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const {
    irtCalculationPending,
    pending: userPending,
    irt_dummy_score,
  } = useSelector(({ user }) => user)
  const { numUnreadNews } = useSelector(({ metadata }) => metadata)
  const { sessionId, answersPending } = useSelector(({ snippets }) => snippets)
  const { show, open: encOpen, fcShow, fcOpen } = useSelector(({ encouragement }) => encouragement)
  const { focused: story, pending: storyPending } = useSelector(({ stories }) => stories)

  const open = useSelector(({ sidebar }) => sidebar.open)
  const storyLanguage = (storyPending == false) & (story != undefined) ? story.language : undefined
  const learningLanguage = useSelector(learningLanguageSelector)
  const { locale } = useSelector(({ locale }) => locale)
  const dispatch = useDispatch()
  const history = useHistory()
  const smallWindow = useWindowDimensions().width < 700
  const intl = useIntl()
  const handleEloClick = () => {
    history.push('/profile/progress')
  }
  const isTeacher = user?.user.is_teacher
  const teacherView = user?.teacherView
  const check = history.location.pathname
  const isMajorLanguage = supportedLearningLanguages?.major.includes(
    learningLanguage?.toLowerCase()
  )

  const irt_support_languages = ['Russian', 'Finnish']

  const showStoryElo = history.location.pathname.includes('practice')
  const showFlashcardElo = hiddenFeatures && history.location.pathname.includes('flashcards')
  const showTeacherViewSwitch = !history.location.pathname.includes('groups/teacher') // && !history.location.pathname.includes('profile')
  const hasChosenLearningLanguage = user?.user?.last_used_language !== null

  const practiceHistory = useSelector(state => state.practiceHistory)
  const { flashcardHistory, irtExerciseHistory, eloExerciseHistory } = practiceHistory
  const [helpLink, setHelpLink] = useState(null)

  const signOut = () => {
    dispatch(logout())
    history.push('/')
  }
  const tourOngoing = useSelector(state => state.tour.run)
  const showProfileDropdown = useSelector(state => state.dropdown.showProfileDropdown)
  const profileDropdownRef = useRef()

  const handleProfileButtonCLick = () => {
    if (showProfileDropdown) {
      dispatch({ type: 'CLOSE_PROFILE_DROPDOWN' })
    } else {
      dispatch({ type: 'SHOW_PROFILE_DROPDOWN' })
    }
  }
  const handleTourStart = () => {
    if (history.location.pathname.includes('profile')) {
      if (!history.location.pathname.includes('progress')) {
        history.push('/profile/progress')
      }
      dispatch({ type: 'SHOW_PROFILE_DROPDOWN' })
      if (user.user.email === 'anonymous_email') {
        dispatch(startAnonymousProgressTour())
      } else {
        dispatch(startProgressTour())
      }
    } else if (history.location.pathname.includes('lessons')) {
      dispatch(startLessonsTour())
    } else if (history.location.pathname.includes('library')) {
      dispatch(startLibraryTour())
    } else if (history.location.pathname.includes('preview')) {
      dispatch(startPracticeTour())
    } else if (history.location.pathname.includes('/practice')) {
      dispatch({ type: 'PRACTICE_TOUR_ALTERNATIVE' })
    } else {
      dispatch({ type: 'TOUR_RESTART' })
    }
  }

  const handleNewsClick = async () => {
    await dispatch(getNews())
    await dispatch(getMetadata(learningLanguage))
  }

  const getLearningLanguageFlag = () => {
    const lastUsedLanguage = user.user.last_used_language

    if (lastUsedLanguage) {
      return images[`flag${capitalize(lastUsedLanguage.toLowerCase().split('-').join(''))}`]
    }
    return null
  }

  const confirmNewsClick = (event, url) => {
    const confirmationMessage = `${intl.formatMessage({ id: 'news-redirection-message' })}: ${url}`
    if (window.confirm(confirmationMessage)) {
      return true
    }
    event.preventDefault()
  }

  useEffect(() => {
    dispatch(setIrtDummyScore(undefined))
    dispatch(getLatestIRTScore(learningLanguage))
  }, [sessionId])

  useEffect(() => {
    if (answersPending == false) {
      dispatch(setIrtDummyScore(undefined))
      dispatch(calculateIRTScore(learningLanguage))
    }
  }, [answersPending])

  useEffect(() => {
    if (!irtCalculationPending) dispatch(getSelf())
  }, [irtCalculationPending])

  useEffect(() => {
    if (!userPending) {
      if (irt_dummy_score == undefined) {
        const irtScore =
          irtExerciseHistory && irtExerciseHistory.length > 0
            ? irtExerciseHistory[irtExerciseHistory.length - 1].score
            : undefined
        dispatch(setIrtDummyScore(irtScore))
      }
      setHelpLink(getHelpLink(locale, isTeacher, learningLanguage))
    }
  }, [user])

  useEffect(() => {
    dispatch(getMetadata(learningLanguage))
    setHelpLink(getHelpLink(locale, isTeacher, learningLanguage))
  }, [learningLanguage])

  useEffect(() => {
    const date_now = moment().toDate()
    const start_query_date = moment('2021-01-01').toDate()
    dispatch(getPracticeHistory(start_query_date, date_now))
  }, [])


  

  const irt_score =
    irtExerciseHistory && irtExerciseHistory.length > 0
      ? irtExerciseHistory[irtExerciseHistory.length - 1].score
      : 0

  const elo_score =
    eloExerciseHistory && eloExerciseHistory.length > 0
      ? eloExerciseHistory[eloExerciseHistory.length - 1].score
      : 0

  const flashcardElo =
    user && flashcardHistory && flashcardHistory.length > 0
      ? flashcardHistory[flashcardHistory.length - 1].score
      : 0

  const get_student_ability_score_component = () => {
    if (storyLanguage == undefined) {
      return <div />
    }
    let ability_score = elo_score
    let grammar_score_type = 'elo'
    if (irt_support_languages.includes(storyLanguage)) {
      ability_score = irtCalculationPending
        ? '...'
        : irt_dummy_score != undefined
        ? Math.round(irt_dummy_score * 10) / 10
        : '...'
      grammar_score_type = 'irt'
    }
    return (
      <Popup
        position="top center"
        content={<FormattedHTMLMessage id={`explanations-popup-story-${grammar_score_type}`} />}
        trigger={
          <div className="navbar-basic-item">
            <Icon name="star outline" style={{ margin: 0, width: '16px' }} />
            {ability_score}
          </div>
        }
      />
    )
  }

  const navBarStyle = smallWindow ? {} : { position: 'fixed', top: 0, width: '100%', zIndex: '100' }

  const blackToWhiteFilter =
    'invert(92%) sepia(94%) saturate(29%) hue-rotate(251deg) brightness(108%) contrast(100%)'

  if (!user) return null

  return (
    <Headroom disableInlineStyles={!smallWindow} style={navBarStyle}>
      <Navbar className={getBackgroundColor()} style={{ paddingLeft: '0.5em' }}>
        <Tour />
        <Icon
          name="bars"
          size="big"
          onClick={() => dispatch(sidebarSetOpen(!open))}
          className="sidebar-hamburger tour-sidebar"
          style={{ color: 'black' }}
          data-cy="hamburger"
        />
        <Navbar.Collapse>
          {/********************************* HAMBURGER *********************************/}
          <Nav className="mr-auto">
            <div className="navbar-container">
              <Link to="/home">
                <Navbar.Brand
                  data-cy="revita-logo"
                  className="navbar-revita-logo tour-start-finish"
                >
                  <img
                    src={images.navbarLogo}
                    alt="revita logo"
                    width="70"
                    style={{
                      filter: 'brightness(0%) sepia(100) saturate(100) hue-rotate(0deg)',
                    }}
                  />
                  {hiddenFeatures && <sup> &beta;</sup>}
                </Navbar.Brand>
              </Link>
            </div>
          </Nav>
          {/********************************* ELO SCORE *********************************/}
          <Nav className="mr-auto">
            <div className="navbar-container">
              <Navbar.Text
                onClick={handleEloClick}
                onKeyDown={() => dispatch(setAnnotationsVisibility(true))}
              >
                { showStoryElo && get_student_ability_score_component() }
                {showFlashcardElo && (
                  <Popup
                    position="top center"
                    // content={intl.formatMessage({ id: 'explanations-popup-flashcard-elo' })}
                    content={
                      <FormattedHTMLMessage
                        id="explanations-popup-flashcard-elo"
                        value={{ score_type: 'ELO' }}
                      />
                    }
                    trigger={
                      <div className="navbar-basic-item">
                        <img src={images.flashcardIcon} alt="three cards" width="16px" />{' '}
                        {flashcardElo}
                      </div>
                    }
                  />
                )}
              </Navbar.Text>
            </div>
          </Nav>
          {/******************************* STUDENT VIEW *******************************/}
          {isTeacher && showTeacherViewSwitch && (
            <Nav>
              <Popup
                content={<FormattedMessage id="teacher-view-explanation" />}
                trigger={
                  <div className='flex space-between'>
                  <Checkbox
                    style={{ marginTop: '0.5em', marginRight: '0.5em' }}
                    toggle
                    label={intl.formatMessage({ id: 'student-view' })}
                    checked={!teacherView}
                    onChange={() => dispatch(teacherSwitchView())}
                  />
                  </div>
                }
                position="bottom center"
              />
            </Nav>
          )}
          {/******************************* PROGRESS *******************************/}
          {(!isTeacher || (isTeacher && !teacherView)) && (
            <Nav>
              <Popup
                content={<FormattedMessage id="click-here-to-see-progress-explanation" />}
                trigger={
                  <Link to="/profile/main" style={{ textDecoration: 'none' }}>
                    <Navbar.Brand className="navbar-level">{user.user.level}</Navbar.Brand>
                  </Link>
                }
                position="top center"
              />
            </Nav>
          )}
          {/******************************* TOUR BUTTON *******************************/}
          <Nav>
            <div className="navbar-container" style={{ width: '90%' }}>
              <Offline className="navbar-basic-item" polling={{ timeout: 20000 }}>
                <Icon name="broken chain" size="large" style={{ color: '#ff944d' }} />
              </Offline>
              {!smallWindow && (
                <Popup
                  position="top center"
                  content={intl.formatMessage({ id: 'click-to-see-TOUR-explanation' })}
                  trigger={
                    <Button className="tour-button" onClick={handleTourStart} disabled={history.location.pathname.includes('lessons/library')}>
                      <Icon name="map signs" size="large" style={{ color: 'black' }} />
                    </Button>
                  }
                />
              )}
            </div>
          </Nav>
          {/******************************* LANGUAGE FLAG *******************************/}
          {!smallWindow &&  user && user.user.last_used_language && (
          <Nav>
            <div className="navbar-container" style={{ width: '90%' }}>
                  <Popup
                    position="bottom right"
                    content={intl.formatMessage({ id: 'click-to-change-learning-language-explanation' })}
                    trigger={
                      <Link to="/learningLanguage">
                        <img
                          className="tour-navbar-learning-language navbar-basic-icon navbar-flag"
                          src={getLearningLanguageFlag()}
                          alt="learningLanguageFlag"
                        />
                      </Link>
                    }
                  />
                  {!isMajorLanguage && (
                    <Popup
                      position="bottom right"
                      content={
                        <FormattedMessage
                          id="beta-language-warning"
                          values={{ language: user.user.last_used_language }}
                        />
                      }
                      trigger={
                          <Label color="red" size="mini"> <span>&beta;</span> </Label>
                      }
                    />
                  )}
            </div>
          </Nav>
          )}
          {/******************************* NEWS BELL *******************************/}
          <Nav>
            <div className="navbar-container" style={{ width: '90%' }}>
              <Popup
                trigger={
                  <a
                    className="navbar-basic-icon"
                    style={{ display: 'table-cell' }}
                    href={NewsWebSite}
                    onClick={event => {
                      confirmNewsClick(
                        event, NewsWebSite
                      )
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span style={{position: 'relative', cursor: 'pointer',}}>
                      <NavbarIcon imgSrc={images.bellIcon} altText="bell icon" />
                      {numUnreadNews > 0 ? (
                        <Label
                          onClick={handleNewsClick}
                          className="navbar-news-label"
                          color="red"
                          size="mini"
                          floating
                        >
                          <span>{numUnreadNews}</span>
                        </Label>
                      ) : null}
                    </span>
                  </a>
                }
                content={
                  <FormattedMessage id="news-bell-info-popup-text" values={{ numUnreadNews }} />
                }
                on="hover"
                position="bottom right"
              />
            </div>
          </Nav>
          <Nav>
            <div className="navbar-container" style={{ width: '90%' }}>
              <Popup
                trigger={
                  <a
                    className="navbar-basic-icon tour-help"
                    style={{ display: 'table-cell' }}
                    href={helpLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span style={{position: 'relative', cursor: 'pointer',}}>
                      <Icon name="help circle" size="large" style={{ color: 'black' }} />
                    </span>
                  </a>
                }
                content={
                  <FormattedMessage id="help" />
                }
                on="hover"
                position="bottom right"
              />
            </div>
          </Nav>
          <Nav>
            <Popup
              trigger={
                <a
                  href="https://revitaai.github.io/SERVER-STATUS.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginRight: '3em', alignSelf: 'center' }}
                >
                  <img
                      src={images.heartbeat}
                      alt="heartbeat icon"
                      style={{ height: '20px' }}
                    />
                </a>
              }
              content={
                <FormattedMessage id="server-status" />
              }
              on="hover"
              position="bottom right"
            />
          </Nav>
          {/******************************* END *******************************/}
        </Navbar.Collapse>
      </Navbar>
    </Headroom>
  )
}
