/* eslint-disable no-unused-vars */
import React from 'react'
import { useDispatch } from 'react-redux'
import { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { FormattedMessage } from 'react-intl'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { handleNextTourStep, stopTour } from 'Utilities/redux/tourReducer'
import { tourSign, getSafeTarget, triggerResize } from './utils'
import JoyrideShared from './JoyrideShared'
import useTourRuntime from './useTourRuntime'

const CHART_ACTION_BY_INDEX = {
  0: 'SET_TIMELINE_CHART',
  2: 'SET_VOCABULARY_CHART',
  3: 'SET_GRAMMAR_CHART',
  4: 'SET_EXERCISE_HISTORY_CHART',
  5: 'SET_TEST_HISTORY_CHART',
  7: 'SET_TIMELINE_CHART',
}

const ProgressTour = () => {
  const dispatch = useDispatch()
  const { isActive, run, stepIndex, tourKey, continuous, bigScreen } = useTourRuntime('progress')

  if (!isActive) return null

  const desktopSteps = [
    {
      target: '.progress-button',
      title: <FormattedMessage id="Welcome to the Progress page" />,
      content: (
        <div>
          <FormattedHTMLMessage id="progress-tour-welcome-message" />
          <div>{tourSign()}</div>
        </div>
      ),
      skipBeacon: true,
    },
    {
      target: '.progress-tour-timeline-button',
      title: <FormattedMessage id="progress-timeline" />,
      content: <FormattedHTMLMessage id="timeline-explanation" />,
    },
    {
      target: '.date-pickers-container',
      title: <FormattedMessage id="Dates" />,
      content: (
        <div>
          <FormattedHTMLMessage id="progress-tour-dates-message" />
        </div>
      ),
      placement: 'left',
    },
    {
      target: '.progress-tour-vocabulary-button',
      title: <FormattedMessage id="vocabulary-view" />,
      content: <FormattedHTMLMessage id="vocabulary-view-explanation" />,
    },
    {
      target: '.progress-tour-grammar-button',
      title: <FormattedMessage id="hex-map" />,
      content: <FormattedMessage id="hex-map-explanation" />,
    },
    {
      target: '.progress-tour-exercise-history-button',
      title: <FormattedMessage id="exercise-history" />,
      content: <FormattedMessage id="exercise-history-explanation" />,
    },
    {
      target: '.progress-tour-test-history-button',
      title: <FormattedMessage id="Test History" />,
      content: <FormattedMessage id="test-history-explanation" />,
    },
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

  const mobileSteps = [
    {
      target: '.sidebar-profile-button',
      title: <FormattedMessage id="Welcome to the Progress page" />,
      content: (
        <div>
          <FormattedHTMLMessage id="progress-tour-welcome-message" />
          <div>{tourSign()}</div>
        </div>
      ),
      skipBeacon: true,
      placement: 'right',
    },
    {
      target: '.progress-page-graph-cont',
      title: <FormattedMessage id="Timeline" />,
      content: <FormattedHTMLMessage id="timeline-explanation" />,
    },
    {
      target: '.date-pickers-container',
      title: <FormattedMessage id="Dates" />,
      content: (
        <div>
          <FormattedHTMLMessage id="progress-tour-dates-message" />
        </div>
      ),
      placement: 'left',
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
      placement: 'top-end',
      placementBeacon: 'left',
    },
  ]

  const baseSteps = bigScreen ? desktopSteps : mobileSteps
  const steps = baseSteps.map(step => ({ ...step, target: getSafeTarget(step.target) }))

  const handleEvent = ({ action, index, type, status }) => {
    if (
      action === ACTIONS.CLOSE ||
      (status === STATUS.SKIPPED && run) ||
      status === STATUS.FINISHED
    ) {
      dispatch(stopTour())
      return
    }
    if (type === EVENTS.TARGET_NOT_FOUND) {
      dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
      return
    }
    if (type !== EVENTS.STEP_AFTER && type !== EVENTS.STEP_AFTER_HOOK) return

    if (bigScreen) {
      dispatch({ type: 'CLOSE_PROFILE_DROPDOWN' })
      const chartAction = CHART_ACTION_BY_INDEX[index]
      if (chartAction) dispatch({ type: chartAction })
      dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
      return
    }

    // Mobile: index 2 needs an extra resize tick before advancing.
    if (index === 2) {
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
      stepIndex={stepIndex}
      run={run}
      tourKey={tourKey}
      continuous={continuous}
      onEvent={handleEvent}
    />
  )
}

export default ProgressTour