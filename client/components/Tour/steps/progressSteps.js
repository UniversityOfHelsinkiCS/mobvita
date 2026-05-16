/* eslint-disable no-unused-vars */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { tourSign } from '../utils'

// Step blueprints for the Progress tour (authenticated users).
export const stepBlueprints = {
  welcomeDesktop: {
    target: '.progress-button',
    title: <FormattedMessage id="Welcome to the Progress page" />,
    content: (
      <div>
        <FormattedHTMLMessage id="progress-tour-welcome-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    skipBeacon: true,
  },
  timelineButton: {
    target: '.progress-tour-timeline-button',
    title: <FormattedMessage id="progress-timeline" />,
    content: <FormattedHTMLMessage id="timeline-explanation" />,
  },
  dates: {
    target: '.date-pickers-container',
    title: <FormattedMessage id="Dates" />,
    content: (
      <div>
        <FormattedHTMLMessage id="progress-tour-dates-message" />
      </div>
    ),
    placement: 'left',
  },
  vocabulary: {
    target: '.progress-tour-vocabulary-button',
    title: <FormattedMessage id="vocabulary-view" />,
    content: <FormattedHTMLMessage id="vocabulary-view-explanation" />,
  },
  grammar: {
    target: '.progress-tour-grammar-button',
    title: <FormattedMessage id="hex-map" />,
    content: <FormattedMessage id="hex-map-explanation" />,
  },
  exerciseHistory: {
    target: '.progress-tour-exercise-history-button',
    title: <FormattedMessage id="exercise-history" />,
    content: <FormattedMessage id="exercise-history-explanation" />,
  },
  testHistory: {
    target: '.progress-tour-test-history-button',
    title: <FormattedMessage id="Test History" />,
    content: <FormattedMessage id="test-history-explanation" />,
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
  welcomeMobile: {
    target: '.sidebar-profile-button',
    title: <FormattedMessage id="Welcome to the Progress page" />,
    content: (
      <div>
        <FormattedHTMLMessage id="progress-tour-welcome-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    skipBeacon: true,
    placement: 'right',
  },
  timelineMobile: {
    target: '.progress-page-graph-cont',
    title: <FormattedMessage id="Timeline" />,
    content: <FormattedHTMLMessage id="timeline-explanation" />,
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
    placement: 'top-end',
    placementBeacon: 'left',
  },
}

// Step id → redux action that switches the visible chart on that step.
export const CHART_ACTION_BY_STEP = {
  welcomeDesktop: 'SET_TIMELINE_CHART',
  dates: 'SET_VOCABULARY_CHART',
  vocabulary: 'SET_GRAMMAR_CHART',
  grammar: 'SET_EXERCISE_HISTORY_CHART',
  exerciseHistory: 'SET_TEST_HISTORY_CHART',
  desktopEnd: 'SET_TIMELINE_CHART',
}

export { progressOrder as STEP_ORDER } from './stepOrders'
