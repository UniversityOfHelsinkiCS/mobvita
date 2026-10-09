/* eslint-disable no-unused-vars */
import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { stopTour } from 'Utilities/redux/tourReducer'
import { homeTourViewed } from 'Utilities/redux/userReducer'
import { buildSteps, resolveOrderKey } from '../utils'
import { stepBlueprints, STEP_ORDER } from '../steps/anonymousProgressSteps'
import JoyrideShared from '../JoyrideShared'
import useTourRuntime from '../useTourRuntime'

// One-step tour on the Progress page for logged-out users; "End tour" sends them home.
const AnonymousProgressTour = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isActive, run, stepIndex, tourKey, continuous, teacherView, bigScreen } =
    useTourRuntime('progress-anonymous')

  if (!isActive) return null

  const orderKey = resolveOrderKey({ bigScreen, teacherView })
  const steps = buildSteps(stepBlueprints, STEP_ORDER[orderKey], { bigScreen, teacherView })

  // Stops the tour on close/skip or a missing target; "End tour" also takes the user home.
  const handleEvent = ({ action, status, type }) => {
    // Controlled Joyride only reports Next on the single step; that press is "End tour".
    if (type === EVENTS.STEP_AFTER && action === ACTIONS.NEXT) {
      dispatch(stopTour())
      // Mark the home tour seen first, or /home would auto-start it on arrival.
      Promise.resolve(dispatch(homeTourViewed())).finally(() => navigate('/home'))
      return
    }
    if (
      type === EVENTS.TARGET_NOT_FOUND ||
      action === ACTIONS.CLOSE ||
      status === STATUS.SKIPPED ||
      status === STATUS.FINISHED
    ) {
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
