/* eslint-disable no-unused-vars */
import React from 'react'
import { useDispatch } from 'react-redux'
import { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { handleNextTourStep, stopTour } from 'Utilities/redux/tourReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { buildSteps, resolveOrderKey, triggerResize } from '../utils'
import { stepBlueprints, STEP_ORDER, CHART_ACTION_BY_STEP } from '../steps/progressSteps'
import JoyrideShared from '../JoyrideShared'
import useTourRuntime from '../useTourRuntime'

// End steps point at the tour button inside the left sidebar.
const END_STEPS = ['desktopEnd', 'mobileEnd']

// Progress tour: each desktop step swaps the chart via `CHART_ACTION_BY_STEP`; the end step opens
// the sidebar. Mobile uses a shorter list.
const ProgressTour = () => {
  const dispatch = useDispatch()
  const { isActive, run, stepIndex, tourKey, continuous, teacherView, bigScreen } =
    useTourRuntime('progress')

  if (!isActive) return null

  const orderKey = resolveOrderKey({ bigScreen, teacherView })
  const order = STEP_ORDER[orderKey]
  const steps = buildSteps(stepBlueprints, order, { bigScreen, teacherView })

  // Swaps the chart, opens the sidebar for the end step, and delays steps whose layout is moving.
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

    // Open the sidebar entering an end step, close it when stepping back out of one.
    const opensSidebar = END_STEPS.includes(order[nextIndex])
    if (opensSidebar) dispatch(sidebarSetOpen(true))
    else if (END_STEPS.includes(currentId)) dispatch(sidebarSetOpen(false))

    const advance = (delay = 0) => {
      if (!delay) {
        dispatch(handleNextTourStep(nextIndex))
        return
      }
      setTimeout(() => {
        dispatch(handleNextTourStep(nextIndex))
        triggerResize()
      }, delay)
    }

    if (bigScreen && !isNotFound) {
      dispatch({ type: 'CLOSE_PROFILE_DROPDOWN' })
      const chartAction = CHART_ACTION_BY_STEP[currentId]
      if (chartAction) dispatch({ type: chartAction })
    }

    // Wait out the sidebar slide-in, and on mobile the layout shift after the dates step.
    if (opensSidebar) advance(400)
    else if (!bigScreen && !isNotFound && currentId === 'dates') advance(500)
    else advance()
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
