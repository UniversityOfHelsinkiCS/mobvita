import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import { Divider, Segment, Header, Checkbox, Icon, Popup } from 'semantic-ui-react'
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
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import FeedbackInfoModal from 'Components/CommonStoryTextComponents/FeedbackInfoModal'
import ReportButton from 'Components/ReportButton'
import { compose } from 'redux'
import Footer from '../Footer'
import ScrollArrow from '../ScrollArrow'

const ControlledStoryEditView = ({ match }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const { width } = useWindowDimensions()
  const [hideFeedback, setHideFeedback] = useState(false)
  const mode = getMode()
  const history = useHistory()
  const [showRefreshButton, setShowRefreshButton] = useState(false)

  const { story, pending } = useSelector(({ stories, locale }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
    locale,
  }))

  const user = useSelector(state => state.user.data)

  const { progress, storyId } = useSelector(({ uploadProgress }) => uploadProgress)

  const learningLanguage = useSelector(learningLanguageSelector)
  const { id } = match.params
  console.log('ID ', id)

  useEffect(() => {
    if (user?.user.is_teacher) {
      setHideFeedback(false)
    }
    dispatch(getStoryAction(id, 'preview'))
    dispatch(clearTranslationAction())
    dispatch(resetAnnotations())
  }, [])

  useEffect(() => {
    if (story) {
      const storyWords = story.paragraph.flat(1)
      dispatch(setAnnotations(storyWords))
    }
  }, [story])

  useEffect(() => {
    if (progress === 1) {
      setShowRefreshButton(true)
    }
  }, [progress])

  if (!story || pending || !user) return <Spinner fullHeight />

  const showFooter = width > 640
  const url = history.location.pathname
  const processingCurrentStory = id === storyId

  const checkboxLabel = () => {
    return intl.formatMessage({ id: 'show-exercise-preview' })
  }

  const infoBoxLabel = () => {
    return intl.formatMessage({ id: 'preview-mode-info' })
  }

  const refreshPage = () => {
    dispatch(getStoryAction(id, 'preview'))
    setShowRefreshButton(false)
  }

  return (
    <div className="cont-tall flex-col space-between align-center pt-sm">
      <div className="flex mb-nm">
        <div>
          <Segment data-cy="readmodes-text" className="cont" style={getTextStyle(learningLanguage)}>
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
              <div>
                <Checkbox
                  toggle
                  label={checkboxLabel()}
                  checked={!hideFeedback}
                  onChange={() => setHideFeedback(!hideFeedback)}
                  style={{ paddingTop: '.5em' }}
                />
                <Popup
                  content={infoBoxLabel()}
                  trigger={<Icon className="pl-sm" name="info circle" color="grey" />}
                />
              </div>
              <Link to={`/stories/${id}/practice`}>
                <Button variant="primary">
                  <FormattedMessage id="practice-now" />
                </Button>
              </Link>
            </div>
            {progress !== 0 && processingCurrentStory && (
              <div className="bold">
                <span style={{ color: 'red' }}>
                  <FormattedMessage id="story-not-yet-processed" />
                </span>
              </div>
            )}
            {showRefreshButton && (
              <div className="flex gap-col-sm align-center">
                <div className="bold">
                  <span style={{ color: 'red' }}>
                    <FormattedMessage id="story-processing-now-finished" />
                  </span>
                </div>
                <Button onClick={refreshPage}>
                  <FormattedMessage id="refresh" />
                </Button>
              </div>
            )}
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
          <AnnotationBox />
        </div>
        <FeedbackInfoModal />
      </div>
      {showFooter && <Footer />}
    </div>
  )
}

/*
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import { Segment } from 'semantic-ui-react'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { clearFocusedSnippet } from 'Utilities/redux/snippetsReducer'
import { setTouchedIds, setAnswers } from 'Utilities/redux/practiceReducer'
import { resetAnnotations } from 'Utilities/redux/annotationsReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import { getTextStyle, learningLanguageSelector, getMode } from 'Utilities/common'
import CurrentSnippet from 'Components/ControlledStoryEditView/CurrentSnippet'
import DictionaryHelp from 'Components/DictionaryHelp'
import ReportButton from 'Components/ReportButton'
import AnnotationBox from 'Components/AnnotationBox'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import PreviousSnippets from './PreviousSnippets'
import ProgressBar from './CurrentSnippet/ProgressBar'
import Footer from '../Footer'
import ScrollArrow from '../ScrollArrow'

const ControlledStoryEditView = () => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()
  const { id } = useParams()
  const { width } = useWindowDimensions()
  const controlledPractice = useSelector(({ controlledPractice }) => controlledPractice)
  const smallScreen = width < 700
  const mode = getMode()

  const controlledPracticeTotalNum = controlledPractice?.focused?.total_num

  const currentSnippetId = () => {
    if (!controlledPractice.focused) return -1
    const { snippetid } = controlledPractice.focused
    return snippetid[snippetid.length - 1] ?? controlledPracticeTotalNum - 1
  }

  const currentControlledPracticeNum = currentSnippetId() + 1

  const { story, pending } = useSelector(({ stories, locale }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
    locale,
  }))

  const showAnnotationBox = width >= 1024

  useEffect(() => {
    dispatch(getStoryAction(id, mode))
  }, [learningLanguage])

  useEffect(() => {
    dispatch(resetAnnotations())

    return () => {
      dispatch(clearFocusedSnippet())
    }
  }, [])

  if (!story) return null

  const handleAnswerChange = (value, word) => {
    const { surface, id, ID, concept } = word

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

  const showFooter = width > 640

  return (
    <div className="cont-tall pt-sm flex-col space-between">
      <div className="justify-center">
        <div className="cont">
          <Segment>
            <div className="progress-bar-cont" style={{ top: smallScreen ? '.25em' : '3.25em' }}>
              <ProgressBar
                snippetProgress={currentControlledPracticeNum}
                snippetsTotal={controlledPracticeTotalNum}
                progress={(currentControlledPracticeNum / controlledPracticeTotalNum).toFixed(2)}
              />
            </div>
            <div
              className="story-title"
              style={{
                ...getTextStyle(learningLanguage, 'title'),
                width: '100%',
              }}
            >
              {!pending && `${story.title}`}
            </div>
            {story.url && !pending ? (
              <a target="blank" href={story.url}>
                <FormattedMessage id="Source" />
              </a>
            ) : null}
            <div>
              {story.paragraph.map(paragraph => (
                <>
                  <TextWithFeedback hideFeedback={false} snippet={paragraph} mode="review" />
                  <hr />
                </>
              ))}
            </div>
            <PreviousSnippets />
            <hr />
            <CurrentSnippet storyId={id} handleInputChange={handleAnswerChange} />
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
          <AnnotationBox />
        </div>
      </div>
      {showFooter && <Footer />}
    </div>
  )
}
*/

export default ControlledStoryEditView
