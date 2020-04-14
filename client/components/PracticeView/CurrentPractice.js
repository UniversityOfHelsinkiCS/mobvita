import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getCurrentSnippet, getNextSnippet } from 'Utilities/redux/snippetsReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import 'react-simple-keyboard/build/css/index.css'
import { FormattedMessage } from 'react-intl'
import { getSelf } from 'Utilities/redux/userReducer'
import { Button } from 'react-bootstrap'
import { setAnswers, clearPractice, clearCurrentPractice, setTouchedIds, addToAudio, setPreviousAnswers, addToOptions } from 'Utilities/redux/practiceReducer'
import Chunks from './Chunks'
import CheckAnswers from './CheckAnswers'

const CurrentPractice = ({ storyId, textToSpeech, handleInputChange }) => {
  const [progress, setProgress] = useState(0)
  const [exerciseCount, setExerciseCount] = useState(0)
  const scrollTarget = useRef(null)

  const dispatch = useDispatch()

  const snippets = useSelector(({ snippets }) => snippets)
  const answersPending = useSelector(({ snippets }) => snippets.answersPending)
  const attempt = useSelector(({ practice }) => practice.attempt)

  const currentSnippetId = () => {
    if (!snippets.focused) return -1
    const { snippetid } = snippets.focused
    return snippetid[snippetid.length - 1]
  }

  const [finished, setFinished] = useState(false)

  let snippetProgress = ''
  if (snippets.focused) {
    snippetProgress = finished ? currentSnippetId() + 1 : currentSnippetId()
  }

  useEffect(() => {
    dispatch(clearPractice())
  }, [])

  useEffect(() => {
    dispatch(getCurrentSnippet(storyId))
    dispatch(clearTranslationAction())
  }, [])

  const getExerciseCount = () => {
    let count = 0
    snippets.focused.practice_snippet.forEach((word) => {
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
        const { surface, id, ID, base, bases, listen, choices, concept } = currentWord
        // if (currentAnswers[ID]) return { ...answerObject, [ID]: currentAnswers[ID] }

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
          dispatch(addToAudio(ID))
        }

        // Checks if word to be shown is already correct and marks it touched.
        // (Only applies to cloze, other exercise types dont have default values set.)
        if (usersAnswer === surface) {
          dispatch(setTouchedIds(ID))
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
    }
  }

  useEffect(() => {
    if (snippets.focused && attempt === 0) {
      dispatch(setPreviousAnswers(currentSnippetId()))
      dispatch(clearCurrentPractice())
      setInitialAnswers()
    }
  }, [snippets.focused])

  useEffect(() => {
    if (!answersPending) dispatch(getSelf())
  }, [answersPending])

  useEffect(() => {
    if (snippets.focused) {
      setProgress(snippetProgress / snippets.focused.total_num)
    }
  }, [snippets.focused])

  useEffect(() => {
    if (snippets.focused && snippets.focused.skip_second) {
      dispatch(setPreviousAnswers(currentSnippetId()))
      dispatch(clearCurrentPractice())

      if (snippets.focused.total_num !== currentSnippetId() + 1 || finished) {
        dispatch(getNextSnippet(storyId, currentSnippetId()))
      } else {
        setFinished(true)
        setProgress(currentSnippetId() + 1 / snippets.focused.total_num)
      }
    }
  }, [snippets.focused])

  useEffect(() => {
    if (!snippets.pending && scrollTarget.current) {
      setTimeout(() => {
        scrollTarget.current.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    }
  }, [snippets.pending, snippets.previous])

  const startOver = async () => {
    dispatch(clearPractice())
    await dispatch(getNextSnippet(storyId, currentSnippetId()))
    setFinished(false)
    setProgress(0)
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

  return (
    <form ref={scrollTarget}>
      {!finished
        ? (
          <div style={{ width: '100%' }}>
            <div
              className="practice-container"
              data-cy="practice-view"
            >
              <Chunks
                textToSpeech={textToSpeech}
                handleAnswerChange={handleInputChange}
                handleMultiselectChange={handleMultiselectChange}
              />
            </div>
            <CheckAnswers
              storyId={storyId}
              exerciseCount={exerciseCount}
            />
          </div>
        )
        : (
          <Button variant="primary" block onClick={() => startOver()}>
            <FormattedMessage id="restart-story" />
          </Button>
        )}

      {
        snippets.focused && (
          <div style={{ height: '2.5em', marginTop: '0.5em', textAlign: 'center' }} className="progress">
            <span
              data-cy="snippet-progress"
              style={{ marginTop: '0.23em', fontSize: 'larger', position: 'absolute', right: 0, left: 0 }}
              className="progress-value"
            >{`${snippetProgress} / ${snippets.focused.total_num}`}
            </span>
            <div
              className="progress-bar progress-bar-striped bg-info"
              style={{ width: `${progress * 100}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>

        )
      }
    </form>
  )
}


export default CurrentPractice
