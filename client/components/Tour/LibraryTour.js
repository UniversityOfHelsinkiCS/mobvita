/* eslint-disable no-unused-vars */
import React from 'react'
import { useDispatch } from 'react-redux'
import { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { FormattedMessage } from 'react-intl'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { handleNextTourStep, stopTour } from 'Utilities/redux/tourReducer'
import { tourSign, getSafeTarget, closeVisibleModal, triggerResize } from './utils'
import JoyrideShared from './JoyrideShared'
import useTourRuntime from './useTourRuntime'

const LibraryTour = () => {
  const dispatch = useDispatch()
  const { isActive, run, stepIndex, tourKey, continuous, teacherView, bigScreen } =
    useTourRuntime('library')

  if (!isActive) return null

  const welcome = {
    target: '.library-tour-start',
    title: <FormattedMessage id="Welcome to the Library page" />,
    content: (
      <div>
        <FormattedHTMLMessage id="library-tour-welcome-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'center',
    skipBeacon: true,
  }

  const story = {
    target: '.tour-story-card',
    title: <FormattedMessage id="Story" />,
    content: (
      <div>
        <FormattedHTMLMessage id="library-tour-story-message" />
      </div>
    ),
    placement: 'top',
    skipBeacon: true,
  }

  const stars = {
    target: '.library-tour-difficulty-stars',
    title: <FormattedMessage id="Difficulty stars" />,
    content: (
      <div>
        <FormattedHTMLMessage id="library-tour-stars-message" />
      </div>
    ),
    skipBeacon: true,
    placement: 'top',
    placementBeacon: 'left',
  }

  // Desktop teacher/student share the same target but different copy.
  const practiceOrPreview = {
    target: bigScreen
      ? '.story-detail-modal-action-button'
      : '.library-tour-mobile-practice-button',
    title: <FormattedMessage id={teacherView ? 'preview' : 'practice'} />,
    content: (
      <div>
        <FormattedHTMLMessage
          id={teacherView ? 'library-tour-preview-text' : 'library-tour-practice-message'}
        />
      </div>
    ),
    skipBeacon: true,
    placement: 'top',
    placementBeacon: 'left',
  }

  const review = {
    target: '.library-tour-modal-review-button',
    title: <FormattedMessage id="review" />,
    content: (
      <div>
        <FormattedHTMLMessage id="library-tour-review-message" />
      </div>
    ),
    placement: 'top',
    placementBeacon: 'left',
  }

  const desktopEnd = {
    target: '.tour-button',
    title: <FormattedMessage id="Tour end" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-end-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    skipBeacon: true,
  }

  const mobileEnd = {
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
  }

  const showReview = bigScreen && teacherView
  const steps = [
    welcome,
    story,
    stars,
    practiceOrPreview,
    ...(showReview ? [review] : []),
    bigScreen ? desktopEnd : mobileEnd,
  ].map(step => ({ ...step, target: getSafeTarget(step.target) }))

  const modalLastStepIndex = showReview ? 4 : 3

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

    // Step 2 (stars) → open the story modal so the next step's button exists.
    if (index === 2 && action !== ACTIONS.PREV) {
      const trigger = document.querySelector('.library-tour-open-story-modal, .story-item-dots')
      if (trigger) {
        trigger.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        setTimeout(() => {
          dispatch(handleNextTourStep(index + 1))
          triggerResize()
        }, 350)
        return
      }
    }

    // After the last in-modal step, close the modal before advancing.
    if (index === modalLastStepIndex && action !== ACTIONS.PREV) {
      if (closeVisibleModal()) {
        setTimeout(() => {
          dispatch(handleNextTourStep(index + 1))
          triggerResize()
        }, 250)
        return
      }
    }

    // Mobile step 3 needs a brief delay for layout to settle.
    if (!bigScreen && index === 3) {
      setTimeout(() => {
        dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
        triggerResize()
      }, 600)
      return
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

export default LibraryTour