import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import React, { useEffect, useRef, useState } from 'react'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import AppMenu, { AppMenuItem } from 'Components/ui/AppMenu'
import { MenuRow } from 'Components/ui/menuRow'
import Headroom from 'react-headroom'
import { Switch, Box } from '@mui/material'
import { styled } from '@mui/material/styles'
import CustomTooltip from 'Components/CustomTooltip'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CircleIcon from '@mui/icons-material/Circle'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import GroupIcon from '@mui/icons-material/Group'
import SettingsIcon from '@mui/icons-material/Settings'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  logout,
  getLatestIRTScore,
  calculateIRTScore,
  getSelf,
  setIrtDummyScore,
  teacherSwitchView,
} from 'Utilities/redux/userReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { getMetadata } from 'Utilities/redux/metadataReducer'
import { getPracticeHistory } from 'Utilities/redux/practiceHistoryReducer'
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
  supportedLearningLanguages,
  getHelpLink,
} from 'Utilities/common'
import { colors, font } from 'Assets/mui_theme/designTokens'
import { Detector } from 'react-detect-offline'
import { FormattedMessage, useIntl } from 'react-intl'
import { setAnnotationsVisibility } from 'Utilities/redux/annotationsReducer'
import LanguageSelectDialog from './LanguageSelectView/LanguageSelectDialog'
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

// Layout wrappers that replace react-bootstrap's <Navbar.Collapse> / <Nav>. All the visual styling
// still comes from the app's own `.navbar*` classes in custom.scss — these only reproduce the flex
// plumbing bootstrap used to provide (the collapse grows to fill the row; each group is a flex row).
const NavCollapse = styled('div')({
  display: 'flex',
  flexGrow: 1,
  flexBasis: 'auto', // matches bootstrap's `.navbar-expand .navbar-collapse` (don't force a 100% wrap)
  alignItems: 'center',
})

const NavGroup = styled('div')({
  display: 'flex',
  alignItems: 'center',
})

const NewsWebSite = 'https://revitaai.github.io/faq-LEARNER-TOC.html'

// Initials for the profile avatar, e.g. "roman.yangarber" / "Roman Yangarber" → "RY".
const getInitials = name => {
  if (!name) return '?'
  const parts = name
    .trim()
    .split(/[\s._-]+/)
    .filter(Boolean)
  const letters = parts
    .slice(0, 2)
    .map(part => part[0])
    .join('')
  return (letters || name.slice(0, 2)).toUpperCase()
}

export default function NavBar() {
  const user = useSelector(({ user }) => user.data)
  const {
    irtCalculationPending,
    pending: userPending,
    irt_dummy_score,
  } = useSelector(({ user }) => user)
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
    learningLanguage?.toLowerCase(),
  )

  const irt_support_languages = ['Russian', 'Finnish']

  const showStoryElo = location.pathname.includes('practice')
  const showFlashcardElo = hiddenFeatures && location.pathname.includes('flashcards')
  const showTeacherViewSwitch = !location.pathname.includes('groups/teacher') // && !location.pathname.includes('profile')
  const hasChosenLearningLanguage = user?.user?.last_used_language !== null

  const practiceHistory = useSelector(state => state.practiceHistory)
  const { flashcardHistory, irtExerciseHistory, eloExerciseHistory } = practiceHistory
  const [helpLink, setHelpLink] = useState(null)
  const [darkVisual, setDarkVisual] = useState(false) // Dark Theme toggle — visual only for now
  const [langDialogOpen, setLangDialogOpen] = useState(false)

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
    } else if (location.pathname.includes('preview') || location.pathname.includes('review')) {
      dispatch(startPracticeTour())
    } else if (location.pathname.includes('/practice')) {
      dispatch({ type: 'PRACTICE_TOUR_ALTERNATIVE' })
    } else {
      dispatch({ type: 'TOUR_RESTART' })
    }
  }

  const handleNewsClick = async () => {
    await Promise.all([dispatch(getNews()), dispatch(getMetadata(learningLanguage))])
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
      <CustomTooltip
        permanent
        placement="top"
        title={<FormattedHTMLMessage id={`explanations-popup-story-${grammar_score_type}`} />}
      >
        <div className="navbar-basic-item">
          <StarBorderIcon style={{ margin: 0, width: '16px', height: '16px' }} />
          {ability_score}
        </div>
      </CustomTooltip>
    )
  }

  const navBarStyle = smallWindow ? {} : { position: 'fixed', top: 0, width: '100%', zIndex: '100' }

  const blackToWhiteFilter =
    'invert(92%) sepia(94%) saturate(29%) hue-rotate(251deg) brightness(108%) contrast(100%)'

  if (!user) return null

  return (
    <Headroom disableInlineStyles={!smallWindow} style={navBarStyle}>
      <Box
        component="nav"
        className="navbar"
        style={{
          padding: '8px 14px 8px 8px',
          flexWrap: 'nowrap',
          backgroundColor: colors.card,
        }}
      >
        <Tour />
        <LanguageSelectDialog open={langDialogOpen} onClose={() => setLangDialogOpen(false)} />
        <img
          src={images.menu2}
          alt="menu"
          onClick={() => dispatch(sidebarSetOpen(!open))}
          className="sidebar-hamburger"
          data-cy="hamburger"
          style={{ width: '24px', height: '24px', cursor: 'pointer', display: 'block' }}
        />
        <NavCollapse>
          {/********************************* HAMBURGER *********************************/}
          <NavGroup sx={{ mr: 'auto' }}>
            <div
              className="navbar-container"
              style={{ display: 'flex', alignItems: 'center', gap: '20px' }}
            >
              <Link to="/home" style={{ textDecoration: 'none' }}>
                <Box
                  component="span"
                  data-cy="revita-logo"
                  className="navbar-revita-logo tour-start-finish"
                  sx={{
                    fontFamily: font.family,
                    fontSize: '24px',
                    fontWeight: 500,
                    color: colors.ink,
                  }}
                >
                  Revita
                  {hiddenFeatures && <sup> &beta;</sup>}
                </Box>
              </Link>
              {user.user.last_used_language && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <CustomTooltip
                    placement="bottom-end"
                    title={intl.formatMessage({
                      id: 'click-to-change-learning-language-explanation',
                    })}
                  >
                    <span
                      role="button"
                      tabIndex={0}
                      data-cy="navbar-learning-language"
                      className="tour-navbar-learning-language"
                      onClick={() => setLangDialogOpen(true)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: colors.ink,
                        fontFamily: font.family,
                        fontWeight: 600,
                        fontSize: '18px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <img
                        src={getLearningLanguageFlag()}
                        alt=""
                        style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      {user.user.last_used_language}
                    </span>
                  </CustomTooltip>
                  <MoreVertIcon
                    data-cy="language-options"
                    onClick={() => setLangDialogOpen(true)}
                    style={{ color: colors.ink, cursor: 'pointer', fontSize: 22 }}
                  />
                </div>
              )}
            </div>
          </NavGroup>
          {/********************************* ELO SCORE *********************************/}
          <NavGroup>
            <div className="navbar-container">
              <Box
                component="span"
                onClick={handleEloClick}
                onKeyDown={() => dispatch(setAnnotationsVisibility(true))}
              >
                {showStoryElo && get_student_ability_score_component()}
                {showFlashcardElo && (
                  <CustomTooltip
                    permanent
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
                  </CustomTooltip>
                )}
              </Box>
            </div>
          </NavGroup>
          {/******************************* USER OPTIONS *******************************/}
          <NavGroup>
            <Detector
              polling={{ timeout: 20000 }}
              render={({ online }) => (
                <CircleIcon
                  className="navbar-basic-item"
                  titleAccess={intl.formatMessage({
                    id: online ? 'connection-online' : 'connection-offline',
                  })}
                  style={{
                    fontSize: 10,
                    color: online ? '#37B24D' : colors.error,
                    margin: '0 10px',
                  }}
                />
              )}
            />
            <AppMenu
              minWidth={240}
              borderRadius="30px"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              trigger={
                <Box
                  data-cy="user-options"
                  sx={{
                    position: 'relative',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: colors.ink,
                    color: '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: font.family,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  {getInitials(user.user.username)}
                  {numUnreadNews > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: -1,
                        right: -1,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: '#ff944d',
                        border: `2px solid ${colors.card}`,
                      }}
                    />
                  )}
                </Box>
              }
            >
              <AppMenuItem icon={<PersonOutlinedIcon />} onClick={() => navigate('/profile/main')}>
                <FormattedMessage id="your-profile" defaultMessage="Your Profile" />
              </AppMenuItem>
              <AppMenuItem icon={<NotificationsNoneIcon />} onClick={handleNewsClick}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <FormattedMessage id="notifications" defaultMessage="Notifications" />
                  {numUnreadNews > 0 && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 20,
                        height: 20,
                        padding: '0 6px',
                        borderRadius: 999,
                        backgroundColor: '#dc3545',
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {numUnreadNews}
                    </span>
                  )}
                </span>
              </AppMenuItem>
              <AppMenuItem icon={<GroupIcon />} onClick={() => navigate('/groups/teacher')}>
                <FormattedMessage id="Groups" defaultMessage="Groups" />
              </AppMenuItem>
              <AppMenuItem icon={<SettingsIcon />} onClick={() => navigate('/profile/settings')}>
                <FormattedMessage id="Settings" defaultMessage="Settings" />
              </AppMenuItem>
              {isTeacher && (
                <MenuRow style={{ justifyContent: 'space-between', cursor: 'default' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
                    <SchoolOutlinedIcon />
                    {intl.formatMessage({ id: 'student-view' })}
                  </span>
                  <Switch size="small" checked={!teacherView} onChange={handleStudentViewSwitch} />
                </MenuRow>
              )}
              <MenuRow style={{ justifyContent: 'space-between', cursor: 'default' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
                  <DarkModeOutlinedIcon />
                  <FormattedMessage id="dark-theme" defaultMessage="Dark Theme" />
                </span>
                <Switch size="small" checked={darkVisual} onChange={() => setDarkVisual(v => !v)} />
              </MenuRow>
              <AppMenuItem icon={<LogoutIcon />} onClick={signOut}>
                <FormattedMessage id="Logout" defaultMessage="Logout" />
              </AppMenuItem>
            </AppMenu>
          </NavGroup>
          {/******************************* END *******************************/}
        </NavCollapse>
      </Box>
    </Headroom>
  )
}
