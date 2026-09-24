import React, { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import { setPrevious, initializePrevious } from 'Utilities/redux/snippetsReducer'
import { setAnnotations } from 'Utilities/redux/annotationsReducer'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import Spinner from 'Components/Spinner'
import { useParams, useLocation } from 'react-router-dom'
import { Divider } from '@mui/material'

const PreviousSnippets = props => {
  const isLesson = props.isLesson
  const location = useLocation()
  const dispatch = useDispatch()
  const isControlledStory = location.pathname.includes('controlled-practice')

  const [annotationsInitialized, setAnnotationsInitialized] = useState(false)

  const learningLanguage = useSelector(learningLanguageSelector)
  const previousAnswers = useSelector(({ practice }) => practice.previousAnswers)
  const focusedStory = useSelector(({ stories }) => stories.focused)
  const rawPrevious = useSelector(({ snippets }) => snippets.previous)
  const focusedSnippet = useSelector(({ snippets }) => snippets.focused)
  const pending = useSelector(({ snippets }) => snippets.pending)
  const previous = useMemo(() => (rawPrevious || []).filter(Boolean), [rawPrevious])

  const { id: storyId } = useParams()

  useEffect(() => {
    dispatch(setPrevious([]))
    if (!isLesson) {
      dispatch(initializePrevious(storyId, isControlledStory))
    }
  }, [])

  useEffect(() => {
    if (previous.length > 0 && !annotationsInitialized) {
      dispatch(setAnnotations(previous.flat(1)))
      setAnnotationsInitialized(true)
    }
  }, [previous, annotationsInitialized, dispatch])

  useEffect(() => {
    if (!isLesson) {
      const updatedPrevious = focusedStory.paragraph.slice(0, previous.length)
      const previousWords = updatedPrevious.flat(1)
      dispatch(setAnnotations(previousWords))
      dispatch(setPrevious(updatedPrevious))
    }
  }, [focusedStory])

  if (previous?.length > 0 && previous[0].practice_snippet) {
    return null
  }

  if (!isLesson && focusedSnippet && focusedSnippet.snippetid[0] === 0) {
    return null
  }

  // Past this point in the story, the earlier snippets come in a request of their own that can
  // land seconds after the current snippet — say so, rather than leaving the page looking finished.
  if (!isLesson && focusedSnippet && focusedSnippet.snippetid[0] !== 0 && previous?.length === 0) {
    return (
      <div className="pt-nm justify-center" data-cy="previous-snippets-spinner">
        <Spinner inline size={40} />
      </div>
    )
  }

  // Nothing to show yet: a request in flight, or no current snippet to hang the earlier ones on.
  if (!isLesson && (pending || !focusedSnippet)) {
    return null
  }

  if (isLesson === true) {
    return (
      <div className="pt-nm" style={getTextStyle(learningLanguage)}>
        {previous?.map((snippet, index) => {
          if (index < previous.length - 1) {
            return (
              <div key={index} className="pt-nm" style={getTextStyle(learningLanguage)}>
                <TextWithFeedback
                  snippet={snippet}
                  answers={previousAnswers}
                  mode="practice"
                  style={' display: block'}
                />
                <Divider sx={{ my: '1em' }} />
              </div>
            )
          } else {
            return (
              <div key={index} className="pt-nm" style={getTextStyle(learningLanguage)}>
                <TextWithFeedback
                  key={index}
                  snippet={snippet}
                  answers={previousAnswers}
                  mode="practice"
                  style={' display: block'}
                />
              </div>
            )
          }
        })}
      </div>
    )
  } else {
    const previousSnippets = previous?.map((snippet, index) => (
      <TextWithFeedback key={index} snippet={snippet} answers={previousAnswers} mode="practice" />
    ))

    return (
      <div className="pt-nm" style={getTextStyle(learningLanguage)}>
        {previousSnippets}
      </div>
    )
  }
}

export default PreviousSnippets
