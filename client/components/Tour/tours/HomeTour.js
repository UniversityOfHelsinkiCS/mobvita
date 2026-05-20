/* eslint-disable no-unused-vars */
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { handleNextTourStep, stopTour } from 'Utilities/redux/tourReducer'
import { confettiRain } from 'Utilities/common'
import { buildSteps, resolveOrderKey, triggerResize } from '../utils'
import { stepBlueprints, STEP_ORDER } from '../steps/homeSteps'
import JoyrideShared from '../JoyrideShared'
import useTourRuntime from '../useTourRuntime'

// Tour for the Home view. Steps come from `stepBlueprints` in the order
// defined by `STEP_ORDER[role+screen]`.
const HomeTour = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { isActive, run, stepIndex, tourKey, continuous, teacherView, bigScreen } =
    useTourRuntime('home')
  const lesson_topics = useSelector(state => state.metadata.lesson_topics)

  if (!isActive) return null

  const orderKey = resolveOrderKey({ bigScreen, teacherView })
  const order = STEP_ORDER[orderKey]
  const steps = buildSteps(stepBlueprints, order, { bigScreen, teacherView })
  const chatbotIndex = order.indexOf('chatbot')

  // Coordinates per-step side effects: sidebar open/close, navigation back to
  // /home, skipping addNewStories when no topics exist, toggling the chatbot
  // around its step, and the mobile confetti burst.
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

    const currentId = order[index]

    // Teacher desktop only: skip `addNewStories` when no lesson topics.
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

      if (currentId === 'welcome') {
        // Open sidebar so .tour-sidebar mounts before the next step.
        dispatch(sidebarSetOpen(true))
        setTimeout(() => {
          dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
          triggerResize()
          setTimeout(triggerResize, 50)
        }, 400)
        return
      }
      if (currentId === 'sideBar') dispatch(sidebarSetOpen(false))

      // Toggle chatbot when entering or leaving the chatbot step.
      if (index === chatbotIndex || index === chatbotIndex - 1) {
        dispatch({ type: 'TOGGLE_CHATBOT' })
      }

      dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
      return
    }

    // Mobile flow.
    if (currentId === 'welcome') {
      if (!location.pathname.includes('/home')) navigate('/home')
      dispatch(sidebarSetOpen(true))
    } else if (currentId === 'sideBar') {
      setTimeout(() => {
        dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
      }, 600)
      return
    } else if (currentId === 'library') {
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
