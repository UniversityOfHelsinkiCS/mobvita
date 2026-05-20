/* eslint-disable no-unused-vars */
import React from 'react'
import { useDispatch } from 'react-redux'
import { ACTIONS, STATUS } from 'react-joyride'
import { stopTour } from 'Utilities/redux/tourReducer'
import { buildSteps, resolveOrderKey } from '../utils'
import { stepBlueprints, STEP_ORDER } from '../steps/anonymousProgressSteps'
import JoyrideShared from '../JoyrideShared'
import useTourRuntime from '../useTourRuntime'

// One-step tour on the Progress page for logged-out users.
const AnonymousProgressTour = () => {
  const dispatch = useDispatch()
  const { isActive, run, stepIndex, tourKey, continuous, teacherView, bigScreen } =
    useTourRuntime('progress-anonymous')

  if (!isActive) return null

  const orderKey = resolveOrderKey({ bigScreen, teacherView })
  const steps = buildSteps(stepBlueprints, STEP_ORDER[orderKey], { bigScreen, teacherView })

  // Single step; just stop the tour on close/skip/finish.
  const handleEvent = ({ action, status }) => {
    if (action === ACTIONS.CLOSE || status === STATUS.SKIPPED || status === STATUS.FINISHED) {
      dispatch(stopTour())
    }
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

export default AnonymousProgressTour
