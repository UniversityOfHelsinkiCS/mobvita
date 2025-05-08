import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import { setPrevious, initializePrevious } from 'Utilities/redux/snippetsReducer'
import { setAnnotations } from 'Utilities/redux/annotationsReducer'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import { useParams, useHistory } from 'react-router-dom'
import { Divider, Placeholder, PlaceholderHeader, PlaceholderLine } from 'semantic-ui-react'

const PreviousSnippets = (props) => {
  const isLesson = props.isLesson
  const history = useHistory()
  const dispatch = useDispatch()
  const isControlledStory = history.location.pathname.includes('controlled-practice')

  const [annotationsInitialized, setAnnotationsInitialized] = useState(false)

  const { learningLanguage } = useSelector(learningLanguageSelector)
  const { previousAnswers } = useSelector(({ practice }) => practice)
  const { focused: focusedStory } = useSelector(({ stories }) => stories)
  const { previous, focusedSnippet, pending } = useSelector(({ snippets }) => {
    const { focused: focusedSnippet, pending } = snippets
    const previous = snippets.previous.filter(Boolean)
    return { previous, focusedSnippet, pending }
  }, shallowEqual)

  const { id: storyId } = useParams()

  useEffect(() => {
    dispatch(setPrevious([]))
    if (!isLesson){
      dispatch(initializePrevious(storyId, isControlledStory))
    }
  }, [])

  useEffect(() => {
    if (previous.length > 0 && !annotationsInitialized) {
      dispatch(setAnnotations(previous.flat(1)))
      dispatch(setPrevious(previous))
      setAnnotationsInitialized(true)
    }
  }, [previous])

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

  if (!isLesson && (pending || (focusedSnippet?.snippetid[0] !== 0 && previous?.length === 0))) {
    return (
      <div className="pt-nm" style={{ marginBottom: '2rem' }}>
        <Placeholder fluid>
          <PlaceholderHeader>
            <PlaceholderLine length="very long" />
          </PlaceholderHeader>
          <PlaceholderHeader>
            <PlaceholderLine length="full" />
            <PlaceholderLine length="long" />
          </PlaceholderHeader>
          <PlaceholderHeader>
            <PlaceholderLine length="full" />
            <PlaceholderLine length="medium" />
          </PlaceholderHeader>
        </Placeholder>
      </div>
    )
  }

  if (isLesson === true){
    return (
      <div className="pt-nm" style={getTextStyle(learningLanguage)}>
        {previous?.map((snippet, index) => {
          if (index < previous.length - 1){
            return (
              <div className="pt-nm" style={getTextStyle(learningLanguage)}>
                <TextWithFeedback key={index} snippet={snippet} answers={previousAnswers} mode="practice" style={' display: block'} />
                <Divider />
              </div>
            )
          } else {
            return (
              <div className="pt-nm" style={getTextStyle(learningLanguage)}>
                <TextWithFeedback key={index} snippet={snippet} answers={previousAnswers} mode="practice" style={' display: block'} />
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
