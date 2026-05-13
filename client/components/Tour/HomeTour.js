/* eslint-disable no-unused-vars */
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { FormattedMessage } from 'react-intl'
import Sparkle from 'react-sparkle'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { handleNextTourStep, stopTour } from 'Utilities/redux/tourReducer'
import { confettiRain } from 'Utilities/common'
import { useSelector } from 'react-redux'
import { tourSign, getSafeTarget, triggerResize } from './utils'
import JoyrideShared from './JoyrideShared'
import useTourRuntime from './useTourRuntime'

// Step blueprints keyed by id. We assemble the actual step list per role/screen
// by referencing these by id, so there is exactly one source of truth.
const stepBlueprints = {
  welcome: {
    target: '.tour-start-finish',
    title: <FormattedMessage id="welcome" />,
    content: (
      <div className="tour-mobile-message">
        <FormattedHTMLMessage id="tour-welcome-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    skipBeacon: true,
  },
  sideBar: {
    target: '.tour-sidebar',
    title: <FormattedMessage id="sidebar" />,
    content: (
      <div className="tour-mobile-message">
        <FormattedHTMLMessage id="tour-sidebar-message" />
      </div>
    ),
    textAlign: 'center',
    placement: 'right-start',
    disableScrolling: true,
    floatingOptions: { flipOptions: false },
    skipBeacon: true,
    styles: { options: { zIndex: 10000 } },
  },
  learningLanguage: {
    target: '.tour-navbar-learning-language',
    title: <FormattedMessage id="Learning-language" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-learning-language-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    skipBeacon: true,
    styles: { options: { zIndex: 10000 } },
  },
  addNewStories: {
    target: '.tour-add-new-stories',
    title: <FormattedMessage id="add-content" />,
    content: (
      <div className="tour-mobile-message">
        <Sparkle flicker={false} />
        <FormattedHTMLMessage id="tour-add-content-message" />
      </div>
    ),
    placement: 'top',
    skipBeacon: true,
    styles: {
      tooltipContainer: { textAlign: 'left' },
      options: {
        arrowColor: 'rgb(50, 170, 248)',
        primaryColor: 'rgb(50, 170, 248)',
        backgroundColor: 'rgb(50, 170, 248',
        zIndex: 1000,
        textColor: 'white',
      },
      buttonNext: { backgroundColor: 'white', borderRadius: 8, color: 'black' },
    },
  },
  library: {
    target: '.tour-library',
    title: <FormattedMessage id="Library" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-library-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    skipBeacon: true,
  },
  lesson: {
    target: '.tour-lesson',
    title: <FormattedMessage id="Lessons" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-lessons-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    skipBeacon: true,
  },
  practiceNow: {
    target: '.tour-practice-now',
    title: <FormattedMessage id="practice-now" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-practice-now-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    skipBeacon: true,
  },
  flashcards: {
    target: '.tour-flashcards',
    title: <FormattedMessage id="Flashcards" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-flashcards-message" />
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    skipBeacon: true,
  },
  progress: {
    target: '.tour-progress',
    title: <FormattedMessage id="Progress" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-progress-message" />
      </div>
    ),
    skipBeacon: true,
  },
  chatbot: {
    target: '.chatbot',
    title: <FormattedMessage id="tour-chatbot-message-title" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-chatbot-message" />
      </div>
    ),
    skipBeacon: true,
    placementBeacon: 'left',
    placement: 'left',
  },
  help: {
    target: '.tour-help',
    title: <FormattedMessage id="tour-step9-HELP-header" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-step9-HELP-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'top',
    opacity: 0,
    skipBeacon: true,
  },
  beginPracticing: {
    target: '.tour-button',
    title: <FormattedMessage id="begin-practicing" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-begin-practicing-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'top',
    opacity: 0,
    skipBeacon: true,
  },
}

// Step ordering per role/screen (defined as ids — the heavy step data is reused).
const STEP_ORDER = {
  desktopStudent: [
    'welcome',
    'sideBar',
    'learningLanguage',
    'library',
    'lesson',
    'practiceNow',
    'flashcards',
    'progress',
    'chatbot',
    'help',
    'beginPracticing',
  ],
  desktopTeacher: [
    'welcome',
    'sideBar',
    'learningLanguage',
    'addNewStories',
    'library',
    'lesson',
    'chatbot',
    'help',
    'beginPracticing',
  ],
  mobileStudent: [
    'welcome',
    'sideBar',
    'library',
    'lesson',
    'practiceNow',
    'flashcards',
    'progress',
    'chatbot',
    'help',
  ],
  mobileTeacher: ['welcome', 'sideBar', 'library', 'lesson', 'chatbot', 'help'],
}

const HomeTour = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isActive, run, stepIndex, tourKey, continuous, teacherView, bigScreen } =
    useTourRuntime('home')
  const { lesson_topics } = useSelector(({ metadata }) => metadata)

  if (!isActive) return null

  const orderKey = (bigScreen ? 'desktop' : 'mobile') + (teacherView ? 'Teacher' : 'Student')
  const steps = STEP_ORDER[orderKey].map(id => ({
    ...stepBlueprints[id],
    target: getSafeTarget(stepBlueprints[id].target),
  }))

  // Index of `chatbot` step varies per role; toggling it is a single rule.
  const chatbotIndex = STEP_ORDER[orderKey].indexOf('chatbot')

  const handleEvent = ({ action, index, type, status }) => {
    if (
      action === ACTIONS.CLOSE ||
      (status === STATUS.SKIPPED && run) ||
      status === STATUS.FINISHED
    ) {
      dispatch(stopTour())
      return
    }
    if (action === ACTIONS.START) {
      dispatch(sidebarSetOpen(false))
      return
    }
    if (type === EVENTS.TARGET_NOT_FOUND) {
      dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
      return
    }
    if (type !== EVENTS.STEP_AFTER && type !== EVENTS.STEP_AFTER_HOOK) return

    // Skip `addNewStories` (teacher desktop only) when no lesson topics exist.
    const currentId = STEP_ORDER[orderKey][index]
    if (
      currentId === 'learningLanguage' &&
      orderKey === 'desktopTeacher' &&
      !lesson_topics?.length
    ) {
      dispatch(handleNextTourStep(index + 2))
      return
    }

    if (bigScreen) {
      if (!location.pathname.includes('/home')) navigate('/home')

      if (index === 0) {
        // Open sidebar so .tour-sidebar mounts before next step.
        dispatch(sidebarSetOpen(true))
        setTimeout(() => {
          dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
          triggerResize()
          setTimeout(triggerResize, 50)
        }, 400)
        return
      }
      if (index === 1) dispatch(sidebarSetOpen(false))

      // Toggle chatbot when entering or leaving the chatbot step.
      if (index === chatbotIndex || index === chatbotIndex - 1) {
        dispatch({ type: 'TOGGLE_CHATBOT' })
      }

      dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
      return
    }

    // Mobile flow.
    if (index === 0) {
      if (!location.pathname.includes('/home')) navigate('/home')
      dispatch(sidebarSetOpen(true))
    } else if (index === 1) {
      setTimeout(() => {
        dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
      }, 600)
      return
    } else if (index === 2) {
      // Mini celebration on the library step.
      ;[0, 0, 400, 600, 800].forEach(delay => setTimeout(confettiRain, delay))
    } else if (index === chatbotIndex || index === chatbotIndex - 1) {
      dispatch({ type: 'TOGGLE_CHATBOT' })
    }

    dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
  }

  return (
    <JoyrideShared
      steps={steps}
      stepIndex={stepIndex}
      run={run}
      tourKey={tourKey}
      continuous={continuous}
      onEvent={handleEvent}
    />
  )
}

export default HomeTour