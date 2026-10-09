/* eslint-disable no-unused-vars */
import React from 'react'
import { FormattedMessage } from 'react-intl'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { tourSign } from '../utils'
import { lessonsTargets } from './stepOrders'
import { endStepBlueprints } from './endSteps'

// Step blueprints for the Lessons tour.
export const stepBlueprints = {
  ...endStepBlueprints,
  welcome: {
    target: lessonsTargets.welcome,
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
    target: lessonsTargets.lessonStartButton,
    title: <FormattedMessage id="lesson-tour-start-button-title" />,
    content: (
      <div>
        <FormattedHTMLMessage id="lesson-tour-start-button-message" />
      </div>
    ),
    skipBeacon: true,
  },
  lessonSetupButton: {
    target: lessonsTargets.lessonSetupButton,
    title: <FormattedMessage id="lesson-tour-setup-button-title" />,
    content: (
      <div>
        <FormattedHTMLMessage id="lesson-tour-setup-button-message" />
      </div>
    ),
    skipBeacon: true,
  },
  storyTopic: {
    target: lessonsTargets.storyTopic,
    title: <FormattedMessage id="Lesson setup" />,
    content: (
      <div>
        <FormattedHTMLMessage id="lesson-story-topic-message" />
      </div>
    ),
    skipBeacon: true,
  },
  // The vocabulary difficulty slider shown on setup step 1.
  vocab: {
    target: lessonsTargets.vocab,
    title: <FormattedMessage id="Lesson vocab" />,
    content: (
      <div>
        <FormattedHTMLMessage id="lesson-vocab-diff-message" />
      </div>
    ),
    skipBeacon: true,
  },
  topic: {
    target: lessonsTargets.topic,
    title: <FormattedMessage id="Lesson topic" />,
    content: (
      <div>
        <FormattedHTMLMessage id="lesson-topic-message" />
      </div>
    ),
    skipBeacon: true,
  },
  customGrammar: ({ bigScreen }) => ({
    target: lessonsTargets.customGrammar,
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
    target: lessonsTargets.levelTitle,
    title: <FormattedMessage id="Level title" />,
    content: (
      <div>
        <FormattedHTMLMessage id="level-title-message" />
      </div>
    ),
    skipBeacon: true,
  },
  grammarTopics: {
    target: lessonsTargets.grammarTopics,
    title: <FormattedMessage id="Grammar topics" />,
    content: (
      <div>
        <FormattedHTMLMessage id="grammar-topics-message" />
      </div>
    ),
    skipBeacon: true,
  },
  performance: {
    target: lessonsTargets.performance,
    title: <FormattedMessage id="Grammar performance" />,
    content: (
      <div>
        <FormattedHTMLMessage id="grammar-performance-message" />
      </div>
    ),
    skipBeacon: true,
  },
  resetLesson: {
    target: lessonsTargets.resetLesson,
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
    target: lessonsTargets.practiceLesson,
    title: <FormattedMessage id="Practice lesson" />,
    content: (
      <div>
        <FormattedHTMLMessage id="practice-lesson-message" />
      </div>
    ),
    skipBeacon: true,
  },
}

export { lessonsOrder as STEP_ORDER } from './stepOrders'
