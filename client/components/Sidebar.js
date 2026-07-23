import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Box } from '@mui/material'
import { images, hiddenFeatures, ACCESS, useHasAccess, getHelpLink } from 'Utilities/common'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import {
  startAnonymousProgressTour,
  startLessonsTour,
  startLibraryTour,
  startProgressTour,
  startPracticeTour,
} from 'Utilities/redux/tourReducer'
import EditNoteIcon from '@mui/icons-material/EditNote'
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined'
import ContactUs from './StaticContent/ContactUs'
import PracticeModal from './HomeView/PracticeModal'
import { MenuRow } from 'Components/ui/menuRow'
import { colors, font, shape } from 'Assets/mui_theme/designTokens'

/**
 * Sidebar — the left "system" menu (Revita features + info), overlay drawer styled like AppMenu.
 * User-account items (Profile, Groups, Settings, Notifications, Dark Theme, Logout) live in the
 * navbar's user-options menu instead. Rows reuse the shared `MenuRow` so they match the dropdowns.
 */
const DRAWER_WIDTH = 320
const iconSx = { fontSize: 22 }
const imgIconStyle = { width: 22, height: 22 } // for the landing-menu SVG icons (help, about, …)

export default function Sidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const user = useSelector(({ user }) => user.data)
  const open = useSelector(({ sidebar }) => sidebar.open)
  const { hasAdaptiveTests } = useSelector(({ metadata }) => metadata)
  const { locale } = useSelector(({ locale }) => locale)
  const canAccessLessons = useHasAccess(ACCESS.HIGH)
  const learningLanguage = user?.user?.last_used_language
  const isTeacher = user?.user?.is_teacher

  const [practiceModalOpen, setPracticeModalOpen] = useState(false)
  const [contactUsOpen, setContactUsOpen] = useState(false)

  const closeSidebar = () => dispatch(sidebarSetOpen(false))

  const go = path => {
    navigate(path)
    closeSidebar()
  }

  const handleTourStart = () => {
    if (location.pathname.includes('profile')) {
      if (!location.pathname.includes('progress')) navigate('/profile/progress')
      if (user.user.email === 'anonymous_email') dispatch(startAnonymousProgressTour())
      else dispatch(startProgressTour())
    } else if (location.pathname.includes('lessons') && hiddenFeatures) {
      dispatch(startLessonsTour())
    } else if (location.pathname.includes('library')) {
      dispatch(startLibraryTour())
    } else if (
      (location.pathname.includes('preview') || location.pathname.includes('review')) &&
      hiddenFeatures
    ) {
      dispatch(startPracticeTour())
    } else if (location.pathname.includes('/practice') && hiddenFeatures) {
      dispatch({ type: 'PRACTICE_TOUR_ALTERNATIVE' })
    } else {
      dispatch({ type: 'TOUR_RESTART' })
    }
    closeSidebar()
  }

  const helpLink = getHelpLink(locale, isTeacher, learningLanguage)
  const isActive = path => location.pathname.startsWith(path)
  const currentYear = new Date().getFullYear()

  if (!user) return null

  return (
    <>
      {open && (
        <Box
          data-cy="sidebar-overlay"
          onClick={closeSidebar}
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(45, 44, 42, 0.35)',
          }}
        />
      )}

      <ContactUs open={contactUsOpen} setOpen={setContactUsOpen} />
      <PracticeModal open={practiceModalOpen} setOpen={setPracticeModalOpen} />

      <Box
        component="aside"
        data-cy="sidebar-panel"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: DRAWER_WIDTH,
          zIndex: 1001,
          boxSizing: 'border-box',
          backgroundColor: colors.card,
          borderBottomLeftRadius: shape.cardRadius,
          borderBottomRightRadius: shape.cardRadius,
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18)',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px 12px',
          fontFamily: font.family,
          color: colors.ink,
          transform: open ? 'translateX(0)' : `translateX(-${DRAWER_WIDTH + 40}px)`,
          transition: 'transform 0.25s ease-in-out',
        }}
      >
        {/* Header: close + Revita wordmark */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '4px 12px 16px' }}>
          <img
            src={images.xClose}
            alt="close"
            onClick={closeSidebar}
            data-cy="sidebar-close"
            style={{ width: 22, height: 22, cursor: 'pointer' }}
          />
          <span
            style={{ fontFamily: font.family, fontSize: 24, fontWeight: 500, color: colors.ink }}
          >
            Revita
          </span>
        </Box>

        {/* System navigation */}
        <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flexGrow: 1 }}>
          <MenuRow
            icon={<img src={images.iconHome} alt="" style={imgIconStyle} />}
            selected={isActive('/home') || isActive('/welcome')}
            onClick={() => go('/home')}
          >
            <FormattedMessage id="Home" defaultMessage="Home" />
          </MenuRow>
          {/* <MenuRow
            icon={<img src={images.bookmark} alt="" style={imgIconStyle} />}
            onClick={() => go('/home')}
          >
            <FormattedMessage id="homework" defaultMessage="Homework" />
          </MenuRow> */}
          {canAccessLessons && (
            <MenuRow
              icon={<img src={images.bookOpen} alt="" style={imgIconStyle} />}
              selected={isActive('/lessons')}
              onClick={() => go('/lessons/library')}
            >
              <FormattedMessage id="Lessons" />
            </MenuRow>
          )}
          <MenuRow
            icon={<img src={images.layersThree} alt="" style={imgIconStyle} />}
            selected={isActive('/flashcards')}
            onClick={() => go('/flashcards/fillin')}
          >
            <FormattedMessage id="Flashcards" />
          </MenuRow>
          <MenuRow
            icon={<img src={images.libraryBig} alt="" style={imgIconStyle} />}
            selected={isActive('/library')}
            onClick={() => go('/library')}
          >
            <FormattedMessage id="Library" />
          </MenuRow>
          <MenuRow
            icon={<img src={images.rocket} alt="" style={imgIconStyle} />}
            selected={isActive('/profile/progress')}
            onClick={() => go('/profile/progress')}
          >
            <FormattedMessage id="Progress" defaultMessage="Progress" />
          </MenuRow>

          <MenuRow
            icon={<EditNoteIcon sx={iconSx} />}
            selected={isActive('/essay-writing')}
            onClick={() => go('/essay-writing')}
          >
            <FormattedMessage id="essay-writing" />
          </MenuRow>
          {hasAdaptiveTests && (
            <MenuRow
              icon={<EmojiEventsOutlinedIcon sx={iconSx} />}
              selected={isActive('/adaptive-test')}
              onClick={() => go('/adaptive-test')}
            >
              <FormattedMessage id="adaptive-test" />
            </MenuRow>
          )}
          {hiddenFeatures && (
            <>
              <MenuRow onClick={() => go('/test-construction')}>Grammar check</MenuRow>
              <MenuRow onClick={() => go('/test-debug')}>Feedback check</MenuRow>
              <MenuRow onClick={() => go('/correction-debug')}>Correction check</MenuRow>
            </>
          )}

          <Box sx={{ borderTop: '1px solid rgba(45, 44, 42, 0.12)', my: '10px', mx: '12px' }} />

          <MenuRow
            icon={<img src={images.helpCircle} alt="" style={imgIconStyle} />}
            href={helpLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeSidebar}
          >
            <FormattedMessage id="help" />
          </MenuRow>
          <MenuRow
            icon={<img src={images.route} alt="" style={imgIconStyle} />}
            onClick={handleTourStart}
          >
            <FormattedMessage id="start-tour" />
          </MenuRow>
          <MenuRow
            icon={<img src={images.asterisk02} alt="" style={imgIconStyle} />}
            href="https://revitaai.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            data-cy="about-button"
            onClick={closeSidebar}
          >
            <FormattedMessage id="about" />
          </MenuRow>
          <MenuRow
            icon={<img src={images.mail05} alt="" style={imgIconStyle} />}
            data-cy="navbar-tc-button"
            onClick={() => {
              setContactUsOpen(true)
              closeSidebar()
            }}
          >
            <FormattedMessage id="contact-us" />
          </MenuRow>
          <MenuRow
            icon={<img src={images.activityHeart} alt="" style={imgIconStyle} />}
            href="https://revitaai.github.io/SERVER-STATUS.html"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeSidebar}
          >
            <FormattedMessage id="server-status" />
          </MenuRow>
        </Box>

        {/* Footer: University of Helsinki */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
          <img
            src={images.universityOfHelsinki}
            alt="University of Helsinki"
            style={{ height: 36 }}
          />
          <div style={{ fontSize: 12, lineHeight: 1.4, color: colors.ink }}>
            © 2020–{currentYear}
            <br />
            University of Helsinki
          </div>
        </Box>
      </Box>
    </>
  )
}
