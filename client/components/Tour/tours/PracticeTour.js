/* eslint-disable no-unused-vars */
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { handleNextTourStep, stopTour } from 'Utilities/redux/tourReducer'
import { setHelperSidebarOpen } from 'Utilities/redux/helperSidebarReducer'
import {
  buildSteps,
  resolveOrderKey,
  triggerResize,
  syncLeftSidebar,
  SIDEBAR_SLIDE_MS,
} from '../utils'
import { stepBlueprints, STEP_ORDER, ALT_STEP_ORDER } from '../steps/practiceSteps'
import { anonymousHiddenSteps, highAccessSteps, visibleOrder } from '../steps/stepOrders'
import { ACCESS, useHasAccess, useIsAnonymous } from 'Utilities/common'
import JoyrideShared from '../JoyrideShared'
import useTourRuntime from '../useTourRuntime'

// Tour for the Practice/Preview/Review views: the `practice` walkthrough and the `practice-alt`
// in-practice slice. Assistant steps are left out for users without high access.
const PracticeTour = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const main = useTourRuntime('practice')
  const alt = useTourRuntime('practice-alt')
  const isAlt = alt.isActive
  const runtime = isAlt ? alt : main
  const highAccess = useHasAccess(ACCESS.HIGH)
  const anonymous = useIsAnonymous()

  if (!main.isActive && !isAlt) return null

  const { teacherView, bigScreen } = runtime
  const orderKey = resolveOrderKey({ bigScreen, teacherView })
  const fullOrder = (isAlt ? ALT_STEP_ORDER : STEP_ORDER)[orderKey]
  const order = visibleOrder(
    visibleOrder(fullOrder, highAccessSteps.practice, highAccess),
    anonymousHiddenSteps.practice,
    !anonymous,
  )
  const steps = buildSteps(stepBlueprints, order, { bigScreen, teacherView })

  // Drives side effects between steps (sidebars, dropdowns, navigation).
  const handleEvent = ({ action, index, type, status }) => {
    if (
      action === ACTIONS.CLOSE ||
      (status === STATUS.SKIPPED && runtime.run) ||
      status === STATUS.FINISHED
    ) {
      dispatch(stopTour())
      return
    }
    const isNotFound = type === EVENTS.TARGET_NOT_FOUND
    if (!isNotFound && type !== EVENTS.STEP_AFTER && type !== EVENTS.STEP_AFTER_HOOK) return

    const currentId = order[index]
    const nextIndex = index + (action === ACTIONS.PREV ? -1 : 1)

    const opensSidebar = syncLeftSidebar(dispatch, currentId, order[nextIndex])

    // Advance (or rewind) the tour after `delay`, or the sidebar's slide-in if longer; resizes.
    const advance = (delay = 0) => {
      const wait = Math.max(delay, opensSidebar ? SIDEBAR_SLIDE_MS : 0)
      const next = () => {
        dispatch(handleNextTourStep(nextIndex))
        triggerResize()
      }
      if (wait > 0) setTimeout(next, wait)
      else next()
    }

    if (isNotFound) {
      advance()
      return
    }

    if (!isAlt && bigScreen) {
      if (currentId === 'welcomeDesktop') {
        // The topics step points into the helper sidebar; wait out its slide-in.
        dispatch(setHelperSidebarOpen(true))
        advance(400)
        return
      }
      if (currentId === 'translations') {
        dispatch({ type: 'SHOW_PRACTICE_DROPDOWN' })
        advance(400)
        return
      }
      if (currentId === 'storyAction') {
        dispatch({ type: 'CLOSE_PRACTICE_DROPDOWN' })
        if (!teacherView) {
          const newPath = location.pathname.replace(/\/(preview|review)\/?$/, '/')
          navigate(`${newPath}practice/`)
          setTimeout(triggerResize, 4000)
        }
      }
    } else if (!isAlt && !bigScreen) {
      if (currentId === 'translationsMobile') {
        dispatch({ type: 'SHOW_PRACTICE_DROPDOWN' })
        advance(400)
        return
      }
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
