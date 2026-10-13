/* eslint-disable no-unused-vars */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { tourSign } from '../utils'
import { endTargets } from './stepOrders'

// Shared last step: points at the tour button in the left sidebar, which the tours open for it.
const tourEnd = {
  target: endTargets.desktopEnd,
  title: <FormattedMessage id="Tour end" />,
  content: (
    <div>
      <FormattedHTMLMessage id="tour-end-message" />
      <div>{tourSign()}</div>
    </div>
  ),
  placement: 'right',
  skipBeacon: true,
  styles: { options: { zIndex: 10000 } },
}

// Spread into a tour's `stepBlueprints`; desktop and mobile end the same way.
export const endStepBlueprints = { desktopEnd: tourEnd, mobileEnd: tourEnd }
