/* eslint-disable no-unused-vars */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { tourSign } from '../utils'

// Step blueprints for the Practice tour. Covers desktop + mobile and the
// in-practice-view portion that the `practice-alt` tour replays.
export const stepBlueprints = {
  welcomeDesktop: {
    target: '.tour-button',
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
  topics: {
    target: '.story-topics-box',
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
    target: '.combined-chatbot',
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
          target: '.practice-tour-edit-delete-story',
          title: <FormattedMessage id="practice-tour-edit-delete-title" />,
          content: (
            <div>
              <FormattedHTMLMessage id="practice-tour-edit-delete-message" />
            </div>
          ),
          skipBeacon: true,
        }
      : {
          target: '.practice-tour-start-practice-story',
          title: <FormattedMessage id="Start Practicing" />,
          content: (
            <div>
              <FormattedHTMLMessage id="practice-tour-start-practice-message" />
            </div>
          ),
          skipBeacon: true,
        },
  exerciseBox: {
    target: '.practice-container',
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
    target: '.attempt-bar',
    title: <FormattedMessage id="check-answer" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-check-answers-message" />
      </div>
    ),
    skipBeacon: true,
  },
  progressBar: {
    target: '.progress-bar-cont',
    title: <FormattedMessage id="Progress bar" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-progress-message" />
      </div>
    ),
    skipBeacon: true,
  },
  eloScore: {
    target: '.navbar-basic-item',
    title: <FormattedMessage id="ELO score" />,
    content: (
      <div>
        <FormattedHTMLMessage id="explanations-popup-story-elo" />
      </div>
    ),
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
    target: '.tour-start-finish',
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
    target: '.mobile-practice-tour-word',
    title: <FormattedMessage id="Translations" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-mobile-translations-message" />
      </div>
    ),
    skipBeacon: true,
  },
  startPracticeMobile: {
    target: '.practice-tour-start-practice-story',
    title: <FormattedMessage id="Start Practicing" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-tour-start-practice-message" />
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

export { practiceOrder as STEP_ORDER, practiceAltOrder as ALT_STEP_ORDER } from './stepOrders'
