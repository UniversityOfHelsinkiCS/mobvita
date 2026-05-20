/* eslint-disable no-unused-vars */
import React from 'react'
import { useDispatch } from 'react-redux'
import { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { handleNextTourStep, stopTour } from 'Utilities/redux/tourReducer'
import { buildSteps, resolveOrderKey, triggerResize } from '../utils'
import { stepBlueprints, STEP_ORDER, CHART_ACTION_BY_STEP } from '../steps/progressSteps'
import JoyrideShared from '../JoyrideShared'
import useTourRuntime from '../useTourRuntime'

// Tour for the Progress view (authenticated users). Each desktop step swaps
// the visible chart via `CHART_ACTION_BY_STEP`. Mobile uses a shorter list.
const ProgressTour = () => {
  const dispatch = useDispatch()
  const { isActive, run, stepIndex, tourKey, continuous, teacherView, bigScreen } =
    useTourRuntime('progress')

  if (!isActive) return null

  const orderKey = resolveOrderKey({ bigScreen, teacherView })
  const order = STEP_ORDER[orderKey]
  const steps = buildSteps(stepBlueprints, order, { bigScreen, teacherView })

  // Closes the profile dropdown, swaps the chart, and on mobile delays the
  // date-pickers step for layout stability.
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

    const currentId = order[index]

    if (bigScreen) {
      dispatch({ type: 'CLOSE_PROFILE_DROPDOWN' })
      const chartAction = CHART_ACTION_BY_STEP[currentId]
      if (chartAction) dispatch({ type: chartAction })
      dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
      return
    }

    if (currentId === 'dates') {
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
