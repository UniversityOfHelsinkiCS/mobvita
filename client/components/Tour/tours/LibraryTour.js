/* eslint-disable no-unused-vars */
import React from 'react'
import { useDispatch } from 'react-redux'
import { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { handleNextTourStep, stopTour } from 'Utilities/redux/tourReducer'
import { buildSteps, resolveOrderKey, closeVisibleModal, triggerResize } from '../utils'
import { stepBlueprints, STEP_ORDER } from '../steps/librarySteps'
import JoyrideShared from '../JoyrideShared'
import useTourRuntime from '../useTourRuntime'

// Tour for the Library view. Opens the story modal when leaving the stars
// step and closes it before the final step. Teachers get an extra review step.
const LibraryTour = () => {
  const dispatch = useDispatch()
  const { isActive, run, stepIndex, tourKey, continuous, teacherView, bigScreen } =
    useTourRuntime('library')

  if (!isActive) return null

  const orderKey = resolveOrderKey({ bigScreen, teacherView })
  const order = STEP_ORDER[orderKey]
  const steps = buildSteps(stepBlueprints, order, { bigScreen, teacherView })

  // Drives modal open/close around the in-modal steps and a mobile delay.
  const handleEvent = ({ action, index, type, status }) => {
    if (
      action === ACTIONS.CLOSE ||
      (status === STATUS.SKIPPED && run) ||
      status === STATUS.FINISHED
    ) {
      dispatch(stopTour())
      return
    }
    if (type === EVENTS.TARGET_NOT_FOUND) return
    if (type !== EVENTS.STEP_AFTER && type !== EVENTS.STEP_AFTER_HOOK) return

    const advance = (delay = 0) => {
      const next = () => {
        dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
        triggerResize()
      }
      if (delay > 0) setTimeout(next, delay)
      else next()
    }

    const currentId = order[index]
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

    // Close the modal before the final step (lives outside the modal).
    if (currentId === lastInModalId && action !== ACTIONS.PREV) {
      if (closeVisibleModal()) {
        advance(250)
        return
      }
    }

    // Mobile practiceOrPreview needs a brief delay for layout to settle.
    if (!bigScreen && currentId === 'practiceOrPreview') {
      advance(600)
      return
    }

    advance()
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
