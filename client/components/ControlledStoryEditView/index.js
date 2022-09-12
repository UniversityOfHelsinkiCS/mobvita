import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Divider, Segment, Header, Checkbox, Icon, Popup } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import { getStoryAction, getAllStories } from 'Utilities/redux/storiesReducer'
import {
  freezeControlledStory,
  initControlledExerciseSnippets,
  getFrozenTokens,
  resetControlledStory,
} from 'Utilities/redux/controlledPracticeReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import { resetAnnotations, setAnnotations } from 'Utilities/redux/annotationsReducer'
import { learningLanguageSelector, getTextStyle, getMode } from 'Utilities/common'
import DictionaryHelp from 'Components/DictionaryHelp'
import AnnotationBox from 'Components/AnnotationBox'
import Spinner from 'Components/Spinner'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import FeedbackInfoModal from 'Components/CommonStoryTextComponents/FeedbackInfoModal'
import ReportButton from 'Components/ReportButton'
import Footer from '../Footer'
import ScrollArrow from '../ScrollArrow'
import StoryTopics from 'Components/StoryView/StoryTopics'

const ControlledStoryEditView = ({ match }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const { width } = useWindowDimensions()
  const [hideFeedback, setHideFeedback] = useState(false)
  const mode = getMode()
  const history = useHistory()
  const [showRefreshButton, setShowRefreshButton] = useState(false)
  const [focusedConcept, setFocusedConcept] = useState(null)
  const controlledPractice = useSelector(({ controlledPractice }) => controlledPractice)
  const { story, pending } = useSelector(({ stories, locale }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
    locale,
  }))
  const [timedExercise, setTimedExercise] = useState(controlledPractice?.timedExercise || true)
  const user = useSelector(state => state.user.data)

  const { progress, storyId } = useSelector(({ uploadProgress }) => uploadProgress)

  const learningLanguage = useSelector(learningLanguageSelector)
  const { id } = match.params

  const initAcceptedTokens = emptySnippets => {
    const initialAcceptedTokensList = {}
    for (let i = 0; i < story?.paragraph.length; i++) {
      if (!initialAcceptedTokensList[i]) {
        if (!controlledPractice.frozen_snippets[i] || emptySnippets) {
          initialAcceptedTokensList[i] = []
        } else {
          initialAcceptedTokensList[i] = controlledPractice.frozen_snippets[i]
        }
      }
    }

    return initialAcceptedTokensList
  }

  useEffect(() => {
    setTimedExercise(controlledPractice.timedExercise)
  }, [controlledPractice?.timedExercise])

  useEffect(() => {
    if (user?.user.is_teacher) {
      setHideFeedback(false)
    }
    dispatch(getFrozenTokens(id))
    dispatch(getStoryAction(id, 'preview'))
    dispatch(clearTranslationAction())
    dispatch(resetAnnotations())
  }, [])

  useEffect(() => {
    if (controlledPractice.finished) {
      dispatch(
        getAllStories(learningLanguage, {
          sort_by: 'date',
          order: -1,
        })
      )
    }
  }, [controlledPractice?.finished])

  useEffect(() => {
    if (story && controlledPractice) {
      const storyWords = story.paragraph.flat(1)
      dispatch(initControlledExerciseSnippets(initAcceptedTokens()))
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

  const saveControlledStory = () => {
    dispatch(freezeControlledStory(id, controlledPractice.snippets, timedExercise))
  }

  const handleEditorReset = () => {
    const emptySnippets = true
    dispatch(resetControlledStory(initAcceptedTokens(emptySnippets)))
  }

  const emptySnippets = () => {
    const snippets = Object.entries(controlledPractice.snippets)

    for (const [snippet, array] of snippets) {
      if (array.length < 1) {
        return true
      }
    }
    return false
  }
  // console.log('contr ', controlledPractice)

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
              <div>
                <Checkbox
                  toggle
                  label={intl.formatMessage({ id: 'timed-practice-toggle' })}
                  checked={timedExercise}
                  onChange={() => setTimedExercise(!timedExercise)}
                  style={{ paddingTop: '.5em' }}
                />
              </div>
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
                  exercise
                  hideFeedback={hideFeedback}
                  mode="practice"
                  snippet={paragraph}
                  focusedConcept={focusedConcept}
                  answers={null}
                />
                <hr />
              </>
            ))}
            <div>
              {emptySnippets() && (
                <span style={{ color: '#ff0000', marginBottom: '0.5em' }}>
                  <FormattedMessage id="empty-snippets-warning" />
                </span>
              )}
              <Button
                variant="primary"
                onClick={saveControlledStory}
                type="button"
                style={{ width: '100%', marginBottom: '.5em', marginTop: '.5em' }}
              >
                <FormattedMessage id="save-controlled-story" />
              </Button>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleEditorReset}
              style={{ marginBottom: '0.5em' }}
            >
              <span>
                <FormattedMessage id="start-over" /> <Icon name="level up alternate" />
              </span>
            </Button>
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
          <StoryTopics
            conceptCount={story.concept_count}
            focusedConcept={focusedConcept}
            setFocusedConcept={setFocusedConcept}
          />
          <DictionaryHelp />
          <AnnotationBox />
        </div>
        <FeedbackInfoModal />
      </div>
      {showFooter && <Footer />}
    </div>
  )
}

export default ControlledStoryEditView
