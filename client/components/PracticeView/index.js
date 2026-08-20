import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { Box, FormControlLabel } from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import AppSwitch from 'Components/ui/AppSwitch'
import AppDialog from 'Components/ui/AppDialog'
import CustomTooltip from 'Components/CustomTooltip'
import { colors } from 'Assets/mui_theme/designTokens'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import {
  clearFocusedSnippet,
  resetCachedSnippets,
  dropCachedSnippet,
  getNextSnippetFromCache,
  resetCurrentSnippet,
  resetSnippets,
} from 'Utilities/redux/snippetsReducer'
import { updateShowReviewDiff } from 'Utilities/redux/userReducer'
import {
  setTouchedIds,
  setAnswers,
  setWillPause,
  setIsPaused,
  clearPractice,
} from 'Utilities/redux/practiceReducer'
import { resetAnnotations } from 'Utilities/redux/annotationsReducer'
import { getStoriesBlueFlashcards } from 'Utilities/redux/flashcardReducer'
import { useTimer } from 'Utilities/reactTimerHookCompat'
import useWindowDimensions from 'Utilities/windowDimensions'
import {
  getTextStyle,
  learningLanguageSelector,
  getMode,
  hiddenFeatures,
  dictionaryLanguageSelector,
  images,
} from 'Utilities/common'
import CurrentSnippet from 'Components/PracticeView/CurrentSnippet'
import ReportButton from 'Components/ReportButton'
import StartModal from 'Components/TimedActivityStartModal'
import MessageDialog from 'Components/MessageDialog/MessageDialog'
import PreviousSnippets from '../CommonStoryTextComponents/PreviousSnippets'
import VirtualKeyboard from './VirtualKeyboard'
import FeedbackInfoModal from '../CommonStoryTextComponents/FeedbackInfoModal'
import { keyboardLayouts } from './KeyboardLayouts'
import ProgressBar from './CurrentSnippet/ProgressBar'
import PracticeTimer from './PracticeTimer'
import ScrollArrow from '../ScrollArrow'
import Spinner from 'Components/Spinner'
import HelperSidebar from './HelperSidebar'
import CombinedChatbot from './CombinedChatbot'
import StoryTitleTranslate from './StoryTitleTranslate'

const PracticeView = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const mode = getMode()
  const intl = useIntl()

  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const isSidebarOpen = useSelector(state => state.helperSidebar?.isOpen ?? false)
  const { id } = useParams()
  const { width } = useWindowDimensions()
  const snippets = useSelector(({ snippets }) => snippets)
  const { focused: story, pending } = useSelector(({ stories }) => stories)
  const { isPaused, willPause, practiceFinished, currentAnswers } = useSelector(
    ({ practice }) => practice,
  )
  const newVocabulary = useSelector(state => state.newVocabulary.newVocabulary)
  const { show_review_diff } = useSelector(({ user }) => user.data.user)
  const [startModalOpen, setStartModalOpen] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const smallScreen = width < 700
  const snippetsTotalNum = snippets?.focused?.total_num
  const controlledPractice = mode === 'controlled-practice'
  const isLesson = location.pathname.includes('lesson')
  const timedExercise = story?.timed_exercise

  const currentSnippetId = (() => {
    if (!snippets.focused) return -1
    const { snippetid } = snippets.focused
    if (snippetid == null) return -1
    return snippetid[snippetid.length - 1]
  })()

  const currentSnippetNum = currentSnippetId + 1

  const [showDifficulty, setShowDifficulty] = useState(show_review_diff || false)
  const showPauseButton =
    (snippetsTotalNum - currentSnippetId > 1 && !practiceFinished) ||
    (snippetsTotalNum - currentSnippetId === 1 && isPaused)

  const { controls: timer } = useTimer({
    initialTime: null,
    direction: 'backward',
    startImmediately: false,
    timeToUpdate: 100,
  })

  useEffect(() => {
    if (!snippets.testTime || !snippets.focused) return

    timer.setTime(snippets.testTime * 1000)
    // timer.setTime(10000) // For testing with manual timer value

    if (startModalOpen) return

    if (!willPause && !isPaused) {
      timer.start()
    } else {
      dispatch(setWillPause(false))
      timer.stop()
    }
  }, [currentSnippetId])

  useEffect(() => {
    if (!story) {
      dispatch(getStoryAction(id, mode))
    }

    return () => {
      dispatch(resetSnippets())
      dispatch(resetCachedSnippets())
    }
  }, [])

  useEffect(() => {
    if (!isPaused && !startModalOpen) timer.start()
  }, [isPaused, startModalOpen])

  useEffect(() => {
    if (controlledPractice) {
      setStartModalOpen(true)
      dispatch(setIsPaused(true))
    }

    dispatch(resetAnnotations())
    timer.stop()
    timer.setTime(null)

    return () => {
      dispatch(clearFocusedSnippet())
    }
  }, [])

  useEffect(() => {
    if (!startModalOpen && !controlledPractice) timer.start()
  }, [startModalOpen, controlledPractice])

  useEffect(() => {
    if (!isLesson) {
      dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
    }
  }, [])

  if (!story) return null

  const handleAnswerChange = (value, word) => {
    const { surface, id: candidateId, ID, concept, sentence_id, snippet_id } = word
    const word_cue = currentAnswers[`${ID}-${candidateId}`]?.cue

    dispatch(setTouchedIds(ID))

    const newAnswer = {
      [`${ID}-${candidateId}`]: {
        correct: surface,
        users_answer: value,
        cue: word_cue,
        word_id: ID,
        id: candidateId,
        story_id: id,
        sentence_id,
        snippet_id,
        concept,
        hintsRequested: currentAnswers[`${ID}-${candidateId}`]?.hintsRequested,
        requestedHintsList: currentAnswers[`${ID}-${candidateId}`]?.requestedHintsList,
        penalties: currentAnswers[`${ID}-${candidateId}`]?.penalties,
      },
    }
    dispatch(setAnswers(newAnswer))
  }

  const handlePauseOrResumeClick = () => {
    if (isPaused) {
      dispatch(setIsPaused(false))
    } else {
      dispatch(setWillPause(true))
    }
  }

  const updateUserReviewDiff = () => {
    dispatch(updateShowReviewDiff(!showDifficulty))
    setShowDifficulty(!showDifficulty)
  }

  const getExerciseMode = () => {
    if (location.pathname.includes('listening')) return 'listening'
    if (location.pathname.includes('grammar')) return 'grammar'
    if (location.pathname.includes('speech')) return 'speech'
    return 'all'
  }

  const restartStory = () => {
    dispatch(clearPractice())
    dispatch(resetCachedSnippets())
    dispatch(resetAnnotations())
    const initSnippet = snippets.cachedSnippets[`${id}-0`]
    if (initSnippet) {
      dispatch(dropCachedSnippet(`${id}-0`))
      dispatch(getNextSnippetFromCache(`${id}-0`, initSnippet, true))
    } else dispatch(resetCurrentSnippet(id, controlledPractice, getExerciseMode()))
  }

  const showVirtualKeyboard = width > 500 && keyboardLayouts[learningLanguage]

  const getTimerContent = () => {
    if (snippets.pending || !timer.getTime()) return <Spinner inline size={60} />
    if (practiceFinished) return <ThumbUpIcon sx={{ fontSize: '1.1em', color: colors.ink }} />

    return Math.round(timer.getTime() / 1000)
  }

  return (
    <div className="cont-tall flex-col space-between">
      <div className="justify-center">
        {/* flex: 1 fills the centered row's definite width so the card stays full width even
            before content loads (rather than collapsing to its min-width). */}
        <div className={`cont ${isSidebarOpen ? 'sidebar-pushed' : ''}`} style={{ flex: 1 }}>
          <Box
            className="practice-card"
            sx={{
              position: 'relative',
              // Align the card's top with the assistant panel (HelperSidebar top: 4.5em; the
              // content starts at the 3em navbar, so 1.5em brings them to the same level).
              marginTop: '1.5em',
              backgroundColor: colors.card,
              borderRadius: '30px',
              padding: '1.5em',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            }}
          >
            <div
              className="progress-bar-cont"
              style={{
                top: smallScreen ? '.25em' : '3.25em',
                display: 'flex',
                alignItems: 'center',
                gap: '1em',
              }}
            >
              {snippetsTotalNum ? (
                <span
                  data-cy="snippet-progress"
                  style={{
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    fontWeight: 600,
                    fontSize: '0.95em',
                    color: colors.ink,
                  }}
                >
                  {currentSnippetNum} / {snippetsTotalNum}
                </span>
              ) : null}
              <div style={{ flex: 1, minWidth: 0 }}>
                <ProgressBar
                  hideLabel
                  snippetProgress={currentSnippetNum}
                  snippetsTotal={snippetsTotalNum}
                  progress={(currentSnippetNum / snippetsTotalNum).toFixed(2)}
                />
              </div>
              {hiddenFeatures && (
                <CustomTooltip
                  title={intl.formatMessage({ id: 'customize-story-practice-EXPLAIN' })}
                >
                  <span
                    onClick={() => setSettingsOpen(true)}
                    data-cy="practice-settings"
                    style={{ display: 'inline-flex', cursor: 'pointer', flexShrink: 0 }}
                  >
                    <img src={images.circleSettings} alt="" style={{ width: 28, height: 28 }} />
                  </span>
                </CustomTooltip>
              )}
            </div>
            {timedExercise && (
              <PracticeTimer
                controlledPractice={controlledPractice}
                timerContent={getTimerContent()}
                showPauseButton={showPauseButton}
                handlePauseOrResumeClick={handlePauseOrResumeClick}
              />
            )}

            <div
              className="story-title"
              style={{
                ...getTextStyle(learningLanguage, 'title'),
                width: `${controlledPractice ? '75%' : '100%'}`,
                display: 'flex',
                alignItems: 'baseline',
              }}
            >
              {!pending && <span>{story.title}</span>}
              {!pending && <StoryTitleTranslate title={story.title} />}
            </div>
            {story.url && !pending && (
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '4px 16px',
                  borderRadius: 999,
                  border: `1px solid ${colors.border}`,
                  fontWeight: 500,
                  fontSize: 14,
                  color: colors.ink,
                  textDecoration: 'none',
                }}
              >
                <FormattedMessage id="Source" />
              </a>
            )}
            <PreviousSnippets showDifficulty={showDifficulty} />            
            <CurrentSnippet
              storyId={id}
              handleInputChange={handleAnswerChange}
              timer={timer}
              numSnippets={story?.paragraph?.length}
              isLesson={isLesson}
              setShowMessageDialog={setShowMessageDialog}
              timedExercise={timedExercise}
            />
            <ScrollArrow />

            {willPause && !isPaused && (
              <div
                className="justify-center"
                style={{ color: 'rgb(81, 138, 248)', fontWeight: '500' }}
              >
                <FormattedMessage id="pausing-after-this-snippet" />
              </div>
            )}
          </Box>

          {showVirtualKeyboard && (
            <div>
              <VirtualKeyboard />
            </div>
          )}
          {width >= 500 ? (
            <div className="flex-col align-end">
              <ReportButton />
            </div>
          ) : (
            <div className="mb-nm">
              <ReportButton />
            </div>
          )}
        </div>
        {showMessageDialog && (
          <MessageDialog
            continueAction={restartStory}
            setShow={setShowMessageDialog}
            storyId={id}
            storyTitle={story?.title}
            blueCardCount={newVocabulary}
          />
        )}
        {timedExercise && (
          <StartModal
            open={startModalOpen}
            setOpen={setStartModalOpen}
            activity="control-story"
            onBackClick={() => navigate('/library')}
            onStart={() => dispatch(setIsPaused(false))}
          />
        )}
        <HelperSidebar>
          <CombinedChatbot />
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
            control={<AppSwitch checked={showDifficulty} onChange={updateUserReviewDiff} />}
            label={intl.formatMessage({ id: 'show-difficulty-level' })}
            sx={{
              m: 0,
              '& .MuiFormControlLabel-label': {
                marginLeft: '0.5em',
                color: colors.ink,
              },
            }}
          />
        </div>
      </AppDialog>
    </div>
  )
}

export default PracticeView
