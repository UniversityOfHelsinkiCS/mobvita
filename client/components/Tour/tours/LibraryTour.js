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
import { libraryTargets } from '../steps/stepOrders'
import JoyrideShared from '../JoyrideShared'
import useTourRuntime from '../useTourRuntime'

// A folder the tour can open to reach stories (not the "back" card, not an empty folder).
const OPENABLE_FOLDER =
  '.library-folder-card:not(.library-folder-card-back):not(.library-folder-card-empty)'

// Opens folders until a story card shows (libraries often hold stories only in folders), then
// calls `done`; gives up after ~5s so an empty library just skips the story steps.
const revealStoryCard = (done, attemptsLeft = 20) => {
  if (document.querySelector(libraryTargets.story) || attemptsLeft === 0) {
    done()
    return
  }
  document.querySelector(OPENABLE_FOLDER)?.click()
  setTimeout(() => revealStoryCard(done, attemptsLeft - 1), 250)
}

// Library tour: reveals a story card, opens the story modal after the stars step, then closes it
// and opens the sidebar for the end step. Teachers get an extra review step.
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

    // The story steps need a story card; open folders until one shows.
    if (currentId === 'welcome' && action !== ACTIONS.PREV) {
      revealStoryCard(() => advance(100))
      return
    }

    // After the stars step open the story modal so its in-modal targets exist.
    if (currentId === 'stars' && action !== ACTIONS.PREV) {
      const trigger = document.querySelector('.tour-library-open-story, .story-item-dots')
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
