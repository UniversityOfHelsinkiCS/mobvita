/* eslint-disable no-unused-vars */
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { FormattedMessage } from 'react-intl'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import { handleNextTourStep, stopTour } from 'Utilities/redux/tourReducer'
import {
  getLessonInstance,
  setLessonInstance,
  setLessonStep,
  clearLessonInstanceState,
} from 'Utilities/redux/lessonInstanceReducer'
import { updateLibrarySelect, saveSelfIntermediate } from 'Utilities/redux/userReducer'
import { tourSign, getSafeTarget, closeVisibleModal, triggerResize } from './utils'
import JoyrideShared from './JoyrideShared'
import useTourRuntime from './useTourRuntime'

// Tour for the Lessons view. Walks the lesson setup flow (topic, vocab,
// grammar, detail modal, start). Targets unmount between transitions, so
// `getSafeTarget` falls back to the lesson container while they remount.
const LessonsTour = () => {
  const dispatch = useDispatch()
  const { isActive, run, stepIndex, tourKey, continuous, teacherView, user, bigScreen } =
    useTourRuntime('lessons')
  const metaPending = useSelector(state => state.metadata.pending)
  const lesson_topics = useSelector(state => state.metadata.lesson_topics)
  const lessonPending = useSelector(state => state.lessonInstance.pending)
  const lesson = useSelector(state => state.lessonInstance.lesson)

  if (!isActive) return null

  const sharedSteps = [
    {
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
    {
      target: '.lesson-story-topic',
      title: <FormattedMessage id="Lesson setup" />,
      content: (
        <div>
          <FormattedHTMLMessage id="lesson-story-topic-message" />
        </div>
      ),
      skipBeacon: true,
    },
    {
      target: '.lesson-vocab-slider-container',
      title: <FormattedMessage id="Lesson vocab" />,
      content: (
        <div>
          <FormattedHTMLMessage id="lesson-vocab-diff-message" />
        </div>
      ),
      skipBeacon: true,
    },
    {
      target: '.grammar-buttons-container',
      title: <FormattedMessage id="Lesson topic" />,
      content: (
        <div>
          <FormattedHTMLMessage id="lesson-topic-message" />
        </div>
      ),
      skipBeacon: true,
    },
    {
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
    },
    {
      target: '.level-content',
      title: <FormattedMessage id="Level title" />,
      content: (
        <div>
          <FormattedHTMLMessage id="level-title-message" />
        </div>
      ),
      skipBeacon: true,
    },
    {
      target: '.lesson-content',
      title: <FormattedMessage id="Grammar topics" />,
      content: (
        <div>
          <FormattedHTMLMessage id="grammar-topics-message" />
        </div>
      ),
      skipBeacon: true,
    },
    // Teachers do not see the lesson-performance step.
    ...(teacherView
      ? []
      : [
          {
            target: '.lesson-performance',
            title: <FormattedMessage id="Grammar performance" />,
            content: (
              <div>
                <FormattedHTMLMessage id="grammar-performance-message" />
              </div>
            ),
            skipBeacon: true,
          },
        ]),
    {
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
    {
      target: '.lesson-setup-start-btn',
      title: <FormattedMessage id="Practice lesson" />,
      content: (
        <div>
          <FormattedHTMLMessage id="practice-lesson-message" />
        </div>
      ),
      skipBeacon: true,
    },
    bigScreen
      ? {
          target: '.tour-button',
          title: <FormattedMessage id="Tour end" />,
          content: (
            <div>
              <FormattedHTMLMessage id="tour-end-message" />
              <div>{tourSign()}</div>
            </div>
          ),
          skipBeacon: true,
        }
      : {
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
  ]

  // Lesson targets temporarily unmount between transitions; fall back to the
  // visible container so Joyride does not crash.
  const steps = sharedSteps.map(step => ({
    ...step,
    target: getSafeTarget(step.target, '.lesson-story-topic'),
  }))

  // Advance (or rewind) the tour, optionally after a delay so DOM mutations
  // from the previous step settle; always fires a resize so Joyride
  // re-measures the new target.
  const advance = (index, action, delay = 0) => {
    const next = () => {
      dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
      triggerResize()
    }
    if (delay > 0) setTimeout(next, delay)
    else next()
  }

  // Each step drives the click that produces the DOM the next step needs:
  // open the setup, advance the lesson stepper, open the custom-grammar
  // modal, select the first topic, then close the detail modal before the
  // final outside step. Also seeds `topic_ids` when empty.
  const handleEvent = ({ action, index, type, status }) => {
    if (
      action === ACTIONS.CLOSE ||
      (status === STATUS.SKIPPED && run) ||
      status === STATUS.FINISHED
    ) {
      dispatch(stopTour())
      return
    }
    if (type === EVENTS.TARGET_NOT_FOUND) return
    if (type !== EVENTS.STEP_AFTER && type !== EVENTS.STEP_AFTER_HOOK) return

    // Ensure the lesson has at least one topic selected for downstream steps.
    if (!metaPending && !lessonPending && lesson?.topic_ids?.length === 0) {
      const firstTopic = lesson_topics?.find(t => t.target?.length > 0)?.topic_id
      if (firstTopic) dispatch(setLessonInstance({ topic_ids: [firstTopic] }))
    }

    if (index === 0 && action !== ACTIONS.PREV) {
      // Students viewing a group library do not see the LessonStartMenu;
      // switch to the private library so the setup view mounts.
      if (!teacherView && user?.last_selected_library !== 'private') {
        dispatch(updateLibrarySelect('private'))
        dispatch(saveSelfIntermediate({ last_selected_library: 'private' }))
        dispatch(clearLessonInstanceState())
        dispatch(getLessonInstance(null))
      }

      setTimeout(() => {
        const setupButton = document.querySelector('.lesson-tour-setup-button')
        if (setupButton instanceof HTMLElement) {
          setupButton.click()
          advance(index, action, 300)
          return
        }
        // Teacher / fallback path: force lesson step 0 so the topic mounts.
        dispatch(setLessonStep(0))
        advance(index, action, 300)
      }, 300)
      return
    }

    if (action !== ACTIONS.PREV && (index === 1 || index === 2)) {
      dispatch(setLessonStep(index))
      advance(index, action, 120)
      return
    }

    if (index === 4 && action !== ACTIONS.PREV) {
      const customGrammarButton = document.querySelector('.lesson-tour-custom-grammar-button')
      if (customGrammarButton instanceof HTMLElement) {
        customGrammarButton.click()
        advance(index, action, 250)
        return
      }
    }

    if (index === 5 && action !== ACTIONS.PREV) {
      const firstTopic = document.querySelector('.lesson-topic-item')
      if (firstTopic instanceof HTMLElement) {
        firstTopic.click()
        advance(index, action, 250)
        return
      }
    }

    // Close the grammar-topics modal before the next step (which lives outside it).
    const currentTarget = steps[index]?.target
    const shouldCloseModal =
      currentTarget === '.lesson-performance' ||
      (teacherView && currentTarget === '.lesson-content')
    if (shouldCloseModal && action !== ACTIONS.PREV) {
      if (closeVisibleModal()) {
        advance(index, action, 250)
        return
      }
    }

    advance(index, action)
  }

  return (
    <JoyrideShared
      steps={steps}
      stepIndex={stepIndex}
      run={run}
      tourKey={tourKey}
      continuous={continuous}
      onEvent={handleEvent}
    />
  )
}

export default LessonsTour