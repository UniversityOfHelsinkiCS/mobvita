import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Divider, Segment, Header, Checkbox } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import { getStoryAction } from 'Utilities/redux/storiesReducer'

import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import { resetAnnotations, setAnnotations } from 'Utilities/redux/annotationsReducer'
import { learningLanguageSelector, getTextStyle, getMode } from 'Utilities/common'
import DictionaryHelp from 'Components/DictionaryHelp'
import AnnotationBox from 'Components/AnnotationBox'
import Spinner from 'Components/Spinner'
import TextWithFeedback from 'Components/PracticeView/TextWithFeedback'
import FeedbackInfoModal from 'Components/PracticeView/FeedbackInfoModal'
import ReportButton from 'Components/ReportButton'
import Footer from '../Footer'
import ScrollArrow from '../ScrollArrow'

const ReadViews = ({ match }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const { width } = useWindowDimensions()
  const [hideFeedback, setHideFeedback] = useState(false)
  const mode = getMode()

  const { story, pending } = useSelector(({ stories, locale }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
    locale,
  }))

  const learningLanguage = useSelector(learningLanguageSelector)
  const { id } = match.params
  useEffect(() => {
    dispatch(getStoryAction(id, mode))
    dispatch(clearTranslationAction())
    dispatch(resetAnnotations())
  }, [])

  useEffect(() => {
    if (story) {
      const storyWords = story.paragraph.flat(1)
      dispatch(setAnnotations(storyWords))
    }
  }, [story])

  if (!story || pending) return <Spinner fullHeight />

  const showFooter = width > 640
  const showAnnotationBox = width >= 1024

  return (
    <div className="cont-tall flex-col space-between align-center pt-sm">
      <div className="flex mb-nm">
        <div>
          <Segment
            data-cy="reviewmode-text"
            className="cont"
            style={getTextStyle(learningLanguage)}
          >
            <Header style={getTextStyle(learningLanguage, 'title')}>
              <span className="pr-sm">{story.title}</span>
              <br />
              {story.url && (
                <a href={story.url} style={{ fontSize: '1rem', fontWeight: '300' }}>
                  <FormattedMessage id="Source" />
                </a>
              )}
            </Header>
            <div className="space-between" style={{ alignItems: 'center' }}>
              <Checkbox
                toggle
                label={intl.formatMessage({ id: 'show-feedback' })}
                checked={!hideFeedback}
                onChange={() => setHideFeedback(!hideFeedback)}
                style={{ paddingTop: '.5em' }}
              />
              <Link to={`/stories/${id}/practice`}>
                <Button variant="primary">
                  <FormattedMessage id="practice-now" />
                </Button>
              </Link>
            </div>
            <Divider />
            {story.paragraph.map(paragraph => (
              <>
                <TextWithFeedback
                  hideFeedback={hideFeedback}
                  mode="review"
                  snippet={paragraph}
                  answers={null}
                />
                <br />
                <br />
              </>
            ))}
            <ScrollArrow />
          </Segment>
          {width >= 500 ? (
            <div className="flex-col align-end" style={{ marginTop: '0.5em' }}>
              <ReportButton />
            </div>
          ) : (
            <div style={{ marginBottom: '0.5em' }}>
              <ReportButton />
            </div>
          )}
        </div>
        <div className="dictionary-and-annotations-cont">
          <DictionaryHelp />
          {showAnnotationBox && <AnnotationBox />}
        </div>
        <FeedbackInfoModal />
      </div>
      {showFooter && <Footer />}
    </div>
  )
}

export default ReadViews
