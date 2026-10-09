/* eslint-disable no-unused-vars */
import React from 'react'
import { useDispatch } from 'react-redux'
import { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { handleNextTourStep, stopTour } from 'Utilities/redux/tourReducer'
import {
  buildSteps,
  resolveOrderKey,
  closeVisibleModal,
  triggerResize,
  syncLeftSidebar,
  SIDEBAR_SLIDE_MS,
} from '../utils'
import { stepBlueprints, STEP_ORDER } from '../steps/librarySteps'
import JoyrideShared from '../JoyrideShared'
import useTourRuntime from '../useTourRuntime'

// Library tour: opens the story modal after the stars step, then closes it and opens the sidebar
// for the end step. Teachers get an extra review step.
const LibraryTour = () => {
  const dispatch = useDispatch()
  const { isActive, run, stepIndex, tourKey, continuous, teacherView, bigScreen } =
    useTourRuntime('library')

  if (!isActive) return null

  const orderKey = resolveOrderKey({ bigScreen, teacherView })
  const order = STEP_ORDER[orderKey]
  const steps = buildSteps(stepBlueprints, order, { bigScreen, teacherView })

  // Drives the modal and sidebar open/close around the steps that need them, plus a mobile delay.
  const handleEvent = ({ action, index, type, status }) => {
    if (
      action === ACTIONS.CLOSE ||
      (status === STATUS.SKIPPED && run) ||
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
    const sidebarDelay = opensSidebar ? SIDEBAR_SLIDE_MS : 0

    if (isNotFound) {
      // Skip the missing step instead of stalling the tour.
      if (opensSidebar) closeVisibleModal()
      setTimeout(() => dispatch(handleNextTourStep(nextIndex)), sidebarDelay)
      return
    }

    const advance = (delay = 0) => {
      const next = () => {
        dispatch(handleNextTourStep(nextIndex))
        triggerResize()
      }
      if (delay > 0) setTimeout(next, delay)
      else next()
    }

    const lastInModalId = order.includes('review') ? 'review' : 'practiceOrPreview'

    // After the stars step open the story modal so its in-modal targets exist.
    if (currentId === 'stars' && action !== ACTIONS.PREV) {
      const trigger = document.querySelector('.library-tour-open-story-modal, .story-item-dots')
      if (trigger) {
        trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        advance(350)
        return
      }
    }

    if (currentId === lastInModalId && action !== ACTIONS.PREV) {
      if (closeVisibleModal()) {
        advance(Math.max(250, sidebarDelay))
        return
      }
    }

    // Mobile practiceOrPreview needs a brief delay for layout to settle.
    if (!bigScreen && currentId === 'practiceOrPreview') {
      advance(600)
      return
    }

    advance(sidebarDelay)
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

export default LibraryTour
