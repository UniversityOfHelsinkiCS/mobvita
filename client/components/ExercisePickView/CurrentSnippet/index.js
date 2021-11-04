import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  getNextSnippetFrozen,
  addToPrevious,
  getCurrentSnippetFrozen,
} from 'Utilities/redux/exercisePickReducer'
import { useHistory } from 'react-router-dom'
import { getAllStories } from 'Utilities/redux/storiesReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import 'react-simple-keyboard/build/css/index.css'
import { FormattedMessage } from 'react-intl'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import { Button, Spinner } from 'react-bootstrap'
import { Icon } from 'semantic-ui-react'
import {
  setAnswers,
  clearPractice,
  clearCurrentPractice,
  addToAudio,
  addToOptions,
  startSnippet,
} from 'Utilities/redux/practiceReducer'
import { updateSeveralSpanAnnotationStore } from 'Utilities/redux/annotationsReducer'
import SnippetActions from './SnippetActions'
import PracticeText from './PracticeText'

const EditingFinishedActions = ({ snippetPending }) => {
  const history = useHistory()
  return (
    <div className="flex-col align-center">
      {snippetPending ? (
        <Spinner animation="border" variant="info" size="lg" />
      ) : (
        <>
          <div className="header-3 mb-nm">
            <FormattedMessage id="controlled-story-saved" />
          </div>
          <Button variant="primary" block onClick={() => history.push('/library')}>
            <Icon name="arrow left" />
            <FormattedMessage id="Back to library" />
          </Button>
        </>
      )}
    </div>
  )
}

const CurrentSnippet = ({ storyId }) => {
  const practiceForm = useRef(null)
  const dispatch = useDispatch()
  const exercisePick = useSelector(({ exercisePick }) => exercisePick)
  const snippetPending = useSelector(({ exercisePick }) => exercisePick.pending)
  const { snippetFinished, isNewSnippet } = useSelector(({ practice }) => practice)
  const learningLanguage = useSelector(learningLanguageSelector)

  const currentSnippetId = () => {
    if (!exercisePick.focused) return -1
    const { snippetid } = exercisePick.focused
    return snippetid[snippetid.length - 1]
  }

  const [finished, setFinished] = useState(false)

  const setInitialAnswers = () => {
    if (exercisePick.focused && exercisePick.focused.storyid === storyId) {
      const filteredSnippet = exercisePick.focused.practice_snippet.filter(word => word.id)
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
      dispatch(startSnippet())
    }
  }

  const finishSnippet = () => {
    const filteredPreviousSnippets = exercisePick.focused.practice_snippet.map(wordObj => {
      if (wordObj?.id && !exercisePick.acceptedTokens.map(t => t.ID).includes(wordObj.ID)) {
        delete wordObj.id
        return wordObj
      }

      return wordObj
    })

    dispatch(addToPrevious([filteredPreviousSnippets]))

    const annotationsToInitialize = []
    let currentSpan = { annotationString: '' }

    exercisePick.focused.practice_snippet.forEach(word => {
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

    if (exercisePick.focused.total_num !== currentSnippetId() + 1 || finished) {
      dispatch(getNextSnippetFrozen(storyId, currentSnippetId(), exercisePick.acceptedTokens))
    } else if (exercisePick.focused.total_num === currentSnippetId() + 1 || finished) {
      dispatch(getNextSnippetFrozen(storyId, currentSnippetId(), exercisePick.acceptedTokens))
      setFinished(true)
    } else {
      setFinished(true)
    }
  }

  useEffect(() => {
    if (finished) {
      dispatch(
        getAllStories(learningLanguage, {
          sort_by: 'date',
          order: -1,
        })
      )
    }
  }, [finished])

  useEffect(() => {
    dispatch(clearPractice())
    dispatch(getCurrentSnippetFrozen(storyId))
    dispatch(clearTranslationAction())
  }, [])

  useEffect(() => {
    if (snippetFinished) finishSnippet()
  }, [snippetFinished])

  useEffect(() => {
    const currentSnippetIsLoaded = !!exercisePick.focused
    if (currentSnippetIsLoaded) {
      if (isNewSnippet) setInitialAnswers()
    }
  }, [exercisePick.focused])

  useEffect(() => {
    if (!exercisePick.pending && practiceForm.current) {
      setTimeout(() => {
        if (practiceForm.current) practiceForm.current.scrollIntoView({ behavior: 'smooth' })
      }, 50)
    }
  }, [exercisePick.pending, exercisePick.previous])

  return (
    <form ref={practiceForm}>
      {!finished ? (
        <div style={{ width: '100%' }}>
          <div
            className="practice-container"
            style={getTextStyle(learningLanguage)}
            data-cy="practice-view"
          >
            <PracticeText />
          </div>
          <SnippetActions storyId={storyId} />
        </div>
      ) : (
        <EditingFinishedActions snippetPending={snippetPending} />
      )}
    </form>
  )
}

export default CurrentSnippet
