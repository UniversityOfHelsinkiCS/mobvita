import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useHistory } from 'react-router-dom'
import {
  Divider,
  Segment,
  Popup,
  Icon,
  Header,
  Checkbox,
  Dropdown,
  Button as SemanticButton,
  Modal,
  Tab,
  TabPane,
} from 'semantic-ui-react'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import {
  getStoryAction,
  getStoryLoadingProgress,
  getStudentStoryAction,
  removeStory,
  updateExerciseTopics,
  updateTempExerciseTopics,
} from 'Utilities/redux/storiesReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import { clearContextTranslation } from 'Utilities/redux/contextTranslationReducer'
import { resetAnnotations, setAnnotations } from 'Utilities/redux/annotationsReducer'
import {
  updateShowReviewDiff,
  updatePreviewExer,
  practiceTourViewed,
  updateBlankFilling,
  updateAudioTask,
  updateSpeechTask,
  updateMultiChoice,
} from 'Utilities/redux/userReducer'
import { startPracticeTour } from 'Utilities/redux/tourReducer'
import {
  learningLanguageSelector,
  getTextStyle,
  getMode,
  hiddenFeatures,
  cefrNum2Cefr,
} from 'Utilities/common'
import DictionaryHelp from 'Components/DictionaryHelp'
import AnnotationBox from 'Components/AnnotationBox'
import Spinner from 'Components/Spinner'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import FeedbackInfoModal from 'Components/CommonStoryTextComponents/FeedbackInfoModal'
import ReportButton from 'Components/ReportButton'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import StoryTopics from 'Components/StoryView/StoryTopics'
import Footer from '../Footer'
import ScrollArrow from '../ScrollArrow'
import ListeningExerciseSettings from 'Components/ListeningExerciseSettings'
import SelectGrammarLevel from 'Components/Lessons/SelectGrammarLevel'

import './ReadViewsStyles.css'

const SettingToggle = ({ translationId, ...props }) => {
  return (
    <Checkbox toggle label={{ children: <FormattedHTMLMessage id={translationId} /> }} {...props} />
  )
}

const ReadViews = ({ match }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const { width } = useWindowDimensions()
  const mode = getMode()
  const history = useHistory()
  const [currentStudent, setCurrentStudent] = useState(null)
  const isGroupReview = history.location.pathname.includes('group/review')
  const isGroupPreview = history.location.pathname.includes('group/preview')
  const { show_review_diff, show_preview_exer, oid } = useSelector(({ user }) => user.data.user)
  const { story, pending, error, focusedRequestId } = useSelector(({ stories, locale }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
    error: stories.error,
    focusedRequestId: stories.focusedRequestId,
    locale,
  }))
  const showPracticeDropdown = useSelector(state => state.dropdown.showPracticeDropdown)

  const bigScreen = width > 700

  const defineFeedback = () => {
    if (mode === 'review') return false
    if (mode === 'preview') return true
    return true
  }

  const [hideFeedback, setHideFeedback] = useState(defineFeedback())
  const [focusedConcept, setFocusedConcept] = useState(null)
  const [hasShownStoryContent, setHasShownStoryContent] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const initialPreviewStoryFetchedRef = useRef(false)
  const loadingPollRef = useRef(null)
  const storyPollRef = useRef(null)
  const { lesson_topics, lessons } = useSelector(({ metadata }) => metadata)
  const { data: user, pending: userPending } = useSelector(({ user }) => user)
  const { progress, storyId, exerciseReady } = useSelector(({ uploadProgress }) => uploadProgress)
  const loadingProgressByStory = useSelector(({ stories }) => stories.loadingProgress || {})
  const currentGroupId = useSelector(({ user }) => user.data.user.last_selected_group)
  const { groups: totalGroups, pending: groupsPending } = useSelector(({ groups }) => groups)
  const currentGroup = totalGroups.find(group => group.group_id === currentGroupId)
  const [open, setOpen] = useState(false)
  const [topicsModal, setTopicsModal] = useState(false)
  const dropDownMenuText = currentStudent
    ? `${currentStudent?.userName} (${currentStudent?.email})`
    : intl.formatMessage({ id: 'group-review-dropdown-placeholder' })

  const truncateStudentName = studentName => {
    if (studentName.length > 50) return `${studentName.slice(0, 50)}...`
    return studentName
  }

  const teacherView = useSelector(({ user }) => user.data.teacherView)

  const studentOptions = currentGroup?.students
    .map(student => ({
      key: student._id,
      text: truncateStudentName(`${student?.userName} (${student?.email})`),
      value: JSON.stringify(student),
    }))
    .sort(function (a, b) {
      const textA = a.text.toUpperCase()
      const textB = b.text.toUpperCase()
      return textA < textB ? -1 : textA > textB ? 1 : 0
    })

  const [previewToggleOn, setPreviewToggleOn] = useState(show_preview_exer || false)
  const [showDifficulty, setShowDifficulty] = useState(show_review_diff || false)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { id } = match.params
  const routeStory =
    story &&
    (String(story?._id) === String(id) || (!story?._id && String(focusedRequestId) === String(id)))
      ? story
      : null
  const storyLoadingProgress = loadingProgressByStory[id] || {}
  const hasRenderableStoryContent =
    !!routeStory?.title || (Array.isArray(routeStory?.paragraph) && routeStory.paragraph.length > 0)
  const storyProgress = Number(routeStory?.progress ?? 0)
  const polledProgress = Number(storyLoadingProgress.progress)
  const processingProgress = Number.isFinite(polledProgress) ? polledProgress : storyProgress
  const processingCurrentStory = String(id) === String(storyId)
  const processingComplete =
    processingProgress >= 1 || (processingCurrentStory && Number(progress) >= 1)
  const preProcessingReadyFromEndpoint = Number(storyLoadingProgress.progress) >= 0.4
  const loadingReadyFromEndpoint =
    storyLoadingProgress.exercise_ready === true || Number(storyLoadingProgress.progress) >= 1
  const preProcessingReadyFromUploadState = processingCurrentStory && Number(progress) >= 0.4
  const loadingReadyFromUploadState =
    processingCurrentStory && (exerciseReady === true || Number(progress) >= 1)
  const preProcessingReady =
    preProcessingReadyFromEndpoint || preProcessingReadyFromUploadState || storyProgress >= 0.4
  const loadingReady = loadingReadyFromEndpoint || loadingReadyFromUploadState || storyProgress >= 1
  const processingFinished = storyProgress >= 1
  const isPreviewMode = mode === 'preview'
  const isStudentPreview = mode === 'preview' && !teacherView
  const teacherLoadingProgress = Number(storyLoadingProgress.progress)
  const teacherProcessingComplete = Number.isFinite(teacherLoadingProgress)
    ? teacherLoadingProgress === 1
    : false
  const shouldFetchStoryDirectly =
    !isPreviewMode ||
    hasRenderableStoryContent ||
    (isStudentPreview ? preProcessingReady : teacherProcessingComplete)
  const isStudentPreviewProcessing =
    isStudentPreview && !preProcessingReady && !hasShownStoryContent && !hasRenderableStoryContent

  const isTeacherPreviewProcessing = isPreviewMode && teacherView && !teacherProcessingComplete
  const rawProcessingProgress = Number.isFinite(teacherLoadingProgress) ? teacherLoadingProgress : 0
  const processingPercent = Math.round(
    Math.max(
      0,
      Math.min(
        100,
        rawProcessingProgress <= 1 ? rawProcessingProgress * 100 : rawProcessingProgress
      )
    )
  )
  const difficultyValueDisplay =
    routeStory?.difficulty_value === null ||
    routeStory?.difficulty_value === undefined ||
    routeStory?.difficulty_value === ''
      ? ''
      : cefrNum2Cefr(routeStory?.difficulty_value)

  const ownedRouteStory = oid === routeStory?.owner

  const readingOn = !!user?.user?.reading_comprehension
  const disableOtherPracticeToggles = userPending || readingOn

  const handleStudentChange = value => {
    const parsedValue = JSON.parse(value)
    setCurrentStudent(parsedValue)
    dispatch(getStudentStoryAction(id, currentGroupId, parsedValue._id))
  }

  useEffect(() => {
    if (!user?.user.has_seen_practice_tour) {
      dispatch(practiceTourViewed())
      dispatch(startPracticeTour())
    }
  }, [])

  useEffect(() => {
    initialPreviewStoryFetchedRef.current = false
    if (loadingPollRef.current) {
      clearInterval(loadingPollRef.current)
      loadingPollRef.current = null
    }
    if (storyPollRef.current) {
      clearInterval(storyPollRef.current)
      storyPollRef.current = null
    }
  }, [id, mode])

  useEffect(() => {
    if (teacherView) setHideFeedback(false)
    if (isPreviewMode) {
      if (shouldFetchStoryDirectly && !initialPreviewStoryFetchedRef.current) {
        initialPreviewStoryFetchedRef.current = true
        dispatch(getStoryAction(id, mode))
      }
    } else {
      dispatch(getStoryAction(id, mode))
    }
    dispatch(clearTranslationAction())
    dispatch(clearContextTranslation())
    dispatch(resetAnnotations())
  }, [dispatch, id, isPreviewMode, mode, shouldFetchStoryDirectly, teacherView])

  useEffect(() => {
    if (routeStory) {
      const storyWords = routeStory.paragraph.flat(1)
      dispatch(setAnnotations(storyWords))
    }
  }, [dispatch, routeStory])

  useEffect(() => {
    setHasShownStoryContent(false)
  }, [id])

  useEffect(() => {
    if (hasRenderableStoryContent) {
      setHasShownStoryContent(true)
    }
  }, [hasRenderableStoryContent])

  useEffect(() => {
    if (pending || routeStory || !error) return
    history.replace('/library')
  }, [error, history, pending, routeStory])

  useEffect(() => {
    if (loadingPollRef.current) {
      clearInterval(loadingPollRef.current)
      loadingPollRef.current = null
    }

    if (!id || !isPreviewMode) return

    dispatch(getStoryLoadingProgress(id))

    if (isStudentPreview ? processingComplete : teacherProcessingComplete) return

    loadingPollRef.current = setInterval(() => {
      dispatch(getStoryLoadingProgress(id))
    }, 10000)

    return () => {
      if (loadingPollRef.current) {
        clearInterval(loadingPollRef.current)
        loadingPollRef.current = null
      }
    }
  }, [dispatch, id, isPreviewMode, isStudentPreview, processingComplete, teacherProcessingComplete])

  useEffect(() => {
    if (storyPollRef.current) {
      clearInterval(storyPollRef.current)
      storyPollRef.current = null
    }

    if (!id || !isPreviewMode) return

    if (isStudentPreview) {
      if (!preProcessingReady || processingFinished) return

      storyPollRef.current = setInterval(() => {
        dispatch(getStoryAction(id, mode))
      }, 10000)

      return () => {
        if (storyPollRef.current) {
          clearInterval(storyPollRef.current)
          storyPollRef.current = null
        }
      }
    }

    if (!teacherProcessingComplete || hasRenderableStoryContent) return

    storyPollRef.current = setInterval(() => {
      dispatch(getStoryAction(id, mode))
    }, 10000)

    return () => {
      if (storyPollRef.current) {
        clearInterval(storyPollRef.current)
        storyPollRef.current = null
      }
    }
  }, [
    dispatch,
    hasRenderableStoryContent,
    id,
    isPreviewMode,
    isStudentPreview,
    mode,
    preProcessingReady,
    processingFinished,
    teacherProcessingComplete,
  ])

  if (!user || groupsPending) return <Spinner fullHeight size={60} />
  if (isTeacherPreviewProcessing)
    return (
      <Spinner
        fullHeight
        size={60}
        text={intl.formatMessage(
          { id: 'processing-story-with-percent' },
          { progress: processingPercent }
        )}
      />
    )
  if (!routeStory && !isStudentPreview) return <Spinner fullHeight size={60} />

  const showFooter = width > 640
  const underProcessing = isStudentPreview
    ? !loadingReady || storyProgress !== 1
    : (progress !== 0 && processingCurrentStory) || storyProgress !== 1

  const updateUserReviewDiff = () => {
    dispatch(updateShowReviewDiff(!showDifficulty))
    setShowDifficulty(!showDifficulty)
  }

  const updateUserPreviewExer = () => {
    dispatch(updatePreviewExer(!previewToggleOn))
    setPreviewToggleOn(!previewToggleOn)
    setHideFeedback(!hideFeedback)
  }

  const handlePracticeButtonClick = () => {
    if (showPracticeDropdown) dispatch({ type: 'CLOSE_PRACTICE_DROPDOWN' })
    else dispatch({ type: 'SHOW_PRACTICE_DROPDOWN' })
  }

  const handle_cog_click = () => {
    setOpen(true)
  }

  const handleDeleteStory = () => {
    dispatch(removeStory(id))
    history.replace('/library')
  }

  const StoryFunctionsDropdown = () => {
    const chooseDropdownMenuSide = () => {
      if (bigScreen) return null
      return { right: 'auto', left: 0 }
    }

    return (
      <>
        {routeStory?.control_story ? (
          <SemanticButton
            as={Link}
            to={`/stories/${id}/controlled-practice`}
            style={{ backgroundColor: 'rgb(50, 170, 248)', color: 'white' }}
          >
            <FormattedMessage id="tailored-practice-mode" />
          </SemanticButton>
        ) : (
          preProcessingReady && (
            <>
              <Popup
                content={intl.formatMessage({ id: 'customize-story-practice-EXPLAIN' })}
                trigger={
                  <Icon
                    name="cog"
                    size="large"
                    style={{ color: '#0088CB', cursor: 'pointer', marginRight: '12px' }}
                    onClick={handle_cog_click}
                  />
                }
                inverted
              />
              {!teacherView && (
                <SemanticButton
                  as={Link}
                  to={
                    user?.user?.reading_comprehension
                      ? `/stories/${id}/reading_practice`
                      : `/stories/${id}/practice/`
                  }
                  className="practice-tour-start-practice-story"
                  style={{ backgroundColor: 'rgb(50, 170, 248)', color: 'white' }}
                  disabled={(routeStory?.topics || []).length === 0 && ownedRouteStory}
                >
                  <FormattedMessage id="start-practice-story" />
                </SemanticButton>
              )}
              {teacherView && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <SemanticButton color="yellow" as={Link} to={`/stories/${id}/edit/`}>
                    <FormattedMessage id="edit" />
                  </SemanticButton>
                  <SemanticButton color="red" onClick={() => setConfirmationOpen(true)}>
                    <FormattedMessage id="Delete" />
                  </SemanticButton>
                </div>
              )}
            </>
          )
        )}
      </>
    )
  }

  const setSelectedTopics = topics => {
    dispatch(updateExerciseTopics(topics, id))
    dispatch(updateTempExerciseTopics(topics, id))
  }

  const panes = [
    {
      menuItem: intl.formatMessage({ id: 'Grammar topics' }),
      render: () => (
        <TabPane
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '500px',
          }}
        >
          <h1 style={{ marginBottom: '100px' }}>
            <FormattedMessage id="select-lesson-grammar" />
          </h1>
          <SelectGrammarLevel
            topicInstance={{
              topic_ids: routeStory?.topics || [],
              instancePending: pending || !routeStory,
            }}
            editable
            setSelectedTopics={setSelectedTopics}
            selectedTopicIds={routeStory?.topics || []}
            showPerf
            setShowPerf={setShowDifficulty}
            lessons={lessons}
            currentStepIndex={2}
          />
        </TabPane>
      ),
    },
    {
      menuItem: intl.formatMessage({ id: 'listening-exercises' }),
      render: () => (
        <TabPane
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '500px',
          }}
        >
          <ListeningExerciseSettings />
        </TabPane>
      ),
    },
  ]

  return (
    <div className="cont-tall flex-col space-between align-center pt-sm">
      <div className="flex mb-nm">
        <div>
          <Segment data-cy="readmodes-text" className="cont" style={getTextStyle(learningLanguage)}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Header className="space-between" style={getTextStyle(learningLanguage, 'title')}>
                <div className="story-title">
                  {(!isStudentPreviewProcessing || !!routeStory?.title || !processingComplete) && (
                    <span className="header-text practice-tour-start">
                      {routeStory?.title || ''}
                    </span>
                  )}
                </div>
              </Header>
              {(preProcessingReady || processingFinished) && (
                <div
                  className="cefr-level"
                  style={{
                    background:
                      String(difficultyValueDisplay).trim() === '' ? '#ffffff' : '#b7fcff',
                  }}
                >
                  {difficultyValueDisplay}
                </div>
              )}
            </div>
            {underProcessing && preProcessingReady && !processingComplete && (
              <div className="story-not-processed">
                <div className="story-not-processed-text">
                  {intl.formatMessage({ id: 'story-not-yet-processed' }).replace(/\\n/g, '\n')}
                </div>
              </div>
            )}
            <div className={bigScreen && 'space-between'} style={{ alignItems: 'center' }}>
              <div>
                {mode === 'practice-preview' && <div />}
                {preProcessingReady && mode === 'preview' && (
                  <Checkbox
                    className="highlight-exercises"
                    toggle
                    label={intl.formatMessage({ id: 'show preview' })}
                    checked={previewToggleOn}
                    onChange={updateUserPreviewExer}
                    style={{ paddingTop: '.5em' }}
                  />
                )}
                {!['practice-preview', 'preview'].includes(mode) && hiddenFeatures && (
                  <Checkbox
                    toggle
                    label={intl.formatMessage({ id: 'show-difficulty-level' })}
                    checked={showDifficulty}
                    onChange={updateUserReviewDiff}
                    style={{ paddingTop: '.5em' }}
                  />
                )}
              </div>
              {bigScreen ? (
                <>
                  {isGroupReview && teacherView && (
                    <div className="row-flex" style={{ marginLeft: '3em' }}>
                      <span style={{ marginRight: '.5em' }}>
                        <FormattedMessage id="student" />:{' '}
                      </span>
                      <Dropdown
                        text={dropDownMenuText}
                        selection
                        fluid
                        options={studentOptions}
                        onChange={(_, { value }) => handleStudentChange(value)}
                      />
                    </div>
                  )}
                  {!isGroupPreview && !isGroupReview && (
                    <div className="row-flex" style={{ marginLeft: '3em' }}>
                      <StoryFunctionsDropdown />
                    </div>
                  )}
                </>
              ) : (
                <div>
                  {isGroupReview && teacherView && (
                    <div className="row-flex" style={{ marginLeft: '3em' }}>
                      <span style={{ marginRight: '.5em' }}>
                        <FormattedMessage id="student" />:{' '}
                      </span>
                      <Dropdown
                        text={dropDownMenuText}
                        selection
                        fluid
                        options={studentOptions}
                        onChange={(_, { value }) => handleStudentChange(value)}
                      />
                    </div>
                  )}
                  {!isGroupPreview && !isGroupReview && <StoryFunctionsDropdown />}
                </div>
              )}
            </div>
            <Divider />
            {isStudentPreviewProcessing ? (
              <div className="justify-center" style={{ minHeight: '16rem' }}>
                <Spinner size={60} text={intl.formatMessage({ id: 'loading-story' })} />
              </div>
            ) : (
              (routeStory?.paragraph || []).map((paragraph, index) => (
                <React.Fragment key={index}>
                  <TextWithFeedback
                    hideFeedback={!show_preview_exer}
                    showDifficulty={showDifficulty}
                    mode={mode}
                    snippet={paragraph}
                    answers={null}
                    focusedConcept={focusedConcept}
                    show_preview_exer
                  />
                  <br />
                  <br />
                </React.Fragment>
              ))
            )}
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
            conceptCount={routeStory?.concept_count || 0}
            focusedConcept={focusedConcept}
            setFocusedConcept={setFocusedConcept}
            loadingReady={processingFinished}
          />
          <DictionaryHelp />
          <AnnotationBox />
        </div>
        <FeedbackInfoModal />
      </div>
      {showFooter && <Footer />}
      <Modal
        size="tiny"
        open={open}
        dimmer="inverted"
        onClose={() => setOpen(false)}
        closeIcon={{ style: { top: '1rem', right: '2rem' }, color: 'black', name: 'close' }}
      >
        <Modal.Header>
          <FormattedMessage id="practice-settings" />
        </Modal.Header>
        <Modal.Content>
          <div className="flex-col gap-row-nm">
            <SettingToggle
              translationId="practice-grammar-cloze-exercises"
              checked={user?.user.blank_filling}
              onChange={() => dispatch(updateBlankFilling(!user?.user.blank_filling))}
              disabled={disableOtherPracticeToggles}
            />
            <SettingToggle
              translationId="practice-grammar-MC-exercises"
              checked={user?.user.multi_choice}
              onChange={() => dispatch(updateMultiChoice(!user?.user.multi_choice))}
              disabled={disableOtherPracticeToggles}
            />
            <SettingToggle
              translationId="practice-listening-cloze-exercises"
              checked={user?.user.task_audio}
              onChange={() => dispatch(updateAudioTask(!user?.user.task_audio))}
              disabled={disableOtherPracticeToggles}
            />
            {hiddenFeatures && (
              <SettingToggle
                translationId="practice-pronunciation-exercises"
                checked={user?.user.task_speech}
                onChange={() => dispatch(updateSpeechTask(!user?.user.task_speech))}
                disabled={disableOtherPracticeToggles}
              />
            )}
          </div>
        </Modal.Content>
      </Modal>
      <Modal
        open={topicsModal}
        onClose={() => setTopicsModal(false)}
        size="large"
        closeIcon={{ style: { top: '1.0535rem', right: '1rem' }, color: 'black', name: 'close' }}
      >
        <Modal.Header>
          <FormattedMessage id="practice-settings" />
        </Modal.Header>
        <Tab panes={panes} />
      </Modal>
      <ConfirmationWarning
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        action={handleDeleteStory}
      >
        <FormattedMessage id="story-remove-confirm" />
      </ConfirmationWarning>
    </div>
  )
}

export default ReadViews
