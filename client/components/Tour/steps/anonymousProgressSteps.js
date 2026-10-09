/* eslint-disable no-unused-vars */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { anonymousProgressTargets } from './stepOrders'

// Step blueprints for the anonymous (logged-out) Progress tour.
export const stepBlueprints = {
  register: () => ({
    target: anonymousProgressTargets.register,
    title: <FormattedMessage id="Welcome to the Progress page" />,
    content: (
      <div>
        <FormattedHTMLMessage id="anonymous-progress-tour-message" />
      </div>
    ),
    skipBeacon: true,
    placement: 'center',
  }),
}

export { anonymousProgressOrder as STEP_ORDER } from './stepOrders'
