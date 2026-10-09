/* eslint-disable no-unused-vars */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { tourSign } from '../utils'
import { endStepBlueprints } from './endSteps'

// Step blueprints for the Progress tour (authenticated users).
export const stepBlueprints = {
  ...endStepBlueprints,
  welcomeDesktop: {
    target: '.tour-progress-welcome',
    title: <FormattedMessage id="Welcome to the Progress page" />,
    content: (
      <div>
        <FormattedHTMLMessage id="progress-tour-welcome-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'center',
    skipBeacon: true,
  },
  timelineButton: {
    target: '.tour-progress-timeline-button',
    title: <FormattedMessage id="progress-timeline" />,
    content: <FormattedHTMLMessage id="timeline-explanation" />,
  },
  dates: {
    target: '.tour-progress-dates',
    title: <FormattedMessage id="Dates" />,
    content: <FormattedHTMLMessage id="progress-tour-dates-message" />
  },
  vocabulary: {
    target: '.tour-progress-vocabulary',
    title: <FormattedMessage id="vocabulary-view" />,
    content: <FormattedHTMLMessage id="vocabulary-view-explanation" />,
  },
  grammar: {
    target: '.tour-progress-grammar',
    title: <FormattedMessage id="hex-map" />,
    content: <FormattedMessage id="hex-map-explanation" />,
  },
  exerciseHistory: {
    target: '.tour-progress-exercise-history',
    title: <FormattedMessage id="exercise-history" />,
    content: <FormattedMessage id="exercise-history-explanation" />,
  },
  testHistory: {
    target: '.tour-progress-test-history',
    title: <FormattedMessage id="Test History" />,
    content: <FormattedMessage id="test-history-explanation" />,
  },
  welcomeMobile: {
    target: '.tour-progress-welcome',
    title: <FormattedMessage id="Welcome to the Progress page" />,
    content: (
      <div>
        <FormattedHTMLMessage id="progress-tour-welcome-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    skipBeacon: true,
    placement: 'center',
  },
  timelineMobile: {
    target: '.tour-progress-timeline-mobile',
    title: <FormattedMessage id="Timeline" />,
    content: <FormattedHTMLMessage id="timeline-explanation" />,
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
