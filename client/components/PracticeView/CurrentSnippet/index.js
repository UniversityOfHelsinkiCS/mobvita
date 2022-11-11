import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  getCurrentSnippet,
  getNextSnippet,
  addToPrevious,
  setPrevious,
  resetSessionId,
  resetCurrentSnippet,
  initEloHearts,
  clearEloHearts,
} from 'Utilities/redux/snippetsReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import { openEncouragement } from 'Utilities/redux/encouragementsReducer'
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

const CurrentSnippet = ({ storyId, handleInputChange, timer, numSnippets, isLesson }) => {
  const [exerciseCount, setExerciseCount] = useState(0)
  const practiceForm = useRef(null)
  const dispatch = useDispatch()
  const { enable_recmd } = useSelector(({ user }) => user.data.user)
  const snippets = useSelector(({ snippets }) => snippets)
  const { open } = useSelector(({ encouragement }) => encouragement)
  const answersPending = useSelector(({ snippets }) => snippets.answersPending)
  const { lessons } = useSelector(({ lessons }) => lessons)
  const {
    practiceFinished,
    snippetFinished,
    isNewSnippet,
    attempt,
    willPause,
    isPaused,
    previousAnswers,
  } = useSelector(({ practice }) => practice)
  const userData = useSelector(state => state.user.data.user)
  const learningLanguage = useSelector(learningLanguageSelector)
  const history = useHistory()
  const isControlledStory = history.location.pathname.includes('controlled-practice')
  const exerciseMode = history.location.pathname.includes('listening') ? 'listening' : 'grammar'
  const sessionId = snippets?.sessionId ?? null
  const [initRender, setInitRender] = useState(false)
  // const [openEncouragement, setOpenEncouragement] = useState(true)
  if (!userData) {
    return
  }
  const { incomplete, loading } = useSelector(({ incomplete }) => ({
    incomplete: incomplete.data,
    loading: incomplete.pending,
  }))

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
        const {
          surface,
          id,
          ID,
          base,
          bases,
          listen,
          choices,
          concept,
          audio,
          sentence_id,
          snippet_id,
        } = currentWord

        let usersAnswer
        if (listen || choices) {
          usersAnswer = ''
        } else {
          usersAnswer = base || bases
        }

        if (choices) {
          dispatch(addToOptions({ [`${ID}-${id}`]: choices }))
        }

        if (listen) {
          dispatch(addToAudio({ [`${ID}-${id}`]: audio }))
        }

        return {
          ...answerObject,
          [`${ID}-${id}`]: {
            correct: surface,
            users_answer: usersAnswer,
            id,
            concept,
            sentence_id,
            snippet_id,
          },
        }
      }, {})
      if (Object.keys(initialAnswers).length > 0) dispatch(setAnswers({ ...initialAnswers }))
      // dispatch(clearEloHearts())
      setExerciseCount(getExerciseCount())
      dispatch(startSnippet())
      /*
      if (snippets?.focused?.practice_snippet) {
        snippets.focused.practice_snippet.forEach(word => (
          word.surface !== '\n\n' && word.id && !word.listen && dispatch(initEloHearts(word.ID))
        ))
      }
      */
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
      dispatch(
        getNextSnippet(storyId, currentSnippetId(), isControlledStory, sessionId, exerciseMode)
      )
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
    dispatch(getCurrentSnippet(storyId, isControlledStory, exerciseMode))
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

  useEffect(() => {
    if (practiceFinished) {
      dispatch(openEncouragement())
    }
  }, [practiceFinished])

  const startOver = async () => {
    dispatch(clearPractice())
    dispatch(resetAnnotations())
    dispatch(setPrevious([]))
    dispatch(resetCurrentSnippet(storyId, isControlledStory, exerciseMode))
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
              exerciseMode={exerciseMode}
              timerValue={Math.round(timer.getTime() / 1000)}
              numSnippets={numSnippets}
            />
          </div>
        ) : (
          <div>
            <ExercisesEncouragementModal
              open={open}
              enable_recmd={enable_recmd}
              storiesCovered={storiesCovered}
              vocabularySeen={vocabularySeen}
              incompleteStories={incomplete}
              loading={loading}
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
