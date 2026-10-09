/* eslint-disable no-unused-vars */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { tourSign } from '../utils'
import { libraryTargets } from './stepOrders'
import { endStepBlueprints } from './endSteps'

// Step blueprints for the Library tour. Targets/copy that vary by role or
// screen size are blueprints implemented as functions of the context.
export const stepBlueprints = {
  ...endStepBlueprints,
  welcome: {
    target: libraryTargets.welcome,
    title: <FormattedMessage id="Welcome to the Library page" />,
    content: (
      <div>
        <FormattedHTMLMessage id="library-tour-welcome-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'center',
    skipBeacon: true,
  },
  story: {
    target: libraryTargets.story,
    title: <FormattedMessage id="Story" />,
    content: (
      <div>
        <FormattedHTMLMessage id="library-tour-story-message" />
      </div>
    ),
    placement: 'top',
    skipBeacon: true,
  },
  stars: {
    target: libraryTargets.stars,
    title: <FormattedMessage id="Difficulty stars" />,
    content: (
      <div>
        <FormattedHTMLMessage id="library-tour-stars-message" />
      </div>
    ),
    skipBeacon: true,
    placement: 'top',
    placementBeacon: 'left',
  },
  practiceOrPreview: ({ teacherView }) => ({
    target: libraryTargets.practiceOrPreview,
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
  }),
  review: {
    target: libraryTargets.review,
    title: <FormattedMessage id="review" />,
    content: (
      <div>
        <FormattedHTMLMessage id="library-tour-review-message" />
      </div>
    ),
    placement: 'top',
    placementBeacon: 'left',
  },
}

export { libraryOrder as STEP_ORDER } from './stepOrders'
