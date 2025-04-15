/* eslint-disable no-nested-ternary */

import { useDispatch, useSelector } from 'react-redux'
import { useIntl, FormattedMessage } from 'react-intl'
import { List, WindowScroller } from 'react-virtualized'
import React, { useEffect, useState } from 'react'
import { Placeholder, Icon, Select, Container, Modal, TabPane, Tab, Checkbox } from 'semantic-ui-react'
import Stepper from '@keyvaluesystems/react-stepper'

import ScrollArrow from 'Components/ScrollArrow'
import LibraryTabs from 'Components/LibraryTabs'
import LessonPracticeTopicsHelp from '../LessonPracticeView/LessonPracticeTopicsHelp'
import LessonPracticeThemeHelp from '../LessonPracticeView/LessonPracticeThemeHelp'
import Topics from 'Components/Topics'

import ReactSlider from 'react-slider'
import { Button } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'

import { getLessonTopics } from 'Utilities/redux/lessonsReducer'
import {
  getLessonInstance,
  setLessonInstance,
  clearLessonInstanceState,
  setLessonStep,
} from 'Utilities/redux/lessonInstanceReducer'

import { getGroups } from 'Utilities/redux/groupsReducer'
import { startLessonsTour } from 'Utilities/redux/tourReducer'
import {
  lessonsTourViewed,
  updateGroupSelect,
  updateLibrarySelect,
  updateWordAudio,
  updateChunkAudio,
  updateChunkContextAudio,
  updateAudioTask,
} from 'Utilities/redux/userReducer'
import styled from 'styled-components'
import useWindowDimensions from 'Utilities/windowDimensions'
import ThemeView from '../ThemeView'
import GrammarView from '../GrammarView'

import './LessonLibraryStyles.css';


const StyledMark = (localizedMarkString) => 
  (props) => {
    const StyledMarkSpan = styled.span`
      border-left: 10px solid transparent; 
      border-right: 10px solid transparent; 
      border-top: 15px solid #000; 
      padding: 0;
      &:hover::before {
        content: "${localizedMarkString}" ;
        position: absolute;
        background-color: #333;
        color: #fff;
        padding: 5px 10px;
        border-radius: 4px;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        opacity: 0.9;
        z-index: 1;
      }
    `
    return <StyledMarkSpan {...props} />
  }

const LessonList = () => {
  const intl = useIntl()
  const { width } = useWindowDimensions()
  const bigScreen = width >= 700
  
  const { pending: userPending, data: userData } = useSelector(({ user }) => user)
  const { teacherView, user } = userData
  const {
    last_selected_library: savedLibrarySelection,
    last_selected_group: savedGroupSelection,
    oid: userId,
    has_seen_lesson_tour,
    vocabulary_score,
    word_audio,
    chunk_audio,
    chunk_context_audio,
    task_audio,
  } = user
  const {
    pending: metaPending,
    lesson_semantics,
    lesson_topics,
    lessons,
  } = useSelector(({ metadata }) => metadata)
  const { pending: topicPending, topics } = useSelector(({ lessons }) => lessons)
  const { pending: lessonPending, lesson, step: goStep, showCustomModal } = useSelector(({ lessonInstance }) => lessonInstance)

  const { groups, pending: groupPending } = useSelector(({ groups }) => groups)
  const currentGroup = groups.find(g => g.group_id === savedGroupSelection)

  const _lesson_sort_criterion = { direction: 'asc', sort_by: 'index' }

  const [sorter, setSorter] = useState(_lesson_sort_criterion.sort_by)
  const [sortDirection, setSortDirection] = useState(_lesson_sort_criterion.direction)

  const { topic_ids: selectedTopicIds, semantic: selectedSemantics, vocab_diff, num_visited_exercises } = lesson
  const [sliderValue, setSliderValue] = useState(vocabulary_score)

  const [libraries, setLibraries] = useState({
    private: false,
    group: false,
  })

  const [modal, setModal] = useState(false)
  const dispatch = useDispatch()
  const history = useHistory()

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
    if (has_seen_lesson_tour && (savedLibrarySelection == 'group' || savedLibrarySelection == 'public' || teacherView) ) {
      setLibrary('group')
      dispatch(getLessonInstance(savedGroupSelection))
    }
    else {
      setLibrary('private')
      dispatch(getLessonInstance())
    }
  }, [])
  
  useEffect(() => {
    if (!lessonPending) {
        setSliderValue(vocab_diff)
        if (goStep == -1 && selectedTopicIds && selectedSemantics && selectedTopicIds.length && selectedSemantics.length) {
          dispatch(setLessonStep(2))
        }
        else if (goStep == -1 && (libraries.private || teacherView && libraries.group)) {
          dispatch(setLessonStep(0))
        }
    }
    
  }, [lessonPending])

  useEffect(() => {
    if (!lessonPending && !metaPending && !has_seen_lesson_tour && lessons.length) {
      dispatch(setLessonStep(0))
      dispatch(lessonsTourViewed())
      dispatch(startLessonsTour())
    }
    
  }, [lessonPending, metaPending])

  useEffect(() => {
    if (!groupPending && groups.length === 0 && libraries.group) {
      setLibrary('private')
    }
  }, [groupPending])

  useEffect(() => {
    if (userPending && (libraries.group && savedLibrarySelection === 'private' || 
      libraries.private && savedLibrarySelection === 'group')) setLibrary(savedLibrarySelection)
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
    dispatch(getLessonInstance(library == 'group' && savedGroupSelection || null))
    dispatch(setLessonStep(-1))
  }

  const groupDropdownOptions = groups.map(group => ({
    key: group.group_id,
    text: group.groupName,
    value: group.group_id,
  }))


  const handleGroupChange = (_e, option) => {
    dispatch(updateGroupSelect(option.value))
    dispatch(clearLessonInstanceState())
    dispatch(getLessonInstance(option.value))
    dispatch(setLessonStep(-1))
  }

  function roundToNearestHalfInt(number) {
    const roundedNumber = Math.round(number);
    if (Math.abs(number - roundedNumber) === 0.5) {
      return roundedNumber + (number > 0 ? 0.5 : -0.5);
    }
    return roundedNumber;
  }

  const getSliderThumbColor = () => {
    if (sliderValue - vocabulary_score > 0 & sliderValue - vocabulary_score <= 0.5) {
      return 'red0-slider'; 
    }
    if (sliderValue - vocabulary_score > 0.5 & sliderValue - vocabulary_score <= 1.0) {
      return 'red1-slider'; 
    }
    if (sliderValue - vocabulary_score > 1.0 & sliderValue - vocabulary_score <= 1.5) {
      return 'red2-slider'; 
    }
    if (sliderValue - vocabulary_score > 1.5) {
      return 'red3-slider'; 
    }

    if (sliderValue - vocabulary_score >= -0.5 & sliderValue - vocabulary_score < 0) {
      return 'green0-slider'; 
    }
    if (sliderValue - vocabulary_score >= -1.0 & sliderValue - vocabulary_score < -0.5) {
      return 'green1-slider'; 
    }
    if (sliderValue - vocabulary_score >= -1.5 & sliderValue - vocabulary_score < -1.0) {
      return 'green2-slider'; 
    }
    if (sliderValue - vocabulary_score < -1.5) {
      return 'green3-slider'; 
    }
    return 'white-slider';
  };
  const sliderThumbClassName = `${getSliderThumbColor()} exercise-density-slider-thumb`;
  const markComp = StyledMark(intl.formatMessage({
      id: 'Recommended vocabulary difficulty' }))
  const lessonVocabularyControls = bigScreen ? (
    <>
      <div className="lesson-vocab-slider-container" style={{ width: '450px' }}>
        <ReactSlider
          className="exercise-density-slider lesson-vocab-diff"
          thumbClassName={sliderThumbClassName}
          trackClassName="exercise-density-slider-track"
          onAfterChange={value => handleSlider(value)}
          onSliderClick={value => handleSlider(value)}
          snapDragDisabled={false}
          renderMark={markComp}
          marks={[roundToNearestHalfInt(vocabulary_score)]}
          min={0.8} // 0.8
          max={3.3} // 3.3
          step={0.2}
          value={sliderValue}
          disabled={lessonPending || !(libraries.private || currentGroup && currentGroup.is_teaching)}
        />
        <div className="space-between exercise-density-slider-label-cont bold">
          <span><FormattedMessage id='Easy' /></span>
          <span><FormattedMessage id='Hard' /></span>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="lesson-vocab-slider-container" style={{ width: '200px' }}>
        <ReactSlider
          className="exercise-density-slider lesson-vocab-diff"
          thumbClassName={sliderThumbClassName}
          trackClassName="exercise-density-slider-track"
          onAfterChange={value => handleSlider(value)}
          onSliderClick={value => handleSlider(value)}
          snapDragDisabled={false}
          renderMark={markComp}
          marks={[roundToNearestHalfInt(vocabulary_score)]}
          min={0.8} // 0.8
          max={3.3} // 3.3
          step={0.02}
          value={sliderValue}
          disabled={lessonPending || !(libraries.private || currentGroup && currentGroup.is_teaching)}
        />
        <div className="space-between exercise-density-slider-label-cont bold">
          <span><FormattedMessage id='Easy' /></span>
          <span><FormattedMessage id='Hard' /></span>
        </div>
      </div>
    </>
  )
  const link = '/lesson' + (libraries.group ? `/group/${savedGroupSelection}/practice` : '/practice')
  const lessonReady = selectedSemantics && selectedSemantics.length > 0 && selectedTopicIds && selectedTopicIds.length > 0
  const lessonReadyColor = lessonReady ? '#0088CB' : '#DB2828'
  let lessonStartControls = (
    <Container>
      <div 
        className='row justify-center align-center'
        style={{
             color: `${lessonReadyColor}`, textAlign: 'center',
             fontWeight: 500,
             margin: '18px', fontSize: 'large'
           }}>
        <div className='col col-12'>
        {!lessonPending && lessonReady ? <FormattedMessage id="lessons-ready-for-practice" />
        : <FormattedMessage id="lessons-not-ready-for-practice" />}
        </div>
      </div>
      <div className='row justify-center align-center space-between' style={{ 'display': 'flex' }}>
        <div className='col col-md-5 offset-md-1' style={{padding: 0}}>
          <LessonPracticeThemeHelp selectedThemes={selectedSemantics ? selectedSemantics : []} always_show={true} />
        </div>
        <div className='col col-md-5' style={{padding: 0}}>
          <LessonPracticeTopicsHelp selectedTopics={selectedTopicIds} always_show={true} />
        </div>
      </div>
      {!teacherView &&
       (<Link 
          to={link} className='row justify-center align-center'
        >
            <Button
              size="big"
              className="lesson-practice"
              disabled={
                lessonPending ||
                  !selectedTopicIds ||
                  !selectedSemantics ||
                  selectedTopicIds.length === 0 ||
                  selectedSemantics.length === 0 ||
                  noResults
              }
              style={{
                fontSize: '1.3em', fontWeight: 500,
                margin: '3em 0', padding: '1rem 0',
                width: '100%', border: '2px solid #000',
              }}
            >
              {lessonPending && <Icon name="spinner" loading />}
              <FormattedMessage id="start-practice-lesson" />
            </Button>
        </Link>)}
    </Container>
  )

  const noResults = !metaPending && lesson_topics && lesson_topics.length === 0

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

  const panes = [
    {
      menuItem: 'Select grammar topics',
      render: () => (
        <TabPane>
          <Topics
            topicInstance={{ ...lesson, instancePending: lessonPending }}
            editable={libraries.private || (currentGroup && currentGroup.is_teaching)}
            setSelectedTopics={setSelectedTopics}
            showPerf={libraries.private}
          />
        </TabPane>
      ),
    },
    {
      menuItem: 'Listening exercise settings',
      render: () => (
        <TabPane style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: '40px 0' }}>
            <Checkbox
              toggle
              label={<label style={{ fontWeight: '500' }}>Practice Listening</label>}
              checked={task_audio}
              onChange={() => dispatch(updateAudioTask(!task_audio))}
            />
            <Checkbox
              label="Listen to words with context"
              checked={word_audio}
              onChange={() => dispatch(updateWordAudio(!word_audio))}
              disabled={!task_audio}
              style={{ marginLeft: '37px' }}
            />
            <Checkbox
              label="Listen to phrases without context"
              checked={chunk_audio}
              onChange={() => dispatch(updateChunkAudio(!chunk_audio))}
              disabled={!task_audio}
              style={{ marginLeft: '37px' }}
            />
            <Checkbox
              label="Listen to phrases with context"
              checked={chunk_context_audio}
              onChange={() => dispatch(updateChunkContextAudio(!chunk_context_audio))}
              disabled={!task_audio}
              style={{ marginLeft: '37px' }}
            />
          </div>
        </TabPane>
      ),
    },
  ]

  const setupViewTitle = () => {
    switch (goStep) {
      case 0:
        return 'Choose themes'
      case 1:
        return 'Set vocabulary level'
      case 2:
        return 'Select grammar topics'
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
    setTimeout(() => {
      history.push(link)
    }, 10000)
  }

  return (
    <>
      <Modal open={modal} onClose={() => setModal(false)} closeOnEscape closeOnDimmerClick>
        <Tab panes={panes} />
      </Modal>
      <LibraryTabs
        values={Object.fromEntries(
          Object.entries(libraries).filter(
            ([key]) =>
              (key === 'private' && !teacherView) ||
              (key === 'group' && (teacherView || groups.length > 0))
          )
        )}
        onClick={handleLibraryChange}
        reverse
        savedGroupSelection={savedGroupSelection}
        groupDropdownOptions={groupDropdownOptions}
        groupDropdownDisabled={!libraries.group}
        handleGroupChange={handleGroupChange}
      />
      {metaPending || groupPending ? (
        <Placeholder>
          <Placeholder.Line />
        </Placeholder>
      ) : noResults ? (
        <div className="justify-center mt-lg" style={{ color: 'rgb(112, 114, 120)' }}>
          <FormattedMessage id="no-lessons-found" />
        </div>
      ) : (
        <>
          {libraries.group && !teacherView ? (
            <div>{lessonStartControls}</div>
          ) : (
            <div style={{ display: 'flex', height: '90vh' }}>
              <div
                style={{
                  flex: 0.7,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <h1 style={{ marginTop: '30px', marginBottom: '30px' }}>{setupViewTitle()}</h1>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '500px',
                  }}
                >
                  <ThemeView
                    currentStepIndex={goStep}
                    selectedSemantics={selectedSemantics}
                    lesson_semantics={lesson_semantics}
                    toggleSemantic={toggleSemantic}
                  />
                  {goStep === 1 && lessonVocabularyControls}
                  <GrammarView
                    currentStepIndex={goStep}
                    setShowGrammarModal={setModal}
                    lessons={lessons}
                    selectedTopicIds={selectedTopicIds}
                    setSelectedTopics={setSelectedTopics}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '20px',
                    justifyContent: 'center',
                    marginTop: '20px',
                  }}
                >
                  {goStep !== 0 && (
                    <Button
                      variant="secondary"
                      style={{ width: '90px' }}
                      type="button"
                      onClick={handleBackClick}
                    >
                      Back
                    </Button>
                  )}
                  {goStep === 2 ? (
                    <Button
                      style={{ width: '90px' }}
                      type="button"
                      onClick={handleBeginClick}
                      disabled={
                        selectedSemantics.length === 0 ||
                        selectedTopicIds.length === 0 ||
                        lessonPending ||
                        !lessonReady
                      }
                    >
                      Begin
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      style={{ width: '90px' }}
                      type="button"
                      onClick={handleContinueClick}
                    >
                      Continue
                    </Button>
                  )}
                </div>
              </div>
              <div style={{ flex: 0.3, marginTop: '100px' }}>
                <Stepper
                  steps={[
                    {
                      stepLabel: 'Choose themes',
                      stepDescription: '',
                      completed: goStep > 0,
                    },
                    {
                      stepLabel: 'Set vocabulary level',
                      stepDescription: '',
                      completed: goStep > 1,
                    },
                    {
                      stepLabel: 'Select grammar topics',
                      stepDescription: '',
                      completed: false,
                    },
                  ]}
                  currentStepIndex={goStep}
                />
              </div>
            </div>
          )}
          <ScrollArrow />
        </>
      )}
    </>
  )
}

export default LessonList
