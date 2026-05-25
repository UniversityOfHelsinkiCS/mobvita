/* eslint-disable no-unused-vars */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { tourSign } from '../utils'

// Step blueprints for the Lessons tour.
export const stepBlueprints = {
  welcome: {
    target: '.cont-tall',
    title: <FormattedMessage id="Welcome to the Lessons mode" />,
    content: (
      <div>
        <FormattedHTMLMessage id="tour-lessons-message" />
        <div>{tourSign()}</div>
      </div>
    ),
    placement: 'center',
    skipBeacon: true,
  },
  lessonStartButton: {
    target: '.lesson-tour-start-button',
    title: <FormattedMessage id="lesson-tour-start-button-title" />,
    content: (
      <div>
        <FormattedHTMLMessage id="lesson-tour-start-button-message" />
      </div>
    ),
    skipBeacon: true,
  },
  lessonSetupButton: {
    target: '.lesson-tour-setup-button',
    title: <FormattedMessage id="lesson-tour-setup-button-title" />,
    content: (
      <div>
        <FormattedHTMLMessage id="lesson-tour-setup-button-message" />
      </div>
    ),
    skipBeacon: true,
  },
  storyTopic: {
    target: '.lesson-story-topic',
    title: <FormattedMessage id="Lesson setup" />,
    content: (
      <div>
        <FormattedHTMLMessage id="lesson-story-topic-message" />
      </div>
    ),
    skipBeacon: true,
  },
  vocab: {
    target: '.lesson-vocab-slider-container',
    title: <FormattedMessage id="Lesson vocab" />,
    content: (
      <div>
        <FormattedHTMLMessage id="lesson-vocab-diff-message" />
      </div>
    ),
    skipBeacon: true,
  },
  topic: {
    target: '.grammar-buttons-container',
    title: <FormattedMessage id="Lesson topic" />,
    content: (
      <div>
        <FormattedHTMLMessage id="lesson-topic-message" />
      </div>
    ),
    skipBeacon: true,
  },
  customGrammar: ({ bigScreen }) => ({
    target: '.lesson-tour-custom-grammar-button',
    title: bigScreen ? (
      <FormattedMessage id="lesson-tour-custom-grammar-button-topic" />
    ) : (
      <FormattedMessage id="open-custom-grammar-topics-modal" />
    ),
    content: (
      <div>
        <FormattedMessage
          id={
            bigScreen
              ? 'lesson-tour-custom-grammar-button-text'
              : 'open-custom-grammar-topics-modal'
          }
        />
      </div>
    ),
    skipBeacon: true,
  }),
  levelTitle: {
    target: '.level-content',
    title: <FormattedMessage id="Level title" />,
    content: (
      <div>
        <FormattedHTMLMessage id="level-title-message" />
      </div>
    ),
    skipBeacon: true,
  },
  grammarTopics: {
    target: '.lesson-content',
    title: <FormattedMessage id="Grammar topics" />,
    content: (
      <div>
        <FormattedHTMLMessage id="grammar-topics-message" />
      </div>
    ),
    skipBeacon: true,
  },
  performance: {
    target: '.lesson-performance',
    title: <FormattedMessage id="Grammar performance" />,
    content: (
      <div>
        <FormattedHTMLMessage id="grammar-performance-message" />
      </div>
    ),
    skipBeacon: true,
  },
  resetLesson: {
    target: '.lesson-tour-stepper',
    title: <FormattedMessage id="Reset Lesson" />,
    content: (
      <div>
        <FormattedHTMLMessage id="reset-lesson-message" />
      </div>
    ),
    skipBeacon: true,
    placement: 'left',
  },
  practiceLesson: {
    target: '.lesson-setup-start-btn',
    title: <FormattedMessage id="Practice lesson" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-lesson-message" />
      </div>
    ),
    skipBeacon: true,
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

export { lessonsOrder as STEP_ORDER } from './stepOrders'
