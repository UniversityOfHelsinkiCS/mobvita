/* eslint-disable no-nested-ternary */

import { useDispatch, useSelector } from 'react-redux'
import { useIntl, FormattedMessage } from 'react-intl'
import { List, WindowScroller } from 'react-virtualized'
import React, { useEffect, useState } from 'react'
import { Container } from '@mui/material'
import AppStepper from 'Components/ui/AppStepper'
import ScrollArrow from 'Components/ScrollArrow'
import AppTabs from 'Components/ui/AppTabs'
import AppSelect from 'Components/ui/AppSelect'
import { colors } from 'Assets/mui_theme/designTokens'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import LessonPracticeTopicsHelp from '../LessonPracticeView/LessonPracticeTopicsHelp'
import LessonPracticeThemeHelp from '../LessonPracticeView/LessonPracticeThemeHelp'
import VocabDiffSlider from 'Components/Sliders/VocabDiffSlider'
import AppButton from 'Components/AppButton'
import { Link, useNavigate } from 'react-router-dom'

import { getLessonTopics } from 'Utilities/redux/lessonsReducer'
import {
  getLessonInstance,
  setLessonInstance,
  clearLessonInstanceState,
  setLessonStep } from 'Utilities/redux/lessonInstanceReducer'

import { getGroups } from 'Utilities/redux/groupsReducer'
import { startLessonsTour } from 'Utilities/redux/tourReducer'
import {
  lessonsTourViewed,
  updateGroupSelect,
  updateLibrarySelect } from 'Utilities/redux/userReducer'
import styled from 'styled-components'
import useWindowDimensions from 'Utilities/windowDimensions'
import ThemeView from '../ThemeView'
import SelectGrammarLevel from '../SelectGrammarLevel'
import LessonStartMenu from '../LessonStartMenu'
import Spinner from 'Components/Spinner'

import './LessonLibraryStyles.css'


const LessonList = () => {
  const intl = useIntl()
  const { width } = useWindowDimensions()
  const bigScreen = width >= 700

  const { pending: userPending, data: userData } = useSelector(({ user }) => user)
  const safeUserData = userData || {}
  const teacherView = Boolean(safeUserData.teacherView)
  const user = safeUserData.user || {}
  const {
    last_selected_library: savedLibrarySelection,
    last_selected_group: savedGroupSelection,
    oid: userId,
    has_seen_lesson_tour,
    vocabulary_score,
    email } = user
  const isAnonymousUser = email === 'anonymous_email'
  const {
    pending: metaPending,
    lesson_semantics,
    lesson_topics,
    lessons } = useSelector(({ metadata }) => metadata)
  const { pending: topicPending, topics } = useSelector(({ lessons }) => lessons)
  const {
    pending: lessonPending,
    lesson,
    step: goStep } = useSelector(({ lessonInstance }) => lessonInstance)
  const {
    key: tourKey,
    name: tourName,
    run: tourRun } = useSelector(({ tour }) => tour)

  const { groups, pending: groupPending } = useSelector(({ groups }) => groups)
  const currentGroup = groups.find(g => g.group_id === savedGroupSelection)

  const _lesson_sort_criterion = { direction: 'asc', sort_by: 'index' }

  const [sorter, setSorter] = useState(_lesson_sort_criterion.sort_by)
  const [sortDirection, setSortDirection] = useState(_lesson_sort_criterion.direction)
  const [showStartMenu, setShowStartMenu] = useState(true)

  const {
    topic_ids: selectedTopicIds,
    semantic: selectedSemantics,
    vocab_diff,
    num_visited_exercises } = lesson
  const [sliderValue, setSliderValue] = useState(vocabulary_score)

  const [libraries, setLibraries] = useState({
    private: false,
    group: false })

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const setLibrary = library => {
    const librariesCopy = {}
    Object.keys(libraries).forEach(key => {
      librariesCopy[key] = false
    })

    setLibraries({ ...librariesCopy, [library]: true })
  }

  useEffect(() => {
    if (!groups.find(g => g.group_id === savedGroupSelection) && groups[0]) {
      dispatch(updateGroupSelect(groups[0].group_id))
    }
  }, [groups])

  useEffect(() => {
    if (!userPending && teacherView) setLibrary('group')
  }, [teacherView, userPending])

  useEffect(() => {
    dispatch(getLessonTopics())
    dispatch(getGroups())
    if (teacherView) setLibrary('group')
    if (
      has_seen_lesson_tour &&
      (savedLibrarySelection == 'group' || savedLibrarySelection == 'public' || teacherView)
    ) {
      setLibrary('group')
      dispatch(getLessonInstance(savedGroupSelection))
    } else {
      setLibrary('private')
      dispatch(getLessonInstance())
    }
  }, [])

  useEffect(() => {
    if (!lessonPending) {
      setSliderValue(vocab_diff)
      if (
        goStep == -1 &&
        selectedTopicIds &&
        selectedSemantics &&
        selectedTopicIds.length &&
        selectedSemantics.length
      ) {
        dispatch(setLessonStep(2))
      } else if (goStep == -1 && (libraries.private || (teacherView && libraries.group))) {
        dispatch(setLessonStep(0))
      }
    }
  }, [lessonPending])

  // Put the lesson page in the start state whenever the tour restarts.
  useEffect(() => {
    if (tourName !== 'lessons' || !tourRun) return

    if (teacherView) {
      setShowStartMenu(false)
      setLibrary('group')
      dispatch(clearLessonInstanceState())
      dispatch(getLessonInstance(savedGroupSelection))
      dispatch(setLessonStep(0))
      return
    }

    setShowStartMenu(true)
    setLibrary('private')
    dispatch(updateLibrarySelect('private'))
    dispatch(clearLessonInstanceState())
    dispatch(getLessonInstance())
    dispatch(setLessonStep(-1))
  }, [tourKey])

  useEffect(() => {
    if (!groupPending && groups.length === 0 && libraries.group) {
      setLibrary('private')
    }
  }, [groupPending])

  useEffect(() => {
    if (
      userPending &&
      ((libraries.group && savedLibrarySelection === 'private') ||
        (libraries.private && savedLibrarySelection === 'group'))
    )
      setLibrary(savedLibrarySelection)
  }, [savedLibrarySelection])

  useEffect(() => {
    if (teacherView) handleLibraryChange('group')
  }, [teacherView])

  const finnishSelectingTopics = () => {
    const payload = { topic_ids: selectedTopicIds }
    if (libraries.group) payload.group_id = savedGroupSelection
    dispatch(setLessonInstance(payload))
  }

  const setSelectedTopics = topic_ids => {
    dispatch({ type: 'SET_LESSON_SELECTED_TOPICS', topic_ids: topic_ids })
  }

  const finnishSelectingSemanticsAndVocabDiff = () => {
    const payload = { semantic: selectedSemantics, vocab_diff: sliderValue }
    if (libraries.group) payload.group_id = savedGroupSelection
    console.log('payload for semantics and vocab diff:', payload)
    dispatch(setLessonInstance(payload))
  }

  const toggleSemantic = semantic => {
    dispatch({ type: 'TOGGLE_LESSON_SEMANTIC', semantic: semantic })
  }

  const handleSlider = value => {
    setSliderValue(value)
  }

  const handleLibraryChange = library => {
    dispatch(updateLibrarySelect(library))
    setLibrary(library)
    dispatch(clearLessonInstanceState())
    dispatch(getLessonInstance((library == 'group' && savedGroupSelection) || null))
    dispatch(setLessonStep(-1))
  }

  const groupDropdownOptions = groups.map(group => ({
    key: group.group_id,
    text: group.groupName,
    value: group.group_id }))

  const handleGroupChange = (_e, option) => {
    dispatch(updateGroupSelect(option.value))
    dispatch(clearLessonInstanceState())
    dispatch(getLessonInstance(option.value))
    dispatch(setLessonStep(-1))
  }

  // Lesson difficulty of vocabulary view
  const lessonVocabularyControls = (
    <VocabDiffSlider
      value={sliderValue}
      onChange={handleSlider}
      recommendedValue={vocabulary_score}
      skillLevels={["pre-A1", "A1", "", "A2", "", "B1", "", "B2", "", "C1", "", "C2", "C2+"]}
      min={0}
      max={100}
      disabled={lessonPending || !(libraries.private || (currentGroup && currentGroup.is_teaching))}
      style={{ width: bigScreen ? '450px' : '90%', maxWidth: '450px' }}
    />
  )

  const link =
    '/lesson' + (libraries.group ? `/group/${savedGroupSelection}/practice` : '/practice')

  const lessonReady =
    selectedSemantics &&
    selectedSemantics.length > 0 &&
    selectedTopicIds &&
    selectedTopicIds.length > 0

  const noResults = !metaPending && lesson_topics && lesson_topics.length === 0

  // Which library tab is active, and the tabs to show (Private for learners, Group when the user
  // has groups / is a teacher). Group shows the group count as an orange badge.
  const activeLibrary = Object.keys(libraries).find(key => libraries[key]) || 'private'
  const libraryTabs = [
    !teacherView && {
      value: 'private',
      label: <FormattedMessage id="Private" />,
      icon: <LockOutlinedIcon />,
    },
    (teacherView || groups.length > 0) && {
      value: 'group',
      label: <FormattedMessage id="Group" />,
      icon: <GroupsOutlinedIcon />,
      badge: groups.length || undefined,
    },
  ].filter(Boolean)

  // The tab content sits in its own cream rounded block (replacing the old black-bordered
  // universal-background box).
  const creamBlock = {
    backgroundColor: colors.card,
    borderRadius: 30,
    padding: 24,
    overflow: 'hidden',
  }

  const lessonReadyColor = lessonReady ? '#0088CB' : '#DB2828'

  // Lesson Group View
  let lessonStartControls = (
    <Container>
      <div
        className="justify-center align-center wrap"
        style={{
          color: `${lessonReadyColor}`,
          textAlign: 'center',
          fontWeight: 500,
          margin: '18px',
          fontSize: 'large' }}
      >
        <div className="full-width" data-cy="lessons-ready-status">
          {!lessonPending && lessonReady ? (
            <FormattedMessage id="lessons-ready-for-practice" />
          ) : (
            <FormattedMessage id="lessons-not-ready-for-practice" />
          )}
        </div>
      </div>

      <div className="lesson-group-row">
        <div className="lesson-group-col lesson-group-col-theme">
          <LessonPracticeThemeHelp
            selectedThemes={selectedSemantics ? selectedSemantics : []}
            always_show={true}
          />
        </div>

        <div className="lesson-group-col lesson-group-col-topics">
          <LessonPracticeTopicsHelp selectedTopics={selectedTopicIds} always_show={true} />
        </div>
      </div>

      {!teacherView && (
        <Link to={link} className="justify-center align-center wrap">
          <AppButton
            size="big"
            className="lesson-practice"
            data-cy="lessons-start-practice-button"
            disabled={
              lessonPending ||
              !selectedTopicIds ||
              !selectedSemantics ||
              selectedTopicIds.length === 0 ||
              selectedSemantics.length === 0 ||
              noResults
            }
            style={{
              fontSize: '1.3em',
              fontWeight: 500,
              margin: '3em 0',
              padding: '1rem 0',
              width: '400px',
              border: '2px solid #000' }}
          >
            <FormattedMessage id="start-practice-lesson" />
          </AppButton>
        </Link>
      )}
    </Container>
  )

  topics.sort((a, b) => {
    let dir = 0
    switch (sorter) {
      case 'index':
        dir = a.index > b.index ? 1 : -1
        break
      case 'topic_id':
        dir = a.syllabus_id > b.syllabus_id ? 1 : -1
        break
      default:
        break
    }
    const multiplier = sortDirection === 'asc' ? 1 : -1
    return dir * multiplier
  })

  const setupViewTitle = () => {
    switch (goStep) {
      case 0:
        return <FormattedMessage id="select-lesson-themes" />
      case 1:
        return <FormattedMessage id="select-lesson-vocab-diff" />
      case 2:
        return <FormattedMessage id="select-lesson-grammar" />
      default:
        return ''
    }
  }

  const handleContinueClick = () => {
    if (goStep === 0 || goStep === 1) {
      finnishSelectingSemanticsAndVocabDiff()
    }

    dispatch(setLessonStep(goStep + 1))
  }

  const handleBackClick = () => {
    if (goStep === 1) {
      finnishSelectingSemanticsAndVocabDiff()
    }

    if (goStep === 2) {
      finnishSelectingTopics()
    }

    dispatch(setLessonStep(goStep - 1))
  }

  const handleBeginClick = () => {
    finnishSelectingTopics()
    navigate(link)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: bigScreen ? '60%' : '100%' }}>
        {metaPending || groupPending ? (
          <Spinner fullHeight size={60} text={intl.formatMessage({ id: 'loading' })} />
        ) : noResults ? (
          <div
            className="justify-center mt-lg"
            style={{ color: 'rgb(112, 114, 120)' }}
            data-cy="lessons-no-results"
          >
            <FormattedMessage id="no-lessons-found" />
          </div>
        ) : (
          <>
            {!teacherView && !isAnonymousUser && libraryTabs.length > 0 && (
              <div style={{ margin: '1.5em 0 20px' }} data-cy="lessons-library-tabs">
                <AppTabs
                  tabs={libraryTabs}
                  value={activeLibrary}
                  onChange={handleLibraryChange}
                  fullWidth
                />
              </div>
            )}
            {libraries.group && !teacherView ? (
              <div className="lesson-group-container" style={{ ...creamBlock, margin: 0 }}>
                {lessonPending && <Spinner size={60} />}
                {lessonStartControls}
              </div>
            ) : showStartMenu && !teacherView ? (
              <LessonStartMenu setOpen={setShowStartMenu} />
            ) : (
              <div style={{ ...creamBlock, display: 'flex', height: '80vh', margin: 0 }}>
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    height: '100%',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    minHeight: 0 }}
                >
                  <div className="lesson-setup-body">
                    {teacherView && (
                      <div
                        style={{
                          display: 'flex',
                          marginTop: '12px',
                          justifyContent: 'center',
                          alignItems: 'center' }}
                      >
                        <span style={{ marginRight: '10px', fontSize: 'medium' }}>
                          <FormattedMessage id="Group" />:
                        </span>
                        <div data-cy="lessons-group-select">
                          <AppSelect
                            variant="tan-outline"
                            placeholder={intl.formatMessage({ id: 'select-group' })}
                            value={savedGroupSelection || ''}
                            options={groupDropdownOptions.map(o => ({
                              value: o.value,
                              label: o.text }))}
                            onChange={value => handleGroupChange(null, { value })}
                            minWidth={220}
                          />
                        </div>
                      </div>
                    )}
                    <div className="lesson-setup-header">
                      <h1 className="lesson-setup-title">
                        <FormattedMessage id="lesson-setup" />
                      </h1>
                      <p className="lesson-setup-subtitle" data-cy="lessons-setup-subtitle">
                        {setupViewTitle()}
                      </p>
                    </div>
                    <div
                      style={{
                        flex: '1',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center' }}
                    >
                      <ThemeView
                        currentStepIndex={goStep}
                        selectedSemantics={selectedSemantics}
                        lesson_semantics={lesson_semantics}
                        toggleSemantic={toggleSemantic}
                      />
                      {goStep === 1 && lessonVocabularyControls}
                      <SelectGrammarLevel
                        currentStepIndex={goStep}
                        lessons={lessons}
                        selectedTopicIds={selectedTopicIds}
                        setSelectedTopics={setSelectedTopics}
                        topicInstance={{ ...lesson, instancePending: lessonPending }}
                        editable={libraries.private || (currentGroup && currentGroup.is_teaching)}
                        showPerf={libraries.private}
                        showListeningSettings
                      />
                    </div>
                    <div className="lesson-setup-btn-container">
                      <AppButton
                        className="lesson-setup-back-btn"
                        variant="card"
                        type="button"
                        onClick={handleBackClick}
                        disabled={goStep === 0}
                        data-cy="lessons-setup-back-button"
                        sx={{
                          flex: 1,
                          minHeight: 46,
                          // Blend with the cream content card instead of standing out white.
                          backgroundColor: colors.card,
                          '&:hover': { backgroundColor: '#EFEADB', borderColor: '#DCD8C8' },
                        }}
                      >
                        <FormattedMessage id="Back" />
                      </AppButton>
                      {goStep === 2 ? (
                        <AppButton
                          className="lesson-setup-start-btn"
                          variant="primary"
                          type="button"
                          onClick={handleBeginClick}
                          data-cy="lessons-setup-start-button"
                          sx={{ flex: 1, minHeight: 46 }}
                          disabled={
                            lessonPending ||
                            !lessonReady ||
                            !selectedTopicIds ||
                            !selectedSemantics ||
                            selectedSemantics.length === 0 ||
                            selectedTopicIds.length === 0
                          }
                        >
                          <FormattedMessage id="start" />
                        </AppButton>
                      ) : (
                        <AppButton
                          className="lesson-setup-next-btn"
                          variant="primary"
                          type="button"
                          onClick={handleContinueClick}
                          data-cy="lessons-setup-next-button"
                          sx={{ flex: 1, minHeight: 46 }}
                        >
                          <FormattedMessage id="next-step" />
                        </AppButton>
                      )}
                    </div>
                  </div>
                </div>
                {bigScreen && (
                  <div
                    className="lesson-tour-stepper"
                    style={{ flex: 0.3, marginTop: '24px', marginRight: '2.5em' }}
                  >
                    <AppStepper
                      activeIndex={goStep}
                      steps={[
                        { label: intl.formatMessage({ id: 'selected-lesson-themes' }) },
                        { label: intl.formatMessage({ id: 'Lesson vocab' }) },
                        { label: intl.formatMessage({ id: 'Grammar topics' }) },
                      ]}
                    />
                  </div>
                )}
              </div>
            )}
            <ScrollArrow />
          </>
        )}
      </div>
    </div>
  )
}

export default LessonList
