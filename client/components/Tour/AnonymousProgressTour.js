/* eslint-disable no-unused-vars */
import React from 'react'
import { useDispatch } from 'react-redux'
import { ACTIONS, STATUS } from 'react-joyride'
import { FormattedMessage } from 'react-intl'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { stopTour } from 'Utilities/redux/tourReducer'
import JoyrideShared from './JoyrideShared'
import useTourRuntime from './useTourRuntime'

const AnonymousProgressTour = () => {
  const dispatch = useDispatch()
  const { isActive, run, stepIndex, tourKey, continuous, bigScreen } =
    useTourRuntime('progress-anonymous')

  if (!isActive) return null

  const steps = [
    {
      target: bigScreen ? '.navbar-register-button' : '.sidebar-register-button',
      title: <FormattedMessage id="Welcome to the Progress page" />,
      content: (
        <div>
          <FormattedHTMLMessage id="anonymous-progress-tour-message" />
        </div>
      ),
      skipBeacon: true,
      placement: 'right',
    },
  ]

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