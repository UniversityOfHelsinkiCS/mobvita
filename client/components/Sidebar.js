/* global __VERSION__, __COMMIT__ */
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router'
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
import ContactUs from './StaticContent/ContactUs'
import PracticeModal from './HomeView/PracticeModal'
import { assembleActivityLink } from 'Utilities/activityLink'
import { reloadIfNewDeploy } from 'Utilities/deployUpdates'
import { openAddStoryOptions } from 'Utilities/redux/helperSidebarReducer'
import { MenuRow } from 'Components/ui/menuRow'
import AppIcon from 'Components/ui/AppIcon'
import { colors, shape } from 'Assets/mui_theme/designTokens'

const DRAWER_WIDTH = 320

/**
 * Sidebar — the left "system" menu (Revita features + info), overlay drawer styled like AppMenu.
 * User-account items (Profile, Groups, Settings, Notifications, Dark Theme, Logout) live in the
 * navbar's user-options menu instead. Rows reuse the shared `MenuRow` so they match the dropdowns.
 */
export default function Sidebar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const user = useSelector(({ user }) => user.data)
  const open = useSelector(({ sidebar }) => sidebar.open)
  const { hasAdaptiveTests, aReadingComprehensionEnabled } = useSelector(({ metadata }) => metadata)
  const stories = useSelector(({ stories }) => stories.data)
  const lastActivity = useSelector(({ activity }) => activity.lastActivity)
  const { locale } = useSelector(({ locale }) => locale)
  const canAccessLessons = useHasAccess(ACCESS.HIGH)
  const learningLanguage = user?.user?.last_used_language
  const isTeacher = user?.user?.is_teacher
  const activityLink = assembleActivityLink(lastActivity, {
    stories,
    learningLanguage,
    readingComprehensionEnabled: aReadingComprehensionEnabled,
  })
  // A teacher can toggle into the student view, so the menu follows the view, not the role.
  const inTeacherView = isTeacher && user?.teacherView

  const [practiceModalOpen, setPracticeModalOpen] = useState(false)
  const [contactUsOpen, setContactUsOpen] = useState(false)
  const panelRef = useRef(null)

  // When closed the drawer stays in the DOM (translated off-screen), so mark it `inert` to keep it
  // non-interactive/non-focusable. Set imperatively (not via a prop) because MUI Box / React 18.3
  // don't reliably forward an `inert` prop to the DOM node.
  useEffect(() => {
    const el = panelRef.current
    if (!el) return
    if (open) el.removeAttribute('inert')
    else el.setAttribute('inert', '')
  }, [open])

  const closeSidebar = () => dispatch(sidebarSetOpen(false))

  // Menu navigation; after a new deploy it becomes a full page load of the new version.
  const go = path => {
    navigate(path)
    closeSidebar()
    reloadIfNewDeploy()
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
        ref={panelRef}
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
          color: colors.ink,
          transform: open ? 'translateX(0)' : `translateX(-${DRAWER_WIDTH + 40}px)`,
          transition: 'transform 0.25s ease-in-out',
        }}
      >
        {/* Header: close + Revita wordmark */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '4px 12px 16px' }}>
          <AppIcon
            src={images.xClose}
            size={22}
            role="img"
            aria-label="close"
            aria-hidden={false}
            onClick={closeSidebar}
            data-cy="sidebar-close-hamburger"
            style={{ cursor: 'pointer' }}
          />
          <span style={{ fontSize: 24, fontWeight: 500, color: colors.ink }}>Revita</span>
        </Box>

        {/* System navigation */}
        <Box sx={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', flexGrow: 1 }}>
          <MenuRow
            icon={<AppIcon src={images.iconHome} size={22} />}
            selected={isActive('/home') || isActive('/welcome')}
            onClick={() => go('/home')}
          >
            <FormattedMessage id="Home" defaultMessage="Home" />
          </MenuRow>

          {inTeacherView ? (
            <>
              {/* Teacher view: Groups - Add new stories - Library - Lessons - Progress */}
              <MenuRow
                icon={<AppIcon src={images.users01} size={22} />}
                selected={isActive('/groups')}
                onClick={() => go('/groups/teacher')}
              >
                <FormattedMessage id="Groups" />
              </MenuRow>
              <MenuRow
                icon={<AppIcon src={images.starBlack} size={22} />}
                onClick={() => {
                  dispatch(openAddStoryOptions())
                  closeSidebar()
                }}
              >
                <FormattedMessage id="add-your-stories" />
              </MenuRow>
              <MenuRow
                data-cy="sidebar-library"
                icon={<AppIcon src={images.libraryBig} size={22} />}
                selected={isActive('/library')}
                onClick={() => go('/library')}
              >
                <FormattedMessage id="Library" />
              </MenuRow>
              {canAccessLessons && (
                <MenuRow
                  icon={<AppIcon src={images.bookOpen} size={22} />}
                  selected={isActive('/lessons')}
                  onClick={() => go('/lessons/library')}
                >
                  <FormattedMessage id="Lessons" />
                </MenuRow>
              )}
            </>
          ) : (
            <>
              {/* Student view: Continue - Dive In! - Library - Flashcards - Lessons - Essay */}
              {activityLink && (
                <MenuRow
                  icon={<AppIcon src={images.playCircle} size={22} />}
                  onClick={() => go(activityLink)}
                >
                  <FormattedMessage id="continue-activity" />
                </MenuRow>
              )}
              <MenuRow
                icon={<AppIcon src={images.waves} size={22} />}
                onClick={() => {
                  setPracticeModalOpen(true)
                  closeSidebar()
                }}
              >
                <FormattedMessage id="practice-now" />
              </MenuRow>
              <MenuRow
                data-cy="sidebar-library"
                icon={<AppIcon src={images.libraryBig} size={22} />}
                selected={isActive('/library')}
                onClick={() => go('/library')}
              >
                <FormattedMessage id="Library" />
              </MenuRow>
              <MenuRow
                icon={<AppIcon src={images.cardsIcon} size={22} />}
                selected={isActive('/flashcards')}
                onClick={() => go('/flashcards/fillin')}
              >
                <FormattedMessage id="Flashcards" />
              </MenuRow>
              {canAccessLessons && (
                <MenuRow
                  icon={<AppIcon src={images.bookOpen} size={22} />}
                  selected={isActive('/lessons')}
                  onClick={() => go('/lessons/library')}
                >
                  <FormattedMessage id="Lessons" />
                </MenuRow>
              )}
              {hiddenFeatures && (
                <>
                  <MenuRow
                    icon={<AppIcon src={images.edit03} size={22} />}
                    selected={isActive('/essay-writing')}
                    onClick={() => go('/essay-writing')}
                  >
                    <FormattedMessage id="essay-writing" />
                  </MenuRow>
                  <MenuRow
                    icon={<AppIcon src={images.edit03} size={22} />}
                    selected={isActive('/writing-clinic')}
                    onClick={() => go('/writing-clinic')}
                  >
                    <FormattedMessage id="writing-clinic-title" defaultMessage="Writing Clinic" />
                  </MenuRow>
                </>
              )}
            </>
          )}

          {/* Quick test is student-only; Progress closes both menus. */}
          {!inTeacherView && hasAdaptiveTests && (
            <MenuRow
              icon={<AppIcon src={images.trophy01} size={22} />}
              selected={isActive('/adaptive-test')}
              onClick={() => go('/adaptive-test')}
            >
              <FormattedMessage id="adaptive-test" />
            </MenuRow>
          )}
          <MenuRow
            icon={<AppIcon src={images.rocket} size={22} />}
            selected={isActive('/profile/progress')}
            onClick={() => go('/profile/progress')}
          >
            <FormattedMessage id="Progress" defaultMessage="Progress" />
          </MenuRow>
          {hiddenFeatures && (
            <>
              <MenuRow
                icon={<AppIcon src={images.fileCheck03} size={22} />}
                onClick={() => go('/test-construction')}
              >
                Grammar check
              </MenuRow>
              <MenuRow
                icon={<AppIcon src={images.fileCheck03} size={22} />}
                onClick={() => go('/test-debug')}
              >
                Feedback check
              </MenuRow>
              <MenuRow
                icon={<AppIcon src={images.fileCheck03} size={22} />}
                onClick={() => go('/correction-debug')}
              >
                Correction check
              </MenuRow>
            </>
          )}

          <Box sx={{ borderTop: '1px solid rgba(45, 44, 42, 0.12)', my: '10px', mx: '12px' }} />

          <MenuRow
            className="tour-home-help"
            icon={<AppIcon src={images.helpCircle} size={22} />}
            href={helpLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeSidebar}
          >
            <FormattedMessage id="help" />
          </MenuRow>
          <MenuRow
            className="tour-shared-end tour-home-begin-practicing"
            data-cy="sidebar-start-tour"
            icon={<AppIcon src={images.route} size={22} />}
            onClick={handleTourStart}
          >
            <FormattedMessage id="start-tour" />
          </MenuRow>
          <MenuRow
            icon={<AppIcon src={images.asterisk02} size={22} />}
            href="https://revitaai.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            data-cy="about-button"
            onClick={closeSidebar}
          >
            <FormattedMessage id="about" />
          </MenuRow>
          <MenuRow
            icon={<AppIcon src={images.mail05} size={22} />}
            data-cy="navbar-tc-button"
            onClick={() => {
              setContactUsOpen(true)
              closeSidebar()
            }}
          >
            <FormattedMessage id="contact-us" />
          </MenuRow>
          <MenuRow
            icon={<AppIcon src={images.activityHeart} size={22} />}
            href="https://revitaai.github.io/SERVER-STATUS.html"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeSidebar}
          >
            <FormattedMessage id="server-status" />
          </MenuRow>
        </Box>

        {/* Build info (injected by vite: __VERSION__ = build time, __COMMIT__ = short hash) */}
        <Box
          sx={{
            mt: 1,
            textAlign: 'center',
            color: colors.muted,
            fontSize: 11,
            lineHeight: 1.4,
          }}
        >
          <div>{`Built: ${__VERSION__}`}</div>
          <div>{__COMMIT__}</div>
        </Box>
      </Box>
    </>
  )
}
