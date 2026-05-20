/* eslint-disable no-unused-vars */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'

// Step blueprints for the anonymous (logged-out) Progress tour.
export const stepBlueprints = {
  register: ({ bigScreen }) => ({
    target: bigScreen ? '.navbar-register-button' : '.sidebar-register-button',
    title: <FormattedMessage id="Welcome to the Progress page" />,
    content: (
      <div>
        <FormattedHTMLMessage id="anonymous-progress-tour-message" />
      </div>
    ),
    skipBeacon: true,
    placement: 'right',
  }),
}

export { anonymousProgressOrder as STEP_ORDER } from './stepOrders'
