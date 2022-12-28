import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  addToPrevious,
  getNextSnippetFromCache,
  initEloHearts,
  clearEloHearts,
} from 'Utilities/redux/snippetsReducer'
import {
  getAndCacheNextSnippet,
  resetCachedSnippets,
  setWillPause,
  setIsPaused,
} from 'Utilities/redux/competitionReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import 'react-simple-keyboard/build/css/index.css'
import { FormattedMessage } from 'react-intl'
import { getSelf } from 'Utilities/redux/userReducer'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
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
} from 'Utilities/redux/practiceReducer'
import SnippetActions from './SnippetActions'
import PracticeText from './PracticeText'

const CurrentSnippet = ({ storyId, handleInputChange, setYouWon, finished }) => {
  const SNIPPET_FETCH_INTERVAL = 5000
  const practiceForm = useRef(null)
  const dispatch = useDispatch()

  const [exerciseCount, setExerciseCount] = useState(0)
  const [snippetToCacheId, setSnippetToCacheId] = useState(0)

  const snippets = useSelector(({ snippets }) => snippets)
  const { answersPending } = snippets
  const { snippetFinished, isNewSnippet, attempt, currentAnswers } = useSelector(({ practice }) => practice)
  const { cachedSnippets } = useSelector(({ compete }) => compete)
  const { focused } = useSelector(({ stories }) => stories)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { willPause, isPaused, timerControls } = useSelector(({ compete }) => compete)

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
          snippet_id,
          sentence_id,
        } = currentWord

        let usersAnswer
        if (listen || choices) {
          usersAnswer = ''
        } else {
          usersAnswer = base || bases
        }
        let word_cue = usersAnswer

        if (choices) {
          dispatch(
            addToOptions({
              [`${ID}-${id}`]: {
                distractors: choices,
                word_id: ID,
                id,
                story_id: storyId,
                snippet_id,
                sentence_id,
                cue: word_cue
              },
            })
          )
        }

        if (listen) {
          dispatch(
            addToAudio({
              [`${ID}-${id}`]: {
                context: audio,
                word_id: ID,
                id,
                story_id: storyId,
                snippet_id,
                sentence_id,
                cue: word_cue
              },
            })
          )
        }

        return {
          ...answerObject,
          [`${ID}-${id}`]: {
            correct: surface,
            users_answer: usersAnswer,
            cue: word_cue,
            id,
            concept,
            word_id: ID,
            snippet_id,
            sentence_id,
            story_id: storyId,
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
    dispatch(addToPrevious(snippets.focused))
    dispatch(clearCurrentPractice())

    if (snippets.focused.total_num !== currentSnippetId() + 1 || finished) {
      dispatch(getNextSnippetFromCache(cachedSnippets[currentSnippetId()]))
    } else {
      setYouWon(true)
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
    dispatch(resetCachedSnippets())
    dispatch(clearTranslationAction())

    const interval = setInterval(() => {
      setSnippetToCacheId(snippetToCacheId => snippetToCacheId + 1)
    }, SNIPPET_FETCH_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    async function fetchSnippet() {
      if (snippetToCacheId < focused.paragraph.length - 1) {
        await dispatch(getAndCacheNextSnippet(storyId, snippetToCacheId))
      }
    }
    fetchSnippet()
  }, [snippetToCacheId])

  useEffect(() => {
    const currentSnippetIsLoaded = !!snippets.focused
    if (currentSnippetIsLoaded) {
      const wasLastAttempt =
        snippets.focused.skip_second ||
        snippetFinished ||
        attempt + 1 >= snippets.focused.max_attempt
      if (wasLastAttempt && willPause) {
        dispatch(setIsPaused(true))
        dispatch(setWillPause(false))
        timerControls.stop()
      }
      if (isNewSnippet) setInitialAnswers()
      else if (wasLastAttempt) finishSnippet()
      else dispatch(incrementAttempts())
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
    window.location.reload()
  }

  const handleMultiselectChange = (event, word, data) => {
    const { id, ID, surface, concept, sentence_id, snippet_id } = word
    const { value } = data
    const word_cue = currentAnswers[`${ID}-${id}`]?.cue

    dispatch(setTouchedIds(ID))

    const newAnswer = {
      [`${ID}-${id}`]: {
        correct: surface,
        users_answer: value,
        cue: word_cue,
        id,
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

  if (isPaused) {
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
    <form ref={practiceForm}>
      {!finished ? (
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
            playerFinished={finished}
          />
        </div>
      ) : (
        <Button variant="primary" block onClick={() => startOver()}>
          <FormattedMessage id="restart-competition" />
        </Button>
      )}
    </form>
  )
}

export default CurrentSnippet
