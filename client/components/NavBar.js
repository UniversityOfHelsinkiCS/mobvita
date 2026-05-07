import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { Navbar, Nav, Button } from 'react-bootstrap'
import Headroom from 'react-headroom'
import { Tooltip, Badge, FormControlLabel, Switch, Box } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import LinkOffIcon from '@mui/icons-material/LinkOff'
import SignpostIcon from '@mui/icons-material/Signpost'
import HelpOutlineIcon from '@mui/icons-material/HelpOutlined'
import { Link, useNavigate, useLocation} from 'react-router-dom'
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
  startAnonymousProgressTour,
  startLessonsTour,
  startLibraryTour,
  startProgressTour,
  startPracticeTour } from 'Utilities/redux/tourReducer'
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
import { FormattedMessage, useIntl } from 'react-intl';
import { setAnnotationsVisibility } from 'Utilities/redux/annotationsReducer'
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
  const user = useSelector(({ user }) => user.data)
  const {
    irtCalculationPending,
    pending: userPending,
    irt_dummy_score } = useSelector(({ user }) => user)
  const { numUnreadNews } = useSelector(({ metadata }) => metadata)
  const { sessionId, answersPending } = useSelector(({ snippets }) => snippets)
  // const { show, open: encOpen, fcShow, fcOpen } = useSelector(({ encouragement }) => encouragement)
  const { focused: story, pending: storyPending } = useSelector(({ stories }) => stories)

  const open = useSelector(({ sidebar }) => sidebar.open)
  const storyLanguage = (storyPending == false) & (story != undefined) ? story.language : undefined
  const learningLanguage = useSelector(learningLanguageSelector)
  const { locale } = useSelector(({ locale }) => locale)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const smallWindow = useWindowDimensions().width < 700
  const intl = useIntl()
  const handleEloClick = () => {
    navigate('/profile/progress')
  }
  const isTeacher = user?.user.is_teacher
  const teacherView = user?.teacherView
  const check = location.pathname
  const isMajorLanguage = supportedLearningLanguages?.major.includes(
    learningLanguage?.toLowerCase()
  )

  const irt_support_languages = ['Russian', 'Finnish']

  const showStoryElo = location.pathname.includes('practice')
  const showFlashcardElo = hiddenFeatures && location.pathname.includes('flashcards')
  const showTeacherViewSwitch = !location.pathname.includes('groups/teacher') // && !location.pathname.includes('profile')
  const hasChosenLearningLanguage = user?.user?.last_used_language !== null

  const practiceHistory = useSelector(state => state.practiceHistory)
  const { flashcardHistory, irtExerciseHistory, eloExerciseHistory } = practiceHistory
  const [helpLink, setHelpLink] = useState(null)

  const signOut = () => {
    dispatch(logout())
    navigate('/')
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
    if (location.pathname.includes('profile')) {
      if (!location.pathname.includes('progress')) {
        navigate('/profile/progress')
      }
      dispatch({ type: 'SHOW_PROFILE_DROPDOWN' })
      if (user.user.email === 'anonymous_email') {
        dispatch(startAnonymousProgressTour())
      } else {
        dispatch(startProgressTour())
      }
    } else if (location.pathname.includes('lessons')) {
      dispatch(startLessonsTour())
    } else if (location.pathname.includes('library')) {
      dispatch(startLibraryTour())
    } else if (location.pathname.includes('preview')) {
      dispatch(startPracticeTour())
    } else if (location.pathname.includes('/practice')) {
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

  const handleStudentViewSwitch = () => {
    dispatch(teacherSwitchView())
    if (teacherView) {
      dispatch({ type: 'SET_STUDENT_HOME_TOUR_STEPS' })
    } else {
      dispatch({ type: 'SET_TEACHER_HOME_TOUR_STEPS' })
    }
  }

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
      <Tooltip
        placement="top"
        title={<FormattedHTMLMessage id={`explanations-popup-story-${grammar_score_type}`} />}
      >
        <div className="navbar-basic-item">
          <StarBorderIcon style={{ margin: 0, width: '16px', height: '16px' }} />
          {ability_score}
        </div>
      </Tooltip>
    )
  }

  const navBarStyle = smallWindow ? {} : { position: 'fixed', top: 0, width: '100%', zIndex: '100' }

  const blackToWhiteFilter =
    'invert(92%) sepia(94%) saturate(29%) hue-rotate(251deg) brightness(108%) contrast(100%)'

  if (!user) return null

  return (
    <Headroom disableInlineStyles={!smallWindow} style={navBarStyle}>
      <Navbar className={getBackgroundColor()} style={{ padding: '8px 14px 8px 8px' }}>
        <Tour />
        <MenuIcon
          onClick={() => dispatch(sidebarSetOpen(!open))}
          className="sidebar-hamburger tour-sidebar"
          style={{ color: 'black', fontSize: '32px', cursor: 'pointer' }}
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
                      filter: 'brightness(0%) sepia(100) saturate(100) hue-rotate(0deg)' }}
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
                  <Tooltip
                    placement="top"
                    title={
                      <FormattedHTMLMessage
                        id="explanations-popup-flashcard-elo"
                        value={{ score_type: 'ELO' }}
                      />
                    }
                  >
                    <div className="navbar-basic-item">
                      <img src={images.flashcardIcon} alt="three cards" width="16px" />{' '}
                      {flashcardElo}
                    </div>
                  </Tooltip>
                )}
              </Navbar.Text>
            </div>
          </Nav>
          {/******************************* STUDENT VIEW *******************************/}
          {isTeacher && showTeacherViewSwitch && !smallWindow && (
            <Nav>
              <Tooltip title={<FormattedMessage id="teacher-view-explanation" />} placement="bottom">
                <div className='flex space-between'>
                  <FormControlLabel
                    sx={{ mt: 0.5, mr: 0.5 }}
                    control={<Switch checked={!teacherView} onChange={handleStudentViewSwitch} />}
                    label={intl.formatMessage({ id: 'student-view' })}
                  />
                </div>
              </Tooltip>
            </Nav>
          )}
          {/******************************* PROGRESS *******************************/}
          {(!isTeacher || (isTeacher && !teacherView)) && (
            <Nav>
              <Tooltip title={<FormattedMessage id="click-here-to-see-progress-explanation" />} placement="top">
                <Link className="navbar-basic-icon progress-button" to="/profile/main" style={{ textDecoration: 'none' }}>
                  <div className="navbar-level">{user.user.level}</div>
                </Link>
              </Tooltip>
            </Nav>
          )}
          {/******************************* TOUR BUTTON *******************************/}
          <Nav>
            <div className="navbar-container" style={{ width: '90%' }}>
              <Offline className="navbar-basic-item" polling={{ timeout: 20000 }}>
                <LinkOffIcon style={{ color: '#ff944d' }} />
              </Offline>
              {!smallWindow && (
                <Tooltip title={intl.formatMessage({ id: 'click-to-see-TOUR-explanation' })} placement="top">
                  <Button className="tour-button" onClick={handleTourStart}>
                    <SignpostIcon style={{ color: 'black' }} />
                  </Button>
                </Tooltip>
              )}
            </div>
          </Nav>
          {/******************************* LANGUAGE FLAG *******************************/}
          {!smallWindow &&  user && user.user.last_used_language && (
          <Nav>
            <div className="navbar-container" style={{ width: '90%' }}>
                  <Tooltip
                    placement="bottom-end"
                    title={intl.formatMessage({ id: 'click-to-change-learning-language-explanation' })}
                  >
                    <Link to="/learningLanguage">
                      <img
                        className="tour-navbar-learning-language navbar-basic-icon navbar-flag"
                        src={getLearningLanguageFlag()}
                        alt="learningLanguageFlag"
                      />
                    </Link>
                  </Tooltip>
                  {!isMajorLanguage && (
                    <Tooltip
                      placement="bottom-end"
                      title={
                        <FormattedMessage
                          id="beta-language-warning"
                          values={{ language: user.user.last_used_language }}
                        />
                      }
                    >
                      <Box
                        component="span"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#db2828',
                          color: '#fff',
                          fontSize: '0.7rem',
                          borderRadius: '10px',
                          px: 0.75,
                          py: 0.1,
                        }}
                      >
                        <span>&beta;</span>
                      </Box>
                    </Tooltip>
                  )}
            </div>
          </Nav>
          )}
          {/******************************* NEWS BELL *******************************/}
          {!smallWindow && (
            <Nav>
              <div className="navbar-container" style={{ width: '90%' }}>
                <Tooltip
                  placement="bottom-end"
                  title={<FormattedMessage id="news-bell-info-popup-text" values={{ numUnreadNews }} />}
                >
                  <a
                    className="navbar-basic-icon"
                    style={{ display: 'table-cell' }}
                    href={NewsWebSite}
                    onClick={event => {
                      confirmNewsClick(event, NewsWebSite)
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span style={{ position: 'relative', cursor: 'pointer' }}>
                      {numUnreadNews > 0 ? (
                        <Badge badgeContent={numUnreadNews} color="error" onClick={handleNewsClick}>
                          <NavbarIcon imgSrc={images.bellIcon} altText="bell icon" />
                        </Badge>
                      ) : (
                        <NavbarIcon imgSrc={images.bellIcon} altText="bell icon" />
                      )}
                    </span>
                  </a>
                </Tooltip>
              </div>
            </Nav>
          )}
          <Nav>
            <div className="navbar-container" style={{ width: '90%' }}>
              <Tooltip title={<FormattedMessage id="help" />} placement="bottom-end">
                <a
                  className="navbar-basic-icon tour-help"
                  style={{ display: 'table-cell' }}
                  href={helpLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span style={{position: 'relative', cursor: 'pointer' }}>
                    <HelpOutlineIcon style={{ color: 'black' }} />
                  </span>
                </a>
              </Tooltip>
            </div>
          </Nav>
          <Nav>
            <Tooltip title={<FormattedMessage id="server-status" />} placement="bottom-end">
              <a
                className="navbar-basic-icon"
                href="https://revitaai.github.io/SERVER-STATUS.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                    src={images.heartbeat}
                    alt="heartbeat icon"
                    style={{ height: '20px' }}
                  />
              </a>
            </Tooltip>
          </Nav>
          {/******************************* END *******************************/}
        </Navbar.Collapse>
      </Navbar>
    </Headroom>
  )
}
