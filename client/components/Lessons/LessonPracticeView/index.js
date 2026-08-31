import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Box, FormControlLabel } from '@mui/material'
import AppSwitch from 'Components/ui/AppSwitch'
import AppDialog from 'Components/ui/AppDialog'
import CustomTooltip from 'Components/CustomTooltip'
import { colors } from 'Assets/mui_theme/designTokens'
import {
  clearFocusedSnippet,
  resetSnippets,
  resetCachedSnippets,
} from 'Utilities/redux/snippetsReducer'
import { updateShowReviewDiff } from 'Utilities/redux/userReducer'
import {
  setTouchedIds,
  setAnswers,
  setWillPause,
} from 'Utilities/redux/practiceReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import { clearContextTranslation } from 'Utilities/redux/contextTranslationReducer'
import { getLessonInstance, clearLessonInstanceState } from 'Utilities/redux/lessonInstanceReducer'
import { resetAnnotations } from 'Utilities/redux/annotationsReducer'
import { useTimer } from 'Utilities/reactTimerHookCompat'
import useWindowDimensions from 'Utilities/windowDimensions'
import PracticeChatbot from 'Components/ChatBot/PracticeChatbot'
import { learningLanguageSelector, getMode, hiddenFeatures, images } from 'Utilities/common'
import CurrentSnippet from 'Components/PracticeView/CurrentSnippet'
import DictionaryHelp from 'Components/DictionaryHelp'
import ReportButton from 'Components/ReportButton'
import StartModal from 'Components/TimedActivityStartModal'
import PreviousSnippets from 'Components/CommonStoryTextComponents/PreviousSnippets'
import VirtualKeyboard from 'Components/PracticeView/VirtualKeyboard'
import FeedbackInfoModal from 'Components/CommonStoryTextComponents/FeedbackInfoModal'
import { keyboardLayouts } from 'Components/PracticeView/KeyboardLayouts'
import ProgressBar from 'Components/PracticeView/CurrentSnippet/ProgressBar'
import ScrollArrow from 'Components/ScrollArrow'
import PracticeCompletedEncouragement from '../../Encouragements/PracticeCompletedEncouragement'
import LessonPracticeTopicsHelp from './LessonPracticeTopicsHelp'
import Spinner from 'Components/Spinner'
import CombinedChatbot from 'Components/PracticeView/CombinedChatbot'
import HelperSidebar from 'Components/PracticeView/HelperSidebar'

const LessonPracticeView = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const mode = getMode()

  const intl = useIntl()

  const { width } = useWindowDimensions()
  const { show_review_diff } = useSelector(({ user }) => user.data.user)
  const learningLanguage = useSelector(learningLanguageSelector)
  const snippets = useSelector(({ snippets }) => snippets)
  const isSidebarOpen = useSelector(state => state.helperSidebar?.isOpen ?? false)
  const { pending: lesson_instance_pending, lesson: lesson_instance } = useSelector(
    ({ lessonInstance }) => lessonInstance,
  )
  const { isPaused, willPause, currentAnswers } = useSelector(
    ({ practice }) => practice,
  )
  const [startModalOpen, setStartModalOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [showPracticeCompletedEncouragement, setShowPracticeCompletedEncouragement] =
    useState(false)
  const [currentSnippetNum, setCurrentSnippetNum] = useState(1)
  const [snippetsTotalNum, setSnippetsTotalNum] = useState(10)
  const [showDifficulty, setShowDifficulty] = useState(show_review_diff || false)

  const TIMER_START_DELAY = 2000
  const smallScreen = width < 700
  const controlledPractice = mode === 'controlled-practice'
  const isGroupLesson = location.pathname.includes('/group')
  const { id: groupId } = useParams()

  const { controls: timer } = useTimer({
    initialTime: null,
    direction: 'backward',
    startImmediately: false,
    timeToUpdate: 100,
  })

  useEffect(() => {
    setCurrentSnippetNum(0)
    if (isGroupLesson) {
      dispatch(getLessonInstance(groupId))
    } else dispatch(getLessonInstance())
    dispatch(clearTranslationAction())
    dispatch(clearContextTranslation())

    return () => {
      dispatch(clearLessonInstanceState())
      dispatch(resetSnippets())
      dispatch(resetCachedSnippets())
    }
  }, [])

  useEffect(() => {
    if (controlledPractice) setStartModalOpen(true)

    dispatch(resetAnnotations())
    timer.stop()
    timer.setTime(null)

    return () => {
      dispatch(clearFocusedSnippet())
    }
  }, [])

  useEffect(() => {
    setCurrentSnippetNum(snippets.previous.length + 1)
  }, [snippets.focused])

  useEffect(() => {
    if (!snippets.testTime || !snippets.focused) return

    timer.setTime(snippets.testTime * 1000)

    if (startModalOpen) return

    if (!willPause && !isPaused) {
      setTimeout(() => {
        timer.start()
      }, TIMER_START_DELAY)
    } else {
      dispatch(setWillPause(false))
      timer.stop()
    }
  }, [currentSnippetNum])

  useEffect(() => {
    if (!isPaused) timer.start()
  }, [isPaused])

  const startOvertLessonSnippets = () => {
    setCurrentSnippetNum(0)
    dispatch(clearLessonInstanceState())
    dispatch(resetSnippets())
    if (isGroupLesson) {
      dispatch(getLessonInstance(groupId))
    } else dispatch(getLessonInstance())
    dispatch(clearTranslationAction())
    dispatch(clearContextTranslation())
  }

  const handleAnswerChange = (value, word) => {
    const { surface, id: candidateId, ID, concept, sentence_id, snippet_id } = word

    dispatch(setTouchedIds(ID))

    const newAnswer = {
      [`${ID}-${candidateId}`]: {
        correct: surface,
        users_answer: value,
        word_id: ID,
        id: candidateId,
        story_id: word.story_id,
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

  const updateUserReviewDiff = () => {
    dispatch(updateShowReviewDiff(!showDifficulty))
    setShowDifficulty(!showDifficulty)
  }

  const showVirtualKeyboard = width > 500 && keyboardLayouts[learningLanguage]

  if (!lesson_instance_pending && lesson_instance && lesson_instance?.lesson_id) {
    return (
      <div>
        <div className="cont-tall flex-col space-between">
          <div className="justify-center">
            {/* flex: 1 fills the centered row's definite width so the card stays full width even
                before content loads (rather than collapsing to its min-width). */}
            <div className={`cont ${isSidebarOpen ? 'sidebar-pushed' : ''}`} style={{ flex: 1 }}>
              <Box
                className="lesson-practice-card"
                sx={{
                  position: 'relative',
                  // Align the card's top with the assistant panel (HelperSidebar top: 4.5em; the
                  // content starts at the 3em navbar, so 1.5em brings them to the same level).
                  marginTop: '0',
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
                <PreviousSnippets showDifficulty={showDifficulty} isLesson={true} />
                <hr />
                <CurrentSnippet
                  storyId={null}
                  handleInputChange={handleAnswerChange}
                  timer={timer}
                  numSnippets={snippetsTotalNum}
                  lessonId={lesson_instance?.lesson_id}
                  groupId={groupId}
                  lessonStartOver={startOvertLessonSnippets}
                  currentSnippetNum={currentSnippetNum}
                  setShowPracticeCompletedEncouragement={setShowPracticeCompletedEncouragement}
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
            <StartModal
              open={startModalOpen}
              setOpen={setStartModalOpen}
              activity="control-story"
              onBackClick={() => navigate('/library')}
            />
            {showPracticeCompletedEncouragement && (
              <div
                className={
                  width > 700 ? 'draggable-encouragement' : 'draggable-encouragement-mobile'
                }
              >
                <div className="col-flex">
                  <PracticeCompletedEncouragement
                    practiceType="lesson"
                    setShow={setShowPracticeCompletedEncouragement}
                    continueAction={startOvertLessonSnippets}
                  />
                </div>
              </div>
            )}
            {/* <div className="dictionary-and-annotations-cont">
              
              <DictionaryHelp />
            </div> */}
            {/* <PracticeChatbot /> */}
            <HelperSidebar>
              <LessonPracticeTopicsHelp selectedTopics={snippets?.focused?.topics} />
              <CombinedChatbot />
            </HelperSidebar>

            <FeedbackInfoModal />
          </div>
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
  } else {
    return <Spinner fullHeight size={60} spinnerColor={colors.ink} textColor={colors.ink} text={intl.formatMessage({ id: 'loading' })} />
  }
}

export default LessonPracticeView
