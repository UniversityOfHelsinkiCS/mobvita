import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  getCurrentSnippet,
  getNextSnippet,
  addToPrevious,
  setPrevious,
  resetSessionId,
  resetCurrentSnippet,
} from 'Utilities/redux/snippetsReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import 'react-simple-keyboard/build/css/index.css'
import { FormattedMessage } from 'react-intl'
import { getSelf } from 'Utilities/redux/userReducer'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import { useHistory } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import {
  setAnswers,
  clearPractice,
  clearCurrentPractice,
  setTouchedIds,
  addToAudio,
  setPreviousAnswers,
  addToOptions,
  startSnippet,
  incrementAttempts,
  setIsPaused,
  setPracticeFinished,
} from 'Utilities/redux/practiceReducer'
import {
  updateSeveralSpanAnnotationStore,
  resetAnnotations,
} from 'Utilities/redux/annotationsReducer'
import ExercisesEncouragementModal from 'Components/Encouragements/ExercisesEncouragementModal'
import SnippetActions from './SnippetActions'
import PracticeText from './PracticeText'

const CurrentSnippet = ({ storyId, handleInputChange, timer }) => {
  const [exerciseCount, setExerciseCount] = useState(0)
  const practiceForm = useRef(null)
  const dispatch = useDispatch()
  const [openEncouragement, setOpenEncouragement] = useState(true)
  const snippets = useSelector(({ snippets }) => snippets)
  const answersPending = useSelector(({ snippets }) => snippets.answersPending)
  const { practiceFinished, snippetFinished, isNewSnippet, attempt, willPause, isPaused } =
    useSelector(({ practice }) => practice)
  const userData = useSelector(state => state.user.data.user)
  const learningLanguage = useSelector(learningLanguageSelector)
  const history = useHistory()
  const isControlledStory = history.location.pathname.includes('controlled-practice')
  const sessionId = snippets?.sessionId ?? null

  if (!userData) {
    return
  }

  const storiesCovered = userData.stories_covered
  const vocabularySeen = userData.vocabulary_seen

  const SECONDS_PER_WRONG_EXERCISE = 20

  const currentSnippetId = () => {
    if (!snippets.focused) return -1
    const { snippetid } = snippets.focused
    return snippetid[snippetid.length - 1]
  }

  const getExerciseCount = () => {
    let count = 0
    snippets.focused.practice_snippet.forEach(word => {
      if (word.id) {
        count++
      }
    })
    return count
  }

  const setInitialAnswers = () => {
    if (snippets.focused && snippets.focused.storyid === storyId) {
      const filteredSnippet = snippets.focused.practice_snippet.filter(word => word.id)
      const initialAnswers = filteredSnippet.reduce((answerObject, currentWord) => {
        const { surface, id, ID, base, bases, listen, choices, concept, audio } = currentWord

        let usersAnswer
        if (listen || choices) {
          usersAnswer = ''
        } else {
          usersAnswer = base || bases
        }

        if (choices) {
          dispatch(addToOptions({ [ID]: choices }))
        }

        if (listen) {
          dispatch(addToAudio({ [ID]: audio }))
        }

        return {
          ...answerObject,
          [ID]: {
            correct: surface,
            users_answer: usersAnswer,
            id,
            concept,
          },
        }
      }, {})
      if (Object.keys(initialAnswers).length > 0) dispatch(setAnswers({ ...initialAnswers }))
      setExerciseCount(getExerciseCount())
      dispatch(startSnippet())
    }
  }

  const finishSnippet = () => {
    dispatch(setPreviousAnswers(currentSnippetId()))
    dispatch(addToPrevious([snippets?.focused.practice_snippet]))

    const annotationsToInitialize = []
    let currentSpan = { annotationString: '' }

    snippets.focused.practice_snippet.forEach(word => {
      if (word.annotation) {
        currentSpan.startId = word.ID
        currentSpan.endId = word.annotation[0].end_token_id
        currentSpan.annotationString += word.surface
        const annotationTexts = word.annotation.map(e => {
          return { text: e.annotation, username: e.username, uid: e.uid }
        })

        currentSpan.annotationTexts = annotationTexts

        if (word.ID === currentSpan.endId) {
          annotationsToInitialize.push(currentSpan)
          currentSpan = { annotationString: '' }
        }
      } else if (word.ID > currentSpan.startId && word.ID < currentSpan.endId) {
        currentSpan.annotationString += word.surface
      } else if (word.ID === currentSpan.endId) {
        currentSpan.annotationString += word.surface
        annotationsToInitialize.push(currentSpan)
        currentSpan = { annotationString: '' }
      }
    })

    dispatch(updateSeveralSpanAnnotationStore(annotationsToInitialize))

    dispatch(clearCurrentPractice())

    if (snippets.focused.total_num !== currentSnippetId() + 1 || practiceFinished) {
      dispatch(getNextSnippet(storyId, currentSnippetId(), isControlledStory, sessionId))
    } else {
      dispatch(setPracticeFinished(true))
    }
  }

  const focusFirstCloze = () => {
    if (practiceForm.current) {
      const { elements } = practiceForm.current
      const firstCloze = Object.entries(elements).filter(
        e => e[1].className.includes('cloze') && !e[1].className.includes('correct')
      )[0]

      if (firstCloze) firstCloze[1].focus()
    }
  }

  useEffect(() => {
    dispatch(clearPractice())
    dispatch(resetSessionId())
    dispatch(getCurrentSnippet(storyId, isControlledStory))
    dispatch(clearTranslationAction())
  }, [])

  useEffect(() => {
    const currentSnippetIsLoaded = !!snippets.focused
    if (currentSnippetIsLoaded) {
      const wasLastAttempt =
        snippets.focused.skip_second ||
        snippetFinished ||
        attempt + 1 >= snippets.focused.max_attempt

      if (wasLastAttempt && willPause) dispatch(setIsPaused(true))
      if (isNewSnippet) setInitialAnswers()
      else if (wasLastAttempt) finishSnippet()
      else {
        dispatch(incrementAttempts())

        if (isControlledStory && Math.round(timer.getTime() / 1000) > 0) {
          const numWrongAnswers = snippets.focused.practice_snippet.filter(e => e?.isWrong).length
          timer.setTime(timer.getTime() + numWrongAnswers * SECONDS_PER_WRONG_EXERCISE * 1000)
          timer.start()
        }
      }
    }

    const practiceFormIsLoaded = !!practiceForm.current?.elements
    if (practiceFormIsLoaded) {
      setTimeout(() => {
        focusFirstCloze()
      }, 100)
    }
  }, [snippets.focused])

  useEffect(() => {
    if (!answersPending) dispatch(getSelf())
  }, [answersPending])

  useEffect(() => {
    if (!snippets.pending && practiceForm.current) {
      setTimeout(() => {
        if (practiceForm.current) practiceForm.current.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    }
  }, [snippets.pending, snippets.previous])

  const startOver = async () => {
    dispatch(clearPractice())
    dispatch(resetAnnotations())
    dispatch(setPrevious([]))
    dispatch(resetCurrentSnippet(storyId, isControlledStory))
    dispatch(setPracticeFinished(false))
  }

  const handleMultiselectChange = (event, word, data) => {
    const { id, ID, surface, concept } = word
    const { value } = data

    dispatch(setTouchedIds(ID))

    const newAnswer = {
      [ID]: {
        correct: surface,
        users_answer: value,
        id,
        concept,
      },
    }
    dispatch(setAnswers(newAnswer))
  }

  if (isPaused && !practiceFinished) {
    return (
      <div
        className="bold justify-center mt-lg mb-nm"
        style={{ fontSize: '1.2em', letterSpacing: '1px', justifyContent: 'center' }}
      >
        <FormattedMessage id="paused" />
      </div>
    )
  }

  return (
    <div>
      <form ref={practiceForm}>
        {!practiceFinished ? (
          <div style={{ width: '100%' }}>
            <div
              className="practice-container"
              style={getTextStyle(learningLanguage)}
              data-cy="practice-view"
            >
              <PracticeText
                handleAnswerChange={handleInputChange}
                handleMultiselectChange={handleMultiselectChange}
              />
            </div>
            <SnippetActions
              storyId={storyId}
              exerciseCount={exerciseCount}
              isControlledStory={isControlledStory}
              timerValue={Math.round(timer.getTime() / 1000)}
            />
          </div>
        ) : (
          <div>
            <ExercisesEncouragementModal
              open={openEncouragement}
              setOpen={setOpenEncouragement}
              storiesCovered={storiesCovered}
              vocabularySeen={vocabularySeen}
            />
            <Button variant="primary" block onClick={() => startOver()}>
              <FormattedMessage id="restart-story" />
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}

export default CurrentSnippet
