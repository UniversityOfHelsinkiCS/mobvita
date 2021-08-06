import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Divider, Segment, Header } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import { resetAnnotations, initializeAnnotations } from 'Utilities/redux/annotationsReducer'
import { learningLanguageSelector, getTextStyle } from 'Utilities/common'
import DictionaryHelp from 'Components/DictionaryHelp'
import AnnotationBox from 'Components/AnnotationBox'
import Spinner from 'Components/Spinner'
import TextWithFeedback from 'Components/PracticeView/TextWithFeedback'
import Footer from '../Footer'
import ScrollArrow from '../ScrollArrow'

const ReviewView = ({ match }) => {
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()

  const { story, pending } = useSelector(({ stories, locale }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
    locale,
  }))

  const learningLanguage = useSelector(learningLanguageSelector)
  const { id } = match.params
  useEffect(() => {
    dispatch(getStoryAction(id))
    dispatch(clearTranslationAction())
    dispatch(resetAnnotations())
  }, [])

  useEffect(() => {
    if (story) {
      const allWordsWithAnnotations = story.paragraph.flat(1).filter(word => word.annotation)
      dispatch(initializeAnnotations(allWordsWithAnnotations))
    }
  }, [story])

  if (!story || pending) return <Spinner fullHeight />

  const showFooter = width > 640
  const showAnnotationBox = width >= 1024

  return (
    <div className="cont-tall flex-col space-between align-center pt-sm">
      <div className="flex mb-nm">
        <Segment data-cy="readmode-text" className="cont" style={getTextStyle(learningLanguage)}>
          <Header style={getTextStyle(learningLanguage, 'title')}>
            <span className="pr-sm">{story.title}</span>
          </Header>
          <div className="flex-reverse space-between align-end">
            <Link to={`/stories/${id}/practice`}>
              <Button variant="primary">
                <FormattedMessage id="practice-now" />
              </Button>
            </Link>
            {story.url && (
              <a href={story.url}>
                <FormattedMessage id="Source" />
              </a>
            )}
          </div>
          <Divider />
          {story.paragraph.map(paragraph => (
            <TextWithFeedback reviewMode snippet={paragraph} answers={null} />
          ))}
          <ScrollArrow />
        </Segment>
        <div className="dictionary-and-annotations-cont">
          <DictionaryHelp />
          {showAnnotationBox && <AnnotationBox mode="read" />}
        </div>
      </div>
      {showFooter && <Footer />}
    </div>
  )
}

export default ReviewView
