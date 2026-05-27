import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl } from 'react-intl'
import { FormattedMessage } from 'react-intl'
import { images } from 'Utilities/common'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { logout, teacherSwitchView } from 'Utilities/redux/userReducer'
import {
  startAnonymousProgressTour,
  startLessonsTour,
  startLibraryTour,
  startProgressTour,
  startPracticeTour,
} from 'Utilities/redux/tourReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import ContactUs from './StaticContent/ContactUs'
import PracticeModal from './HomeView/PracticeModal'
import { hiddenFeatures, cefrNum2Cefr } from 'Utilities/common'
import {
  Box,
  FormControlLabel,
  Menu,
  MenuItem,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import FlagIcon from '@mui/icons-material/Flag'
import BookIcon from '@mui/icons-material/Book'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import StyleIcon from '@mui/icons-material/Style'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import SettingsIcon from '@mui/icons-material/Settings'
import GroupIcon from '@mui/icons-material/Group'
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined'
import MapIcon from '@mui/icons-material/Map'
import InfoIcon from '@mui/icons-material/Info'
import MailOutlineIcon from '@mui/icons-material/MailOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { Button as BootstrapButton } from 'react-bootstrap'

export default function Sidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const user = useSelector(({ user }) => user.data)
  const open = useSelector(({ sidebar }) => sidebar.open)
  const learningLanguage = user?.user?.last_used_language
  const { hasAdaptiveTests } = useSelector(({ metadata }) => metadata)
  const sidebarRef = useRef(null)
  const [practiceModalOpen, setPracticeModalOpen] = useState(false)
  const [contactUsOpen, setContactUsOpen] = useState(false)
  const [moreAnchorEl, setMoreAnchorEl] = useState(null)
  const intl = useIntl()
  const isTeacher = user?.user.is_teacher
  const teacherView = user?.teacherView
  const smallWindow = useWindowDimensions().width < 640
  const showMoreMenu = Boolean(moreAnchorEl)

  const marginTopButton = '8px'

  const closeSidebar = () => {
    dispatch(sidebarSetOpen(false))
  }

  useEffect(() => {
    if (!open) return undefined

    const handleOutsideClick = event => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        closeSidebar()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [open])

  const signOut = () => {
    dispatch(logout())
    navigate('/')
    closeSidebar()
  }

  const handleTourStart = () => {
    if (location.pathname.includes('profile')) {
      if (!location.pathname.includes('progress')) {
        navigate('/profile/progress')
      }
      if (user.user.email === 'anonymous_email') {
        dispatch(startAnonymousProgressTour())
      } else {
        dispatch(startProgressTour())
      }
    } else if (location.pathname.includes('lessons') && hiddenFeatures) {
      dispatch(startLessonsTour())
    } else if (location.pathname.includes('library')) {
      dispatch(startLibraryTour())
    } else if (
      (location.pathname.includes('preview') || location.pathname.includes('review')) &&
      hiddenFeatures
    ) {
      dispatch(sidebarSetOpen(false))
      dispatch(startPracticeTour())
    } else if (location.pathname.includes('/practice') && hiddenFeatures) {
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

  const drawerWidth = 350
  const sidebarFontFamily = 'Lato, "Helvetica Neue", Arial, Helvetica, sans-serif'

  const actionButtonSx = {
    marginTop: marginTopButton,
    color: 'darkslateblue',
    borderColor: 'slateblue',
    fontSize: 'larger',
    fontWeight: 'bold',
    fontFamily: sidebarFontFamily,
    width: '100%',
  }

  const moreMenuItemSx = {
    '&:hover': {
      backgroundColor: '#ddf2ff',
    },
  }

  return (
    <>
      {open && (
        <Box
          data-cy="sidebar-overlay"
          aria-hidden
          sx={{
            position: 'fixed',
            top: 0,
            left: `${drawerWidth}px`,
            right: 0,
            bottom: 0,
            zIndex: 1000,
            backgroundColor: 'transparent',
            pointerEvents: 'none',
          }}
        />
      )}
      <Box
        ref={sidebarRef}
        data-cy="sidebar-panel"
        className="sidebar-panel"
        component="aside"
        role="complementary"
        inert={!open ? '' : undefined}
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: `${drawerWidth}px`,
          minWidth: `${drawerWidth}px`,
          maxWidth: `${drawerWidth}px`,
          boxSizing: 'border-box',
          zIndex: 1001,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#fff',
          borderRight: '1px solid rgba(34, 36, 38, 0.15)',
          transform: open ? 'translateX(0)' : `translateX(-${drawerWidth}px)`,
          transition: 'transform 0.2s ease-in-out',
        }}
      >
      <PracticeModal open={practiceModalOpen} setOpen={setPracticeModalOpen} />
      <ContactUs open={contactUsOpen} setOpen={setContactUsOpen} />
      <Box className="sidebar-content" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box
          className="revitaLogo"
          sx={{ display: 'flex', flexDirection: 'column', width: '100%', padding: 0 }}
        >
          <Box sx={{ padding: '6px 14px 0 8px' }}>
            <span className="tour-sidebar" style={{ display: 'inline-flex' }}>
              <MenuIcon
                className="sidebar-hamburger"
                onClick={closeSidebar}
                style={{ color: 'black', fontSize: '32px', cursor: 'pointer' }}
                data-cy="sidebar-close-hamburger"
              />
            </span>
          </Box>
          <Box
            sx={{
              padding: '0.5em 1.5em 1em 1.5em',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Link to="/home" onClick={closeSidebar}>
              <img
                style={{ width: '100%', maxWidth: '220px', margin: '6px auto' }}
                src={images.logo}
                alt="revitaLogo"
              />
            </Link>
          </Box>
        </Box>
        <Box sx={{ borderBottom: '1px solid rgba(34, 36, 38, 0.15)', mx: '16px', mb: '8px' }} />

        {user && (
          <>
            {user.user.email === 'anonymous_email' && (
              <Box sx={{ padding: '0.5em 0em' }}>
                  <Link to="/register" onClick={closeSidebar}>
                    <BootstrapButton
                      variant="primary"
                      className="sidebar-register-button"
                      style={{ width: '100%', fontFamily: sidebarFontFamily }}
                    >
                      <FormattedMessage id="register-to-save-your-progress" />
                    </BootstrapButton>
                  </Link>
              </Box>
            )}

            <Box className="sidebar-actions-wrap" sx={{ padding: '16px 12px' }}>
              <BootstrapButton
              className="sidebar-profile-button sidebar-action-button"
                  variant="secondary"
                  style={actionButtonSx}
                  onClick={() => { closeSidebar(); navigate('/home', { state: { practiceModalOpen: true } }); }}
                >
                  <FlagIcon fontSize="small" style={{ marginRight: '0.4em' }} />
                  <FormattedMessage id="practice-now" />
                </BootstrapButton>
                <Link to="/library" onClick={closeSidebar}>
                  <BootstrapButton
                    className="sidebar-library-button sidebar-action-button"
                    variant="secondary"
                    style={actionButtonSx}
                  >
                    <BookIcon fontSize="small" style={{ marginRight: '0.4em' }} />
                    <FormattedMessage id="Library" />
                  </BootstrapButton>
                </Link>
                <Link to="/lessons/library" onClick={closeSidebar}>
                  <BootstrapButton
                    className="sidebar-action-button"
                    variant="secondary"
                    style={actionButtonSx}
                  >
                    <EventAvailableIcon fontSize="small" style={{ marginRight: '0.4em' }} />
                    <FormattedMessage id="Lessons" />
                  </BootstrapButton>
                </Link>
                <Link to="/flashcards/fillin" onClick={closeSidebar}>
                  <BootstrapButton
                    className="sidebar-action-button"
                    variant="secondary"
                    style={actionButtonSx}
                  >
                    <StyleIcon fontSize="small" style={{ marginRight: '0.4em' }} />
                    <FormattedMessage id="Flashcards" />
                  </BootstrapButton>
                </Link>
                {hasAdaptiveTests && (<Link to="/adaptive-test" onClick={closeSidebar}>
                  <BootstrapButton
                    className="sidebar-action-button"
                    variant="secondary"
                    style={actionButtonSx}
                  >
                    <EmojiEventsIcon fontSize="small" style={{ marginRight: '0.4em' }} />
                    <FormattedMessage id="adaptive-test" />
                  </BootstrapButton>
                </Link>)}
                {hiddenFeatures && (
                  <>
                    <Link to="/test-construction" onClick={closeSidebar}>
                      <BootstrapButton className="sidebar-action-button" variant="secondary" style={actionButtonSx}>
                        Grammar check
                      </BootstrapButton>
                    </Link>
                    <Link to="/test-debug" onClick={closeSidebar}>
                      <BootstrapButton className="sidebar-action-button" variant="secondary" style={actionButtonSx}>
                        Feedback check
                      </BootstrapButton>
                    </Link>
                    <Link to="/correction-debug" onClick={closeSidebar}>
                      <BootstrapButton className="sidebar-action-button" variant="secondary" style={actionButtonSx}>
                        Correction check
                      </BootstrapButton>
                    </Link>
                  </>
                )}

            </Box>
          </>
        )}
        {user && (
          <Link to="/profile/progress" onClick={closeSidebar} className="sidebar-profile-summary-link">
            <Tooltip title={intl.formatMessage({ id: 'Sidebar-user-score-EXPLANATION' })}>
              <Box>
                <Typography align="center" sx={{ fontSize: '18px', fontFamily: sidebarFontFamily, color: '#777' }}>{`${user.user.username}`}</Typography>
                <Typography align="center" sx={{ fontSize: '18px', fontFamily: sidebarFontFamily, color: 'black' }}>{`${cefrNum2Cefr(user.user.current_cefr)}`}</Typography>
              </Box>
            </Tooltip>
          </Link>
        )}
        <Box sx={{ marginTop: 'auto', color: 'slateGrey' }}>
          <Box className="sidebar-footer-inner" sx={{ padding: '16px' }}>
          <Link to="/profile/settings" onClick={closeSidebar}>
            <BootstrapButton
              className="sidebar-action-button"
              variant="secondary"
              style={{ ...actionButtonSx, marginBottom: marginTopButton }}
              data-cy="navbar-settings-button"
            >
              <SettingsIcon fontSize="small" style={{ marginRight: '0.4em' }} />
              <FormattedMessage id="Settings" />
            </BootstrapButton>
          </Link>
            {isTeacher && smallWindow && (
              <Tooltip title={intl.formatMessage({ id: 'teacher-view-explanation' })}>
                <FormControlLabel
                  sx={{ mt: 0.5 }}
                  control={<Switch checked={!teacherView} onChange={handleStudentViewSwitch} />}
                  label={intl.formatMessage({ id: 'student-view' })}
                />
              </Tooltip>
            )}
            <Box
              className="sidebar-more-section"
              sx={{
                position: 'relative',
                marginTop: '0.5em',
                borderTop: '1px solid rgba(34, 36, 38, 0.1)',

              }}
            >
              <Box
                className="sidebar-more-trigger"
                component="button"
                type="button"
                onClick={event => setMoreAnchorEl(event.currentTarget)}
                aria-haspopup="listbox"
                aria-expanded={showMoreMenu}
                sx={{
                  marginTop: marginTopButton,
                  color: 'darkslateblue',
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none',
                  fontSize: 'larger',
                  fontWeight: 'bold',
                  fontFamily: sidebarFontFamily,
                  width: '100%',
                  backgroundColor: '#fff',
                  borderRadius: '0.375rem',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0.375rem 0.75rem',
                  lineHeight: 1.5,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#ddf2ff',
                  },
                  '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                  '&:focus-visible': {
                    outline: 'none',
                    boxShadow: 'none',
                  },
                }}
              >
                <span>{intl.formatMessage({ id: 'Menu-more' })}</span>
                <ArrowRightIcon fontSize="small" sx={{ position: 'absolute', right: '0.5rem' }} />
              </Box>
              <Menu
                anchorEl={moreAnchorEl}
                open={showMoreMenu}
                onClose={() => setMoreAnchorEl(null)}
                keepMounted
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                slotProps={{
                  paper: { style: { minHeight: '16em', fontFamily: sidebarFontFamily } },
                  list: {
                    sx: {
                      fontFamily: sidebarFontFamily,
                    },
                  },
                }}
              >
                <MenuItem
                  sx={moreMenuItemSx}
                  component={Link}
                  to={isTeacher ? '/groups/teacher' : '/groups/student'}
                  onClick={() => {
                    setMoreAnchorEl(null)
                    closeSidebar()
                  }}
                >
                  <GroupIcon fontSize="small" sx={{ marginRight: '0.6em' }} />
                  {intl.formatMessage({ id: 'groups' })}
                </MenuItem>
                <MenuItem
                  sx={moreMenuItemSx}
                  component={Link}
                  to="/profile/main"
                  onClick={() => {
                    setMoreAnchorEl(null)
                    closeSidebar()
                  }}
                >
                  <PersonOutlineIcon fontSize="small" sx={{ marginRight: '0.6em' }} />
                  {intl.formatMessage({ id: 'Profile' })}
                </MenuItem>
                {learningLanguage && (
                  <MenuItem
                    sx={moreMenuItemSx}
                    className="tour-mobile-start-button"
                    disabled={location.pathname.includes('lessons/library')}
                    onClick={() => {
                      handleTourStart()
                      setMoreAnchorEl(null)
                    }}
                  >
                    <MapIcon fontSize="small" sx={{ marginRight: '0.6em' }} />
                    {intl.formatMessage({ id: 'start-tour' })}
                  </MenuItem>
                )}
                <MenuItem
                  sx={moreMenuItemSx}
                  component="a"
                  href="https://revitaai.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cy="about-button"
                  onClick={() => setMoreAnchorEl(null)}
                >
                  <InfoIcon fontSize="small" sx={{ marginRight: '0.6em' }} />
                  {intl.formatMessage({ id: 'about' })}
                </MenuItem>
                <MenuItem
                  sx={moreMenuItemSx}
                  onClick={() => {
                    setMoreAnchorEl(null)
                    closeSidebar()
                    setContactUsOpen(true)
                  }}
                >
                  <MailOutlineIcon fontSize="small" sx={{ marginRight: '0.6em' }} />
                  {intl.formatMessage({ id: 'contact-us' })}
                </MenuItem>
                <MenuItem
                  sx={moreMenuItemSx}
                  data-cy="logout-button"
                  onClick={() => {
                    setMoreAnchorEl(null)
                    signOut()
                  }}
                >
                  <LogoutIcon fontSize="small" sx={{ marginRight: '0.6em' }} />
                  {intl.formatMessage({ id: 'sign-out' })}
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Box>
        <Box sx={{ color: 'slategrey', mt: 1, textAlign: 'center', fontFamily: sidebarFontFamily }}>
          <Box component="div">{`Built: ${__VERSION__}`}</Box>
          <Box component="div">{`${__COMMIT__}`}</Box>
        </Box>
      </Box>
      </Box>
    </>
  )
}
