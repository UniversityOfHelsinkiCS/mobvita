/* eslint-disable no-unused-vars */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { tourSign } from '../utils'

// Step blueprints for the Library tour. Targets/copy that vary by role or
// screen size are blueprints implemented as functions of the context.
export const stepBlueprints = {
  welcome: {
    target: '.library-tour-start',
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
    target: '.tour-story-card',
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
    target: '.library-tour-difficulty-stars',
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
  practiceOrPreview: ({ bigScreen, teacherView }) => ({
    target: bigScreen
      ? '.story-detail-modal-action-button'
      : '.library-tour-mobile-practice-button',
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
    target: '.library-tour-modal-review-button',
    title: <FormattedMessage id="review" />,
    content: (
      <div>
        <FormattedHTMLMessage id="library-tour-review-message" />
      </div>
    ),
    placement: 'top',
    placementBeacon: 'left',
  },
  desktopEnd: {
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
  mobileEnd: {
    target: '.tour-mobile-start-button',
    title: <FormattedMessage id="Tour end" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-end-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'right',
    placementBeacon: 'left',
    styles: { options: { zIndex: 10000 } },
  },
}

export { libraryOrder as STEP_ORDER } from './stepOrders'
