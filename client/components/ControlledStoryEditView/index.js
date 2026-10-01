import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch, shallowEqual } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { Box, FormControlLabel } from '@mui/material'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import CustomTooltip from 'Components/CustomTooltip'
import AppButton, { roundIconButtonSx } from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import AppIcon from 'Components/ui/AppIcon'
import StoryInfoButton from 'Components/StoryInfoButton'
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
import { learningLanguageSelector, getTextStyle, images } from 'Utilities/common'
import Spinner from 'Components/Spinner'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import HelperSidebar from 'Components/PracticeView/HelperSidebar'
import EditorWordPanel from './EditorWordPanel'
import FeedbackInfoModal from 'Components/CommonStoryTextComponents/FeedbackInfoModal'
import ReportButton from 'Components/ReportButton'
import ScrollArrow from '../ScrollArrow'
import StoryTopics from 'Components/StoryView/StoryTopics'
import { colors } from 'Assets/mui_theme/designTokens'

const ControlledStoryEditView = ({ match }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const { width } = useWindowDimensions()
  const [hideFeedback, setHideFeedback] = useState(false)
  const location = useLocation()
  const [showRefreshButton, setShowRefreshButton] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
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
  const isSidebarOpen = useSelector(state => state.helperSidebar?.isOpen ?? false)

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

  if (!story || pending || !user) return <Spinner fullHeight spinnerColor={colors.ink} size={60} text="" />

  const url = location.pathname
  const processingCurrentStory = id === storyId

  const checkboxLabel = () => {
    return intl.formatMessage({ id: 'show-exercise-preview' })
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
    <div className="cont-tall flex-col space-between align-center">
      {/* Same shell as the story preview: a centred cream card that makes room for the sidebar. */}
      <div className="flex mb-nm" style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
        <div className={`cont ${isSidebarOpen ? 'sidebar-pushed' : ''}`} style={{ flex: 1 }}>
          <Box
            data-cy="readmodes-text"
            sx={{
              backgroundColor: colors.card,
              borderRadius: '30px',
              padding: { xs: '1em', sm: '1.5em' },
              marginBottom: '1em',
            }}
            style={getTextStyle(learningLanguage)}
          >
            {/* Title and controls share a row; `flex-start` keeps the buttons on the first line
                when a long title wraps, rather than floating beside its middle. */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '0.75em',
              }}
            >
              <div className="story-title" style={getTextStyle(learningLanguage, 'title')}>
                <span className="header-text">{story.title}</span>
              </div>

              {/* Never squeezed by the title, and never wrapped onto a line of their own. */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75em', flexShrink: 0 }}>
                <StoryInfoButton story={story} storyId={id} />
                <CustomTooltip
                  title={intl.formatMessage({ id: 'customize-story-practice-EXPLAIN' })}
                >
                  <AppButton
                    type="button"
                    variant="tan-outline"
                    size="sm"
                    disableRipple
                    aria-label={intl.formatMessage({ id: 'practice-settings' })}
                    onClick={() => setSettingsOpen(true)}
                    data-cy="controlled-story-editor-settings"
                    sx={roundIconButtonSx}
                  >
                    <AppIcon src={images.settings02} size={24} color="currentColor" />
                  </AppButton>
                </CustomTooltip>
              </Box>
            </Box>
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
            {/* Rules only between paragraphs — none above the first or below the last, where the
                card's own edges already frame the text. */}
            {story.paragraph.map((paragraph, index) => (
              <React.Fragment key={index}>
                <TextWithFeedback
                  exercise
                  hideFeedback={hideFeedback}
                  mode="practice"
                  snippet={paragraph}
                  focusedConcept={focusedConcept}
                  answers={null}
                />
                {index < story.paragraph.length - 1 && <hr />}
              </React.Fragment>
            ))}

            <ScrollArrow />
          </Box>
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
        {/* Everything that used to sit in the right-hand column: the topics, the clicked word, and
            the save controls. No dictionary and no assistant — this page is for authoring. */}
        <HelperSidebar>
          <div style={{ margin: '20px 20px 0 20px' }}>
            <StoryTopics
              conceptCount={story.concept_count}
              focusedConcept={focusedConcept}
              setFocusedConcept={setFocusedConcept}
              isControlledStoryEditor
            />
          </div>

          {/* The clicked word's tooltip, repeated here where there is room for it. */}
          <EditorWordPanel />

          {/* `marginTop: auto` in the sidebar's flex column keeps the save controls at the bottom,
              however tall the topic list and the word panel above them turn out to be. */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75em',
              margin: '20px',
              marginTop: 'auto',
              paddingTop: '20px',
            }}
          >
            {emptySnippets() && (
              <span
                data-cy="controlled-story-editor-empty-snippets-warning"
                style={{ color: colors.error }}
              >
                <b>
                  <FormattedMessage id="empty-snippets-warning" />
                </b>
              </span>
            )}
            <AppButton
              variant="tan"
              onClick={saveControlledStory}
              type="button"
              data-cy="controlled-story-editor-save-button"
              sx={{ width: '100%', height: 36 }}
            >
              <FormattedMessage id="save-controlled-story" />
            </AppButton>
            <AppButton
              variant="contrast-outline"
              onClick={handleEditorReset}
              data-cy="controlled-story-editor-start-over-button"
              sx={{ width: '100%', height: 36, gap: '0.5em' }}
            >
              <FormattedMessage id="start-over" />
              <ArrowUpwardIcon fontSize="small" />
            </AppButton>
          </Box>
        </HelperSidebar>
        <FeedbackInfoModal />
      </div>

      <AppDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title={<FormattedMessage id="practice-settings" />}
      >
        <div className="flex-col gap-row-nm">
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
            label={
              <CustomTooltip title={intl.formatMessage({ id: 'preview-mode-info' })}>
                <span>{checkboxLabel()}</span>
              </CustomTooltip>
            }
            sx={{
              m: 0,
              '& .MuiFormControlLabel-label': { marginLeft: '0.5em', color: colors.ink },
            }}
          />
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
            label={
              <CustomTooltip title={intl.formatMessage({ id: 'timed-practice-toggle-tooltip' })}>
                <span>{intl.formatMessage({ id: 'timed-practice-toggle' })}</span>
              </CustomTooltip>
            }
            sx={{
              m: 0,
              '& .MuiFormControlLabel-label': { marginLeft: '0.5em', color: colors.ink },
            }}
          />
        </div>
      </AppDialog>
    </div>
  )
}

export default ControlledStoryEditView
