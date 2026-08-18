import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Divider, Paper, FormControlLabel } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import CustomTooltip from 'Components/CustomTooltip'
import AppButton from 'Components/AppButton'
import AppSwitch from 'Components/ui/AppSwitch'
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
import { clearContextTranslation } from 'Utilities/redux/contextTranslationReducer'
import { resetAnnotations, setAnnotations } from 'Utilities/redux/annotationsReducer'
import { learningLanguageSelector, getTextStyle } from 'Utilities/common'
import DictionaryHelp from 'Components/DictionaryHelp'
import AnnotationBox from 'Components/AnnotationBox'
import Spinner from 'Components/Spinner'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import FeedbackInfoModal from 'Components/CommonStoryTextComponents/FeedbackInfoModal'
import ReportButton from 'Components/ReportButton'
import ScrollArrow from '../ScrollArrow'
import StoryTopics from 'Components/StoryView/StoryTopics'

const ControlledStoryEditView = ({ match }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const { width } = useWindowDimensions()
  const [hideFeedback, setHideFeedback] = useState(false)
  const location = useLocation()
  const [showRefreshButton, setShowRefreshButton] = useState(false)
  const [focusedConcept, setFocusedConcept] = useState(null)
  const controlledPractice = useSelector(({ controlledPractice }) => controlledPractice)
  const [timedExercise, setTimedExercise] = useState(controlledPractice?.timedExercise || false)
  
  const { story, pending } = useSelector(
    ({ stories, locale }) => ({
      story: stories.focused,
      pending: stories.focusedPending,
      locale,
    }),
    shallowEqual,
  )
  const user = useSelector(state => state.user.data)

  const { progress, storyId } = useSelector(({ uploadProgress }) => uploadProgress)

  const learningLanguage = useSelector(learningLanguageSelector)
  const { id } = match.params
  const tailoredStoryView = location.pathname.includes('controlled-practice')

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
    if (user?.teacherView) {
      setHideFeedback(false)
    }
    dispatch(getFrozenTokens(id))
    dispatch(getStoryAction(id, 'preview'))
    dispatch(clearTranslationAction())
    dispatch(clearContextTranslation())
    dispatch(resetAnnotations())
  }, [])

  useEffect(() => {
    if (controlledPractice.finished) {
      dispatch(
        getAllStories(learningLanguage, {
          sort_by: 'date',
          order: -1,
        }),
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

  if (!story || pending || !user) return <Spinner fullHeight size={60} text="" />

  const url = location.pathname
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
    const emptySnippets = false
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

  return (
    <div className="cont-tall flex-col space-between align-center pt-sm">
      <div className="flex mb-nm">
        <div>
          <Paper
            data-cy="readmodes-text"
            className="cont"
            sx={{ padding: '1em' }}
            style={getTextStyle(learningLanguage)}
          >
            <div className="header-2" style={getTextStyle(learningLanguage, 'title')}>
              <span className="pr-sm">{story.title}</span>
              <br />
              {story.url && (
                <a
                  href={story.url}
                  data-cy="controlled-story-editor-source-link"
                  style={{ fontSize: '1rem', fontWeight: '300' }}
                >
                  <FormattedMessage id="Source" />
                </a>
              )}
            </div>
            <div className="space-between" style={{ alignItems: 'center' }}>
              <div>
                <FormControlLabel
                  control={
                    <AppSwitch
                      checked={!hideFeedback}
                      onChange={() => setHideFeedback(!hideFeedback)}
                      slotProps={{
                        input: { 'data-cy': 'controlled-story-editor-show-preview-toggle' },
                      }}
                    />
                  }
                  label={checkboxLabel()}
                  style={{ paddingTop: '.5em' }}
                />
                <CustomTooltip title={infoBoxLabel()}>
                  <span style={{ display: 'inline-flex' }}>
                    <InfoOutlinedIcon className="pl-sm" sx={{ color: 'grey' }} />
                  </span>
                </CustomTooltip>
              </div>
              <div>
                <FormControlLabel
                  control={
                    <AppSwitch
                      checked={timedExercise}
                      onChange={() => setTimedExercise(!timedExercise)}
                      slotProps={{
                        input: { 'data-cy': 'controlled-story-editor-timed-toggle' },
                      }}
                    />
                  }
                  label={intl.formatMessage({ id: 'timed-practice-toggle' })}
                  style={{ paddingTop: '.5em' }}
                />
                <CustomTooltip title={intl.formatMessage({ id: 'timed-practice-toggle-tooltip' })}>
                  <span style={{ display: 'inline-flex' }}>
                    <InfoOutlinedIcon className="pl-sm" sx={{ color: 'grey' }} />
                  </span>
                </CustomTooltip>
              </div>
            </div>
            {progress !== 0 && processingCurrentStory && (
              <div className="bold" data-cy="controlled-story-editor-processing-warning">
                <span style={{ color: 'red' }}>
                  <FormattedMessage id="story-not-yet-processed" />
                </span>
              </div>
            )}
            {showRefreshButton && (
              <div className="flex gap-col-sm align-center">
                <div className="bold" data-cy="controlled-story-editor-processing-done">
                  <span style={{ color: 'red' }}>
                    <FormattedMessage id="story-processing-now-finished" />
                  </span>
                </div>
                <AppButton onClick={refreshPage} data-cy="controlled-story-editor-refresh-button">
                  <FormattedMessage id="refresh" />
                </AppButton>
              </div>
            )}
            <Divider sx={{ my: '1em' }} />
            {story.paragraph.map((paragraph, index) => (
              <>
                <TextWithFeedback
                  exercise
                  hideFeedback={hideFeedback}
                  mode="practice"
                  snippet={paragraph}
                  focusedConcept={focusedConcept}
                  answers={null}
                  key={index}
                />
                <hr />
              </>
            ))}

            <ScrollArrow />
          </Paper>
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
          <div className="save-edited-story-box">
            <Paper sx={{ padding: '1em' }}>
              <div>
                {emptySnippets() && (
                  <span
                    data-cy="controlled-story-editor-empty-snippets-warning"
                    style={{ color: '#ff0000', marginBottom: '0.5em' }}
                  >
                    <b>
                      <FormattedMessage id="empty-snippets-warning" />
                    </b>
                  </span>
                )}
                <AppButton
                  variant="primary"
                  onClick={saveControlledStory}
                  type="button"
                  data-cy="controlled-story-editor-save-button"
                  style={{ width: '100%', marginBottom: '.5em', marginTop: '.5em' }}
                >
                  <FormattedMessage id="save-controlled-story" />
                </AppButton>
              </div>
              <AppButton
                variant="secondary"
                size="sm"
                onClick={handleEditorReset}
                data-cy="controlled-story-editor-start-over-button"
                style={{ marginBottom: '0.5em' }}
              >
                <span>
                  <FormattedMessage id="start-over" /> <ArrowUpwardIcon fontSize="small" />
                </span>
              </AppButton>
            </Paper>
          </div>
            <StoryTopics
              conceptCount={story.concept_count}
              focusedConcept={focusedConcept}
              setFocusedConcept={setFocusedConcept}
              isControlledStoryEditor={true}
            />
          <DictionaryHelp />
          {/* <AnnotationBox /> */}
        </div>
        <FeedbackInfoModal />
      </div>
    </div>
  )
}

export default ControlledStoryEditView
