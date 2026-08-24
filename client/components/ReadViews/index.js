import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React, { useState, useEffect, useRef, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const EMPTY_LOADING_PROGRESS = {}
import { FormControlLabel, Box } from '@mui/material'
import { images } from 'Utilities/common'
import { colors } from 'Assets/mui_theme/designTokens'
import AppSwitch from 'Components/ui/AppSwitch'
import AppSelect from 'Components/ui/AppSelect'
import TopicsSelect from 'Components/StoryView/TopicsSelect'
import AppDialog from 'Components/ui/AppDialog'
import AppTabs from 'Components/ui/AppTabs'
import AppButton from 'Components/AppButton'
import { FormattedMessage, useIntl } from 'react-intl';
import CustomTooltip from 'Components/CustomTooltip'
import useWindowDimensions from 'Utilities/windowDimensions'
import {
  getAllStories,
  getStoryAction,
  getStoryLoadingProgress,
  getStudentStoryAction,
  removeStory,
  updateExerciseTopics,
  updateTempExerciseTopics } from 'Utilities/redux/storiesReducer'
import { clearTranslationAction } from 'Utilities/redux/translationReducer'
import { clearContextTranslation } from 'Utilities/redux/contextTranslationReducer'
import { resetAnnotations, setAnnotations } from 'Utilities/redux/annotationsReducer'
import { getGroups } from 'Utilities/redux/groupsReducer'
import {
  updateShowReviewDiff,
  updatePreviewExer,
  practiceTourViewed,
  updateBlankFilling,
  updateAudioTask,
  updateSpeechTask,
  updateMultiChoice } from 'Utilities/redux/userReducer'
import { startPracticeTour } from 'Utilities/redux/tourReducer'
import {
  learningLanguageSelector,
  getTextStyle,
  getMode,
  hiddenFeatures,
  cefrNum2Cefr,
  ACCESS,
  useHasAccess } from 'Utilities/common'
import DictionaryHelp from 'Components/DictionaryHelp'
import Spinner from 'Components/Spinner'
import TextWithFeedback from 'Components/CommonStoryTextComponents/TextWithFeedback'
import FeedbackInfoModal from 'Components/CommonStoryTextComponents/FeedbackInfoModal'
import ReportButton from 'Components/ReportButton'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import ScrollArrow from '../ScrollArrow'
import ListeningExerciseSettings from 'Components/ListeningExerciseSettings'
import SelectGrammarLevel from 'Components/Lessons/SelectGrammarLevel'
import CombinedChatbot from 'Components/PracticeView/CombinedChatbot'
import HelperSidebar from 'Components/PracticeView/HelperSidebar'
import StoryTitleTranslate from 'Components/PracticeView/StoryTitleTranslate'

import './ReadViewsStyles.css'

const SettingToggle = ({ translationId, ...props }) => {
  return (
    <FormControlLabel
      control={<AppSwitch {...props} />}
      label={<FormattedHTMLMessage id={translationId} />}
      sx={{ '& .MuiFormControlLabel-label': { marginLeft: '0.5em', color: colors.ink } }}
    />
  )
}

const ReadViews = ({ match }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const { width } = useWindowDimensions()
  const mode = getMode()
  const navigate = useNavigate()
  const location = useLocation()

  const [currentStudent, setCurrentStudent] = useState(null)
  const isGroupReview = location.pathname.includes('group/review')
  const isGroupPreview = location.pathname.includes('group/preview')
  const { show_review_diff, show_preview_exer, oid } = useSelector(({ user }) => user.data.user)

  // Topic window is high-access only (hidden for access <= 1).
  const canSeeTopics = useHasAccess(ACCESS.HIGH)

  const story = useSelector(state => state.stories.focused)
  const pending = useSelector(state => state.stories.focusedPending)
  const focusedStudentId = useSelector(state => state.stories.focusedStudentId)
  const studentPending = useSelector(state => !!(state.stories.focusedPending && state.stories.focusedStudentId))
  const error = useSelector(state => state.stories.error)
  const focusedRequestId = useSelector(state => state.stories.focusedRequestId)
  const locale = useSelector(state => state.locale)
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
  const loadingProgressByStory = useSelector(({ stories }) => stories.loadingProgress ?? EMPTY_LOADING_PROGRESS)
  const currentGroupId = useSelector(({ user }) => user.data.user.last_selected_group)
  const isSidebarOpen = useSelector(state => state.helperSidebar?.isOpen ?? false)
  const { groups: totalGroups, pending: groupsPending } = useSelector(({ groups }) => groups)
  const currentGroup = totalGroups.find(group => group.group_id === currentGroupId)
  const [open, setOpen] = useState(false)
  const [topicsModal, setTopicsModal] = useState(false)
  const [topicsTab, setTopicsTab] = useState('grammar')
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
      value: JSON.stringify(student) }))
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

  // Fetches students for group review/preview if not already fetched
  useEffect(() => {
    if ((isGroupReview || isGroupPreview) && totalGroups.length === 0 && !groupsPending) {
      dispatch(getGroups())
    }
  }, [dispatch, isGroupReview, isGroupPreview, totalGroups.length, groupsPending])

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
    navigate('/library', { replace: true })
  }, [error, navigate, pending, routeStory])

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
    }, 3000)

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
      }, 3000)

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

  if (!user || groupsPending) return <Spinner fullHeight spinnerColor={colors.ink} size={60} />
  if (isTeacherPreviewProcessing)
    return (
      <Spinner
        fullHeight
        spinnerColor={colors.ink}
        textColor={colors.ink}
        size={60}
        textDelay={1000}
        text={
          Number.isFinite(teacherLoadingProgress)
            ? intl.formatMessage(
                { id: 'processing-story-with-percent' },
                { progress: processingPercent }
              )
            : ''
        }
      />
    )
  if (!routeStory && !isStudentPreview) return <Spinner fullHeight spinnerColor={colors.ink} size={60} />

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

  // Awaited, then refetched: navigating straight away lets the library's list request race the
  // delete, and GET_STORIES_SUCCESS replaces the list wholesale — putting the story back.
  const handleDeleteStory = async () => {
    await dispatch(removeStory(id))
    await dispatch(getAllStories(learningLanguage, { sort_by: 'date', order: -1 }))
    navigate('/library', { replace: true })
  }

  // The practice CTA + settings gear + topics select now live in the card's top toolbar (see
  // PreviewToolbar below); this only renders the teacher's edit/delete controls.
  const StoryFunctionsDropdown = () =>
    preProcessingReady && teacherView && !routeStory?.control_story ? (
      <div
        className="practice-tour-edit-delete-story"
        style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
      >
        <AppButton variant="primary" as={Link} to={`/stories/${id}/edit/`}>
          <FormattedMessage id="edit" />
        </AppButton>
        <AppButton
          variant="danger"
          data-cy="story-delete-button"
          onClick={() => setConfirmationOpen(true)}
        >
          <FormattedMessage id="Delete" />
        </AppButton>
      </div>
    ) : null

  // Top toolbar of the story card: practice CTA on the left, topics select + settings gear on the
  // right (matches the 2026 preview design).
  const PreviewToolbar = () => {
    if (!preProcessingReady || isGroupReview || isGroupPreview) return null

    const practiceCta = routeStory?.control_story ? (
      <AppButton
        as={Link}
        to={`/stories/${id}/controlled-practice`}
        variant="tan"
        sx={{ gap: '0.5em' }}
      >
        <img src={images.play} alt="" />
        <FormattedMessage id="tailored-begin-practice" />
      </AppButton>
    ) : (
      !teacherView && (
        <AppButton
          as={Link}
          to={
            user?.user?.reading_comprehension
              ? `/stories/${id}/reading_practice`
              : `/stories/${id}/practice/`
          }
          className="practice-tour-start-practice-story"
          variant="tan"
          disabled={(routeStory?.topics || []).length === 0 && ownedRouteStory}
          sx={{ gap: '0.5em' }}
        >
          <img src={images.play} alt="" />
          <FormattedMessage id="start-practice-story" />
        </AppButton>
      )
    )

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75em',
          marginBottom: '1.25em',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.75em' }}>
          {practiceCta}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '0.75em' }}>
          {!routeStory?.control_story && (
            <CustomTooltip title={intl.formatMessage({ id: 'customize-story-practice-EXPLAIN' })}>
              <span
                onClick={handle_cog_click}
                data-cy="story-preview-settings"
                style={{ display: 'inline-flex', cursor: 'pointer' }}
              >
                <img src={images.circleSettings} alt="" style={{ width: 28, height: 28 }} />
              </span>
            </CustomTooltip>
          )}
        </Box>
      </Box>
    )
  }

  const setSelectedTopics = topics => {
    dispatch(updateExerciseTopics(topics, id))
    dispatch(updateTempExerciseTopics(topics, id))
  }

  const topicsTabs = [
    { value: 'grammar', label: intl.formatMessage({ id: 'Grammar topics' }) },
    { value: 'listening', label: intl.formatMessage({ id: 'listening-exercises' }) },
  ]

  return (
    <div className="cont-tall flex-col space-between align-center"> 
      {/* align-self: stretch fills the outer column's definite width (the parent centers its
          children, so a percentage width can't resolve and the empty card would otherwise
          collapse to its min-width until the story text loads). */}
      <div
        className="flex mb-nm"
        style={{ alignSelf: 'stretch', justifyContent: 'center' }}
      >
        <div className={`cont ${isSidebarOpen ? 'sidebar-pushed' : ''}`} style={{ flex: 1 }}>
          <Box
            data-cy="readmodes-text"
            className="cont"
            sx={{
              backgroundColor: colors.card,
              borderRadius: '30px',
              padding: { xs: '1em', sm: '1.5em' },
              marginTop: '1.5em',
              marginBottom: '1em' }}
            style={getTextStyle(learningLanguage)}
          >
            {PreviewToolbar()}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="space-between" style={getTextStyle(learningLanguage, 'title')}>
                <div className="story-title">

                  {(!isStudentPreviewProcessing || !!routeStory?.title || !processingComplete) && (
                    <span className="header-text practice-tour-start">
                      {routeStory?.title || ''}
                    </span>
                  )}
                  <StoryTitleTranslate title={routeStory?.title} />
                </div>
              </div>
              {(preProcessingReady || processingFinished) &&
                String(difficultyValueDisplay).trim() !== '' && (
                  <div className="cefr-level" style={{ background: colors.green }}>
                    {difficultyValueDisplay}
                  </div>
                )}
            </div>
            {underProcessing && preProcessingReady && !processingComplete && (
              <div className="story-not-processed">
                <div className="story-not-processed-text">
                  {intl.formatMessage({ id: 'story-not-yet-processed-yellow-box' }).replace(/\\n/g, '\n')}
                </div>
              </div>
            )}
            <div className={bigScreen && 'space-between'} style={{ alignItems: 'center' }}>
              <div>
                {mode === 'practice-preview' && <div />}
                {!['practice-preview', 'preview'].includes(mode) && hiddenFeatures && (
                  <FormControlLabel
                    control={
                      <AppSwitch checked={showDifficulty} onChange={updateUserReviewDiff} />
                    }
                    label={intl.formatMessage({ id: 'show-difficulty-level' })}
                    sx={{
                      paddingTop: '.5em',
                      '& .MuiFormControlLabel-label': { marginLeft: '0.5em', color: colors.ink } }}
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
                      <AppSelect
                        value={currentStudent ? JSON.stringify(currentStudent) : undefined}
                        placeholder={dropDownMenuText}
                        options={studentOptions.map(o => ({ value: o.value, label: o.text }))}
                        onChange={value => handleStudentChange(value)}
                        variant="tan-outline"
                        minWidth={180}
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
                      <AppSelect
                        value={currentStudent ? JSON.stringify(currentStudent) : undefined}
                        placeholder={dropDownMenuText}
                        options={studentOptions.map(o => ({ value: o.value, label: o.text }))}
                        onChange={value => handleStudentChange(value)}
                        variant="tan-outline"
                        minWidth={180}
                      />
                    </div>
                  )}
                  {!isGroupPreview && !isGroupReview && <StoryFunctionsDropdown />}
                </div>
              )}
            </div>
            {isStudentPreviewProcessing ? (
              <div className="justify-center" style={{ minHeight: '16rem' }}>
                <Spinner size={60} text={intl.formatMessage({ id: 'loading-story' })} />
              </div>
            ) : studentPending ? (
              <div className="justify-center" style={{ minHeight: '16rem' }}>
                <Spinner inline size={60} />
              </div>
            ) : (
              (routeStory?.paragraph || []).map((paragraph, index) => (
                <Fragment key={index}>
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
                </Fragment>
              ))
            )}
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
          <HelperSidebar>
            {canSeeTopics && !routeStory?.control_story && (
              <TopicsSelect
                conceptCount={routeStory?.concept_count || {}}
                focusedConcept={focusedConcept}
                setFocusedConcept={setFocusedConcept}
              />
            )}
            <CombinedChatbot />
          </HelperSidebar>
        
        <FeedbackInfoModal />
      </div>
      <AppDialog
        open={open}
        onClose={() => setOpen(false)}
        title={<FormattedMessage id="practice-settings" />}
      >
        <div className="flex-col gap-row-nm">
            {mode === 'preview' && (
              <SettingToggle
                translationId="show preview"
                checked={previewToggleOn}
                onChange={updateUserPreviewExer}
              />
            )}
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
      </AppDialog>
      <AppDialog
        open={topicsModal}
        onClose={() => setTopicsModal(false)}
        title={<FormattedMessage id="practice-settings" />}
        maxWidth="lg"
      >
        <AppTabs tabs={topicsTabs} value={topicsTab} onChange={setTopicsTab} />
        {topicsTab === 'grammar' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '500px' }}
          >
            <h1 style={{ marginBottom: '100px' }}>
              <FormattedMessage id="select-lesson-grammar" />
            </h1>
            <SelectGrammarLevel
              topicInstance={{
                topic_ids: routeStory?.topics || [],
                instancePending: pending || !routeStory }}
              editable
              setSelectedTopics={setSelectedTopics}
              selectedTopicIds={routeStory?.topics || []}
              showPerf
              setShowPerf={setShowDifficulty}
              lessons={lessons}
              currentStepIndex={2}
            />
          </div>
        )}
        {topicsTab === 'listening' && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '500px' }}
          >
            <ListeningExerciseSettings />
          </div>
        )}
      </AppDialog>
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
