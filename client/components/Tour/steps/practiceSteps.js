/* eslint-disable no-unused-vars */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { tourSign } from '../utils'
import { endStepBlueprints } from './endSteps'

// Step blueprints for the Practice tour. Covers desktop + mobile and the
// in-practice-view portion that the `practice-alt` tour replays.
export const stepBlueprints = {
  ...endStepBlueprints,
  welcomeDesktop: {
    target: '.tour-practice-welcome',
    title: <FormattedMessage id="Welcome to the Practice mode" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-welcome-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'center',
    skipBeacon: true,
  },
  // The "All topics in text" control at the top of the helper sidebar.
  topics: {
    target: '.tour-practice-topics',
    title: <FormattedMessage id="Story Topics Box" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-topics-message" />
      </div>
    ),
    skipBeacon: true,
    placement: 'left',
  },
  translations: {
    target: '.tour-practice-translations',
    title: <FormattedMessage id="Translations" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-translations-message" />
      </div>
    ),
    skipBeacon: true,
    placement: 'left',
  },
  // Same slot, two faces: teachers see edit/delete, students see "start".
  storyAction: ({ teacherView }) =>
    teacherView
      ? {
          target: '.tour-practice-edit-delete',
          title: <FormattedMessage id="practice-tour-edit-delete-title" />,
          content: (
            <div>
              <FormattedHTMLMessage id="practice-tour-edit-delete-message" />
            </div>
          ),
          skipBeacon: true,
        }
      : {
          target: '.tour-practice-start-practice',
          title: <FormattedMessage id="Start Practicing" />,
          content: (
            <div>
              <FormattedHTMLMessage id="practice-tour-start-practice-message" />
            </div>
          ),
          skipBeacon: true,
        },
  exerciseBox: {
    target: '.tour-practice-exercise-box',
    title: <FormattedMessage id="Exercises" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-exercise-box-message" />
      </div>
    ),
    skipBeacon: true,
    placement: 'right',
  },
  exercise: {
    target: '.exercise',
    title: <FormattedMessage id="Exercise" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-exercise-message" />
      </div>
    ),
    skipBeacon: true,
  },
  checkAnswers: {
    target: '.tour-practice-check-answers',
    title: <FormattedMessage id="check-answer" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-check-answers-message" />
      </div>
    ),
    skipBeacon: true,
  },
  progressBar: {
    target: '.tour-practice-progress-bar',
    title: <FormattedMessage id="Progress bar" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-progress-message" />
      </div>
    ),
    skipBeacon: true,
  },
  eloScore: {
    target: '.tour-practice-elo-score',
    title: <FormattedMessage id="ELO score" />,
    content: (
      <div>
        <FormattedHTMLMessage id="explanations-popup-story-elo" />
      </div>
    ),
  },
  welcomeMobile: {
    target: '.tour-practice-welcome',
    title: <FormattedMessage id="Welcome to the Practice mode" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-welcome-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'center',
    skipBeacon: true,
  },
  translationsMobile: {
    target: '.tour-practice-translations-mobile',
    title: <FormattedMessage id="Translations" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-mobile-translations-message" />
      </div>
    ),
    skipBeacon: true,
  },
  startPracticeMobile: {
    target: '.tour-practice-start-practice',
    title: <FormattedMessage id="Start Practicing" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-start-practice-message" />
      </div>
    ),
    skipBeacon: true,
  },
}

export { practiceOrder as STEP_ORDER, practiceAltOrder as ALT_STEP_ORDER } from './stepOrders'
