/* eslint-disable no-unused-vars */
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { setHelperSidebarOpen } from 'Utilities/redux/helperSidebarReducer'
import { handleNextTourStep, stopTour } from 'Utilities/redux/tourReducer'
import { confettiRain } from 'Utilities/common'
import { buildSteps, resolveOrderKey, triggerResize } from '../utils'
import { stepBlueprints, STEP_ORDER } from '../steps/homeSteps'
import JoyrideShared from '../JoyrideShared'
import useTourRuntime from '../useTourRuntime'

// Steps that need the chatbot (helper sidebar) open, and the ones pointing into the left sidebar.
const CHATBOT_STEPS = ['chatbot', 'help']
const SIDEBAR_STEPS = ['help', 'beginPracticing']

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

  // Opens/closes the chatbot and left sidebar for step `toId`; true if one of them slides in.
  const syncPanels = (fromId, toId) => {
    let slidesIn = false
    const chatbotNext = CHATBOT_STEPS.includes(toId)
    if (CHATBOT_STEPS.includes(fromId) !== chatbotNext) {
      dispatch(setHelperSidebarOpen(chatbotNext))
      slidesIn = chatbotNext
    }
    const sidebarNext = SIDEBAR_STEPS.includes(toId)
    if (SIDEBAR_STEPS.includes(fromId) !== sidebarNext) {
      dispatch(sidebarSetOpen(sidebarNext))
      slidesIn = slidesIn || sidebarNext
    }
    return slidesIn
  }

  // Shows step `nextIndex` after a panel slide-in, so Joyride measures the panel's final position.
  const advanceAfterSlide = nextIndex =>
    setTimeout(() => {
      dispatch(handleNextTourStep(nextIndex))
      triggerResize()
    }, 400)

  // Per-step side effects: sidebar and chatbot open/close, navigation back to /home,
  // skipping addNewStories without topics, and the mobile confetti burst.
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
    const currentId = order[index]
    const nextIndex = index + (action === ACTIONS.PREV ? -1 : 1)

    // A skipped step still has to open/close the panels for the step after it.
    if (type === EVENTS.TARGET_NOT_FOUND) {
      if (syncPanels(currentId, order[nextIndex])) advanceAfterSlide(nextIndex)
      else dispatch(handleNextTourStep(nextIndex))
      return
    }
    if (type !== EVENTS.STEP_AFTER && type !== EVENTS.STEP_AFTER_HOOK) return

    if (syncPanels(currentId, order[nextIndex])) {
      advanceAfterSlide(nextIndex)
      return
    }

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

      dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
      return
    }

    // Mobile flow.
    if (currentId === 'welcome') {
      if (!location.pathname.includes('/home')) navigate('/home')
    } else if (currentId === 'library') {
      // Mini celebration on the library step.
      ;[0, 0, 400, 600, 800].forEach(delay => setTimeout(confettiRain, delay))
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
