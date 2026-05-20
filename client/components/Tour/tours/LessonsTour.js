/* eslint-disable no-unused-vars */
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ACTIONS, EVENTS, STATUS } from 'react-joyride'
import { handleNextTourStep, stopTour } from 'Utilities/redux/tourReducer'
import {
  getLessonInstance,
  setLessonInstance,
  setLessonStep,
  clearLessonInstanceState,
} from 'Utilities/redux/lessonInstanceReducer'
import { updateLibrarySelect, saveSelfIntermediate } from 'Utilities/redux/userReducer'
import { buildSteps, resolveOrderKey, closeVisibleModal, triggerResize } from '../utils'
import { stepBlueprints, STEP_ORDER } from '../steps/lessonsSteps'
import JoyrideShared from '../JoyrideShared'
import useTourRuntime from '../useTourRuntime'

// Tour for the Lessons view. Walks the setup flow; targets unmount between
// transitions, so `buildSteps` falls back to `.lesson-story-topic`.
const LessonsTour = () => {
  const dispatch = useDispatch()
  const { isActive, run, stepIndex, tourKey, continuous, teacherView, user, bigScreen } =
    useTourRuntime('lessons')
  const metaPending = useSelector(state => state.metadata.pending)
  const lesson_topics = useSelector(state => state.metadata.lesson_topics)
  const lessonPending = useSelector(state => state.lessonInstance.pending)
  const lesson = useSelector(state => state.lessonInstance.lesson)

  if (!isActive) return null

  const orderKey = resolveOrderKey({ bigScreen, teacherView })
  const order = STEP_ORDER[orderKey]
  const steps = buildSteps(stepBlueprints, order, { bigScreen, teacherView }, '.lesson-story-topic')

  // Advance (or rewind) with optional delay; always resizes for Joyride.
  const advance = (index, action, delay = 0) => {
    const next = () => {
      dispatch(handleNextTourStep(index + (action === ACTIONS.PREV ? -1 : 1)))
      triggerResize()
    }
    if (delay > 0) setTimeout(next, delay)
    else next()
  }

  // Each step drives the click that produces the DOM the next step needs.
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

    const currentId = order[index]

    if (currentId === 'welcome' && action !== ACTIONS.PREV) {
      // Students in a group library do not see the setup menu; switch.
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
        dispatch(setLessonStep(0))
        advance(index, action, 300)
      }, 300)
      return
    }

    // Step the lesson UI alongside the tour for the early setup steps.
    if (action !== ACTIONS.PREV && (currentId === 'storyTopic' || currentId === 'vocab')) {
      dispatch(setLessonStep(index))
      advance(index, action, 120)
      return
    }

    if (currentId === 'customGrammar' && action !== ACTIONS.PREV) {
      const button = document.querySelector('.lesson-tour-custom-grammar-button')
      if (button instanceof HTMLElement) {
        button.click()
        advance(index, action, 250)
        return
      }
    }

    if (currentId === 'levelTitle' && action !== ACTIONS.PREV) {
      const firstTopic = document.querySelector('.lesson-topic-item')
      if (firstTopic instanceof HTMLElement) {
        firstTopic.click()
        advance(index, action, 250)
        return
      }
    }

    // Close the grammar-topics modal before stepping outside it.
    const shouldCloseModal =
      (!teacherView && currentId === 'performance') ||
      (teacherView && currentId === 'grammarTopics')
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
