/* eslint-disable no-unused-vars */
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { FormattedMessage } from 'react-intl'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { handleNextTourStep, stopTour } from 'Utilities/redux/tourReducer'
import { setHelperSidebarOpen } from 'Utilities/redux/helperSidebarReducer'
import { tourSign, getSafeTarget, triggerResize } from './utils'
import JoyrideShared from './JoyrideShared'
import useTourRuntime from './useTourRuntime'

const PracticeTour = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isActive, run, stepIndex, tourKey, continuous, teacherView, bigScreen } =
    useTourRuntime('practice')
  // Alternative tour shares this component but uses a sliced step list.
  const altRuntime = useTourRuntime('practice-alt')
  const isAlt = altRuntime.isActive
  const active = isActive || isAlt
  const runtime = isAlt ? altRuntime : { run, stepIndex, tourKey, continuous }

  if (!active) return null

  // ── desktop steps ────────────────────────────────────────────────────────
  const desktopSteps = [
    {
      target: '.tour-button',
      title: <FormattedMessage id="Welcome to the Practice mode" />,
      content: (
        <div>
          <FormattedHTMLMessage id="practice-tour-welcome-message" />
          <div>{tourSign()}</div>
        </div>
      ),
      placement: 'center',
      skipBeacon: true,
    },
    {
      target: '.story-topics-box',
      title: <FormattedMessage id="Story Topics Box" />,
      content: (
        <div>
          <FormattedHTMLMessage id="practice-tour-topics-message" />
        </div>
      ),
      skipBeacon: true,
      placement: 'left',
    },
    {
      target: '.combined-chatbot',
      title: <FormattedMessage id="Translations" />,
      content: (
        <div>
          <FormattedHTMLMessage id="practice-tour-translations-message" />
        </div>
      ),
      skipBeacon: true,
      placement: 'left',
    },
    teacherView
      ? {
          target: '.practice-tour-edit-delete-story',
          title: <FormattedMessage id="practice-tour-edit-delete-title" />,
          content: (
            <div>
              <FormattedHTMLMessage id="practice-tour-edit-delete-message" />
            </div>
          ),
          skipBeacon: true,
        }
      : {
          target: '.practice-tour-start-practice-story',
          title: <FormattedMessage id="Start Practicing" />,
          content: (
            <div>
              <FormattedHTMLMessage id="practice-tour-start-practice-message" />
            </div>
          ),
          skipBeacon: true,
        },
    // The student journey then walks through the practice view itself.
    ...(teacherView
      ? []
      : [
          {
            target: '.practice-container',
            title: <FormattedMessage id="Exercises" />,
            content: (
              <div>
                <FormattedHTMLMessage id="practice-tour-exercise-box-message" />
              </div>
            ),
            skipBeacon: true,
            placement: 'right',
          },
          {
            target: '.exercise',
            title: <FormattedMessage id="Exercise" />,
            content: (
              <div>
                <FormattedHTMLMessage id="practice-tour-exercise-message" />
              </div>
            ),
            skipBeacon: true,
          },
          {
            target: '.attempt-bar',
            title: <FormattedMessage id="check-answer" />,
            content: (
              <div>
                <FormattedHTMLMessage id="practice-tour-check-answers-message" />
              </div>
            ),
            skipBeacon: true,
          },
          {
            target: '.progress-bar-cont',
            title: <FormattedMessage id="Progress bar" />,
            content: (
              <div>
                <FormattedHTMLMessage id="practice-tour-progress-message" />
              </div>
            ),
            skipBeacon: true,
          },
          {
            target: '.navbar-basic-item',
            title: <FormattedMessage id="ELO score" />,
            content: (
              <div>
                <FormattedHTMLMessage id="explanations-popup-story-elo" />
              </div>
            ),
          },
        ]),
    {
      target: '.tour-button',
      title: <FormattedMessage id="Tour end" />,
      content: (
        <div>
          <FormattedHTMLMessage id="tour-end-message" />
          <div>{tourSign()}</div>
        </div>
      ),
      skipBeacon: true,
    },
  ]

  // ── mobile steps ─────────────────────────────────────────────────────────
  const mobileSteps = [
    {
      target: '.tour-start-finish',
      title: <FormattedMessage id="Welcome to the Practice mode" />,
      content: (
        <div>
          <FormattedHTMLMessage id="practice-tour-welcome-message" />
          <div>{tourSign()}</div>
        </div>
      ),
      placement: 'center',
      skipBeacon: true,
    },
    {
      target: '.mobile-practice-tour-word',
      title: <FormattedMessage id="Translations" />,
      content: (
        <div>
          <FormattedHTMLMessage id="practice-tour-mobile-translations-message" />
        </div>
      ),
      skipBeacon: true,
    },
    {
      target: '.practice-tour-start-practice-story',
      title: <FormattedMessage id="Start Practicing" />,
      content: (
        <div>
          <FormattedHTMLMessage id="practice-tour-start-practice-message" />
        </div>
      ),
      skipBeacon: true,
    },
    {
      target: '.practice-container',
      title: <FormattedMessage id="Exercises" />,
      content: (
        <div>
          <FormattedHTMLMessage id="practice-tour-exercise-box-message" />
        </div>
      ),
      skipBeacon: true,
    },
    {
      target: '.exercise',
      title: <FormattedMessage id="Exercise" />,
      content: (
        <div>
          <FormattedHTMLMessage id="practice-tour-exercise-message" />
        </div>
      ),
      skipBeacon: true,
    },
    {
      target: '.attempt-bar',
      title: <FormattedMessage id="check-answer" />,
      content: (
        <div>
          <FormattedHTMLMessage id="practice-tour-check-answers-message" />
        </div>
      ),
      skipBeacon: true,
    },
    {
      target: '.progress-bar-cont',
      title: <FormattedMessage id="Progress bar" />,
      content: (
        <div>
          <FormattedHTMLMessage id="practice-tour-progress-message" />
        </div>
      ),
      skipBeacon: true,
    },
    {
      target: '.navbar-basic-item',
      title: <FormattedMessage id="ELO score" />,
      content: (
        <div>
          <FormattedHTMLMessage id="explanations-popup-story-elo" />
        </div>
      ),
    },
    {
      target: '.tour-mobile-start-button',
      title: <FormattedMessage id="Tour end" />,
      content: (
        <div>
          <FormattedHTMLMessage id="tour-end-message" />
          <div>{tourSign()}</div>
        </div>
      ),
      placement: 'right',
      placementBeacon: 'left',
      styles: { options: { zIndex: 10000 } },
    },
  ]

  // Alt slices the in-practice-view portion only.
  const baseSteps = bigScreen ? desktopSteps : mobileSteps
  const slicedSteps = isAlt ? baseSteps.slice(bigScreen ? 5 : 3) : baseSteps
  const steps = slicedSteps.map(step => ({ ...step, target: getSafeTarget(step.target) }))

  const handleEvent = ({ action, index, type, status }) => {
    if (
      action === ACTIONS.CLOSE ||
      (status === STATUS.SKIPPED && runtime.run) ||
      status === STATUS.FINISHED
    ) {
      dispatch(stopTour())
      return
    }
    if (type === EVENTS.TARGET_NOT_FOUND) return
    if (type !== EVENTS.STEP_AFTER && type !== EVENTS.STEP_AFTER_HOOK) return

    if (bigScreen && !isAlt) {
      if (index === 0) {
        // Ensure the helper sidebar (which hosts story-topics-box and the
        // chatbot) is visible before the next step targets one of them.
        dispatch(setHelperSidebarOpen(true))
        dispatch({ type: 'SHOW_TOPICS_BOX' })
        // Give the sidebar transition time to finish before advancing.
        setTimeout(() => {
          dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
          triggerResize()
        }, 300)
        return
      }
      if (index === 1 && action !== ACTIONS.PREV) dispatch({ type: 'CLOSE_TOPICS_BOX' })
      if (index === 2) dispatch({ type: 'SHOW_PRACTICE_DROPDOWN' })
      if (index === 3) {
        dispatch({ type: 'CLOSE_PRACTICE_DROPDOWN' })
        if (!teacherView) {
          // Student: jump to practice view; teacher tour ends after this step.
          const newPath = location.pathname.replace(/\/(preview|review)\/?$/, '/')
          navigate(`${newPath}practice/`)
          setTimeout(triggerResize, 4000)
        }
      }
    } else if (!bigScreen && !isAlt) {
      if (index === 1) dispatch({ type: 'SHOW_PRACTICE_DROPDOWN' })
      if (index === 2) {
        dispatch({ type: 'CLOSE_PRACTICE_DROPDOWN' })
        const newPath = location.pathname.substring(0, location.pathname.length - 7)
        navigate(`${newPath}practice/`)
      }
      if (index === 7) {
        setTimeout(() => {
          dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
          triggerResize()
        }, 500)
        return
      }
    } else if (!bigScreen && isAlt && index === 4) {
      setTimeout(() => {
        dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
        triggerResize()
      }, 500)
      return
    }

    dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
  }

  return (
    <JoyrideShared
      steps={steps}
      stepIndex={runtime.stepIndex}
      run={runtime.run}
      tourKey={runtime.tourKey}
      continuous={runtime.continuous}
      onEvent={handleEvent}
    />
  )
}

export default PracticeTour