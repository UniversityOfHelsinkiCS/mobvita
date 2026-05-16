/* eslint-disable no-unused-vars */
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { handleNextTourStep, stopTour } from 'Utilities/redux/tourReducer'
import { setHelperSidebarOpen } from 'Utilities/redux/helperSidebarReducer'
import { buildSteps, resolveOrderKey, triggerResize } from '../utils'
import { stepBlueprints, STEP_ORDER, ALT_STEP_ORDER } from '../steps/practiceSteps'
import JoyrideShared from '../JoyrideShared'
import useTourRuntime from '../useTourRuntime'

// Tour for the Practice/Preview/Review views. Serves both the `practice`
// tour (full walkthrough) and `practice-alt` (in-practice slice).
const PracticeTour = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const main = useTourRuntime('practice')
  const alt = useTourRuntime('practice-alt')
  const isAlt = alt.isActive
  const runtime = isAlt ? alt : main

  if (!main.isActive && !isAlt) return null

  const { teacherView, bigScreen } = runtime
  const orderKey = resolveOrderKey({ bigScreen, teacherView })
  const order = (isAlt ? ALT_STEP_ORDER : STEP_ORDER)[orderKey]
  const steps = buildSteps(stepBlueprints, order, { bigScreen, teacherView })

  // Drives side effects between steps (sidebar, dropdowns, navigation).
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

    // Advance (or rewind) the tour, optionally after a delay; always resizes.
    const advance = (delay = 0) => {
      const next = () => {
        dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
        triggerResize()
      }
      if (delay > 0) setTimeout(next, delay)
      else next()
    }

    const currentId = order[index]

    if (!isAlt && bigScreen) {
      if (currentId === 'welcomeDesktop') {
        // Open helper sidebar (hosts topics-box + chatbot) before topics step.
        dispatch(setHelperSidebarOpen(true))
        dispatch({ type: 'SHOW_TOPICS_BOX' })
        advance(300)
        return
      }
      if (currentId === 'topics' && action !== ACTIONS.PREV) {
        dispatch({ type: 'CLOSE_TOPICS_BOX' })
      }
      if (currentId === 'translations') dispatch({ type: 'SHOW_PRACTICE_DROPDOWN' })
      if (currentId === 'storyAction') {
        dispatch({ type: 'CLOSE_PRACTICE_DROPDOWN' })
        if (!teacherView) {
          const newPath = location.pathname.replace(/\/(preview|review)\/?$/, '/')
          navigate(`${newPath}practice/`)
          setTimeout(triggerResize, 4000)
        }
      }
    } else if (!isAlt && !bigScreen) {
      if (currentId === 'translationsMobile') dispatch({ type: 'SHOW_PRACTICE_DROPDOWN' })
      if (currentId === 'startPracticeMobile') {
        dispatch({ type: 'CLOSE_PRACTICE_DROPDOWN' })
        const newPath = location.pathname.substring(0, location.pathname.length - 7)
        navigate(`${newPath}practice/`)
      }
      if (currentId === 'progressBar') {
        advance(500)
        return
      }
    } else if (isAlt && !bigScreen && currentId === 'eloScore') {
      advance(500)
      return
    }

    advance()
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
