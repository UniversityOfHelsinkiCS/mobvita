import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  getCurrentSnippet,
  cacheStorySnippet,
  cacheLessonSnippet,
  getNextSnippetFromCache,
  dropCachedSnippet,
  resetCachedSnippets,
  addToPrevious,
  setPrevious,
  resetSessionId,
  resetCurrentSnippet,
  getLessonSnippet,
} from 'Utilities/redux/snippetsReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import { clearContextTranslation } from 'Utilities/redux/contextTranslationReducer'
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
  addToVoice,
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
import SnippetActions from './SnippetActions'
import PracticeText from './PracticeText'

const CurrentSnippet = ({
  storyId,
  handleInputChange,
  timer,
  numSnippets,
  lessonId,
  groupId,
  lessonStartOver,
  currentSnippetNum,
}) => {
  const CACHE_LIMIT = 5
  const SNIPPET_FETCH_INTERVAL = 5000
  const [exerciseCount, setExerciseCount] = useState(0)
  const practiceForm = useRef(null)
  const dispatch = useDispatch()
  const { enable_recmd } = useSelector(({ user }) => user.data.user)
  const snippets = useSelector(({ snippets }) => snippets)
  const {
    answersPending,
    cachedSnippets, 
    lastCachedSnippetKey, 
    candidatesInCache,
    cachedSnippetIds,
    cacheSize,
    cacheRequesting,
    focused,
  } = snippets
  const {
    practiceFinished,
    snippetFinished,
    isNewSnippet,
    attempt,
    willPause,
    isPaused,
    currentAnswers,
  } = useSelector(({ practice }) => practice)
  const userData = useSelector(state => state.user.data.user)
  const learningLanguage = useSelector(learningLanguageSelector)
  const history = useHistory()
  const isControlledStory = history.location.pathname.includes('controlled-practice')
  const exerciseMode = history.location.pathname.includes('listening')
    ? 'listening'
    : history.location.pathname.includes('grammar')
    ? 'grammar'
    : history.location.pathname.includes('speech')
    ? 'speech'
    : 'all'
  const sessionId = snippets?.sessionId ?? null
  if (!userData) {
    return
  }
  const SECONDS_PER_WRONG_EXERCISE = 20
  const currentSnippetId = () => {
    if (!snippets.focused) return -1
    const { snippetid } = snippets.focused
    return snippetid[snippetid.length - 1]
  }

  const getExerciseCount = () => {
    let count = 0
    snippets.focused.practice_snippet?.forEach(word => {
      if (word.id) {
        count++
      }
    })
    return count
  }

  const setInitialAnswers = () => {
    if (snippets.focused && (snippets.focused.storyid === storyId || lessonId !== null)) {
      const filteredSnippet = snippets.focused?.practice_snippet?.filter(word => word.id)
      const initialAnswers = filteredSnippet?.reduce((answerObject, currentWord) => {
        const {
          surface,
          id,
          ID,
          base,
          bases,
          listen,
          speak,
          choices,
          concept,
          audio,
          sentence_id,
          snippet_id,
          requested_hints,
          audio_wids,
        } = currentWord

        let usersAnswer
        if (listen || choices || speak) {
          usersAnswer = ''
        } else {
          usersAnswer = base || bases
        }
        const word_cue = usersAnswer

        if (choices) {
          dispatch(
            addToOptions({
              [`${ID}-${id}`]: {
                distractors: choices,
                snippet_id,
                sentence_id,
                id,
                word_id: ID,
                story_id: storyId,
                cue: word_cue,
                requestedHintsList: requested_hints,
              },
            })
          )
        }

        if (listen) {
          dispatch(
            addToAudio({
              [`${ID}-${id}`]: {
                context: audio,
                audio_wids,
                snippet_id,
                sentence_id,
                id,
                word_id: ID,
                story_id: storyId,
                cue: word_cue,
                requestedHintsList: requested_hints,
              },
            })
          )
        }

        if (speak) {
          dispatch(
            addToVoice({
              [`${ID}-${id}`]: {
                context: audio,
                audio_wids,
                snippet_id,
                sentence_id,
                id,
                word_id: ID,
                story_id: storyId,
                cue: word_cue,
                requestedHintsList: requested_hints,
              },
            })
          )
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
            story_id: storyId,
            word_id: ID,
            cue: word_cue,
            requestedHintsList: requested_hints,
          },
        }
      }, {})
      if (initialAnswers && Object.keys(initialAnswers).length > 0)
        dispatch(setAnswers({ ...initialAnswers }))
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

    if (lessonId && currentSnippetNum && numSnippets && currentSnippetNum === numSnippets) {
      dispatch(setPracticeFinished(true))
    } else if (snippets.focused.total_num !== currentSnippetId() + 1 || practiceFinished) {
      const nextSnippetKey = (!lessonId && `${storyId}-${currentSnippetId() + 1}` || 
                              cacheSize && Object.keys(cachedSnippets)[0] || 'anyKey')
      const nextSnippet = cachedSnippets[nextSnippetKey]
      dispatch(dropCachedSnippet(nextSnippetKey))
      dispatch(getNextSnippetFromCache(nextSnippetKey, nextSnippet))
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
    if (lessonId) {
      dispatch(getLessonSnippet(lessonId, groupId))
    } else {
      dispatch(getCurrentSnippet(storyId, isControlledStory, exerciseMode))
    }
    dispatch(clearTranslationAction())
    dispatch(clearContextTranslation())
    dispatch(resetCachedSnippets())
  }, [])

  const fetchSnippet = async () => {
    if (!lessonId) {
      const nextCachedSnippetId = Math.min(...Array.from(
        {length: CACHE_LIMIT}, (_, i) => currentSnippetId() + i).filter(
            e => !cachedSnippetIds?.map(x => x-1).includes(e) && e <= numSnippets - 1))
      if (nextCachedSnippetId <= numSnippets - 1 && nextCachedSnippetId >= 0) {
        await dispatch(
          cacheStorySnippet(storyId, nextCachedSnippetId, isControlledStory, sessionId, exerciseMode)
        )
      } else if (!cachedSnippetIds.includes(0)) {
        await dispatch(cacheStorySnippet(storyId, 0, isControlledStory, sessionId, exerciseMode, true))
      }
    } else if (lastCachedSnippetKey !== 'endKey' && cacheSize < CACHE_LIMIT) {
      const currentCandidates = snippets.focused.practice_snippet.filter(e=>e.id).map(e => e.id) || []
      const exclude_candidates = [...candidatesInCache, ...currentCandidates]
      await dispatch(
        cacheLessonSnippet(lessonId, groupId, exclude_candidates, focused.topics)
      )
    }
  }

  useEffect(() => {
    if (snippets.focused && !cacheRequesting) fetchSnippet()
  }, [lastCachedSnippetKey, cacheSize, cacheRequesting, snippets.focused?.snippetid])

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
    if (practiceFinished && enable_recmd) {
      dispatch(openEncouragement())
    }
  }, [practiceFinished])

  const startOver = async () => {
    dispatch(clearPractice())
    dispatch(resetAnnotations())
    dispatch(resetCachedSnippets())
    dispatch(setPrevious([]))
    dispatch(setPracticeFinished(false))
    const initSnippet = snippets.cachedSnippets[`${storyId}-0`]
    if (initSnippet) {
      dispatch(dropCachedSnippet(`${storyId}-0`))
      dispatch(getNextSnippetFromCache(`${storyId}-0`, initSnippet, true))
    } else dispatch(resetCurrentSnippet(storyId, isControlledStory, exerciseMode))
  }

  const handleMultiselectChange = (event, word, data) => {
    const { id, ID, surface, concept, snippet_id, sentence_id, alter_correct } = word
    const { value } = data
    const word_cue = currentAnswers[`${ID}-${id}`]?.cue

    dispatch(setTouchedIds(ID))

    const newAnswer = {
      [`${ID}-${id}`]: {
        correct: alter_correct || surface,
        users_answer: value,
        cue: word_cue,
        id,
        word_id: ID,
        concept,
        snippet_id,
        sentence_id,
        hintsRequested: currentAnswers[`${ID}-${id}`]?.hintsRequested,
        requestedHintsList: currentAnswers[`${ID}-${id}`]?.requestedHintsList,
        penalties: currentAnswers[`${ID}-${id}`]?.penalties,
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
              lessonId={lessonId}
              groupId={groupId}
              lessonStartOver={lessonStartOver}
            />
          </div>
        ) : (
          <div>
            {storyId && <Button variant="primary" block onClick={() => startOver()}>
              <FormattedMessage id="restart-story" />
            </Button>}
          </div>
        )}
      </form>
    </div>
  )
}

export default CurrentSnippet
