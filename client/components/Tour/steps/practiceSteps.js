/* eslint-disable no-unused-vars */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { tourSign } from '../utils'
import { practiceTargets } from './stepOrders'
import { endStepBlueprints } from './endSteps'

// In-practice targets load after the snippet and may be scrolled away on a long story: wait for
// them, and scroll to them clear of the fixed navbar (tours otherwise skip scrolling).
const PRACTICE_VIEW_OPTIONS = { targetWaitTimeout: 8000, skipScroll: false, scrollOffset: 80 }

// Step blueprints for the Practice tour. Covers desktop + mobile and the
// in-practice-view portion that the `practice-alt` tour replays.
export const stepBlueprints = {
  ...endStepBlueprints,
  welcomeDesktop: {
    target: practiceTargets.welcomeDesktop,
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
    target: practiceTargets.topics,
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
    target: practiceTargets.translations,
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
          target: practiceTargets.storyAction,
          title: <FormattedMessage id="practice-tour-edit-delete-title" />,
          content: (
            <div>
              <FormattedHTMLMessage id="practice-tour-edit-delete-message" />
            </div>
          ),
          skipBeacon: true,
        }
      : {
          target: practiceTargets.storyAction,
          title: <FormattedMessage id="Start Practicing" />,
          content: (
            <div>
              <FormattedHTMLMessage id="practice-tour-start-practice-message" />
            </div>
          ),
          skipBeacon: true,
        },
  exerciseBox: {
    ...PRACTICE_VIEW_OPTIONS,
    target: practiceTargets.exerciseBox,
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
    ...PRACTICE_VIEW_OPTIONS,
    target: practiceTargets.exercise,
    title: <FormattedMessage id="Exercise" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-exercise-message" />
      </div>
    ),
    skipBeacon: true,
  },
  checkAnswers: {
    ...PRACTICE_VIEW_OPTIONS,
    target: practiceTargets.checkAnswers,
    title: <FormattedMessage id="check-answer" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-check-answers-message" />
      </div>
    ),
    skipBeacon: true,
  },
  progressBar: {
    ...PRACTICE_VIEW_OPTIONS,
    target: practiceTargets.progressBar,
    title: <FormattedMessage id="Progress bar" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-progress-message" />
      </div>
    ),
    skipBeacon: true,
  },
  eloScore: {
    target: practiceTargets.eloScore,
    title: <FormattedMessage id="ELO score" />,
    content: (
      <div>
        <FormattedHTMLMessage id="explanations-popup-story-elo" />
      </div>
    ),
  },
  welcomeMobile: {
    target: practiceTargets.welcomeMobile,
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
    target: practiceTargets.translationsMobile,
    title: <FormattedMessage id="Translations" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-mobile-translations-message" />
      </div>
    ),
    skipBeacon: true,
  },
  startPracticeMobile: {
    target: practiceTargets.startPracticeMobile,
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
