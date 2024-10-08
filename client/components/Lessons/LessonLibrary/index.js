import { useDispatch, useSelector } from 'react-redux'
import { useIntl, FormattedMessage } from 'react-intl'
import { List, WindowScroller } from 'react-virtualized'
import React, { useEffect, useState } from 'react'
import { 
  Placeholder, 
  Popup, 
  Icon, 
  Select, 
  Container, 
  Accordion, 
  AccordionTitle,
  AccordionContent } from 'semantic-ui-react'

import ScrollArrow from 'Components/ScrollArrow'
import LibraryTabs from 'Components/LibraryTabs'
import LessonPracticeTopicsHelp from '../LessonPracticeView/LessonPracticeTopicsHelp'
import LessonPracticeThemeHelp from '../LessonPracticeView/LessonPracticeThemeHelp'
import LessonListItem from 'Components/Lessons/LessonLibrary/LessonListItem'

import ReactSlider from 'react-slider'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Stepper, Step } from 'react-form-stepper';
import { useLearningLanguage, getTextStyle } from 'Utilities/common'
import { getLessonTopics } from 'Utilities/redux/lessonsReducer'
import {
  getLessonInstance,
  setLessonInstance,
  clearLessonInstanceState,
  setLessonStep,
} from 'Utilities/redux/lessonInstanceReducer'
import { getMetadata } from 'Utilities/redux/metadataReducer'
import { getGroups } from 'Utilities/redux/groupsReducer'
import { startLessonsTour } from 'Utilities/redux/tourReducer'
import { lessonsTourViewed, updateGroupSelect, updateLibrarySelect } from 'Utilities/redux/userReducer'
import styled from 'styled-components'
import useWindowDimensions from 'Utilities/windowDimensions'
// import AddStoryModal from 'Components/AddStoryModal'
// import LessonLibrarySearch from './LessonLibrarySearch'

import './LessonLibraryStyles.css';
import { set } from 'lodash'

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
  const learningLanguage = useLearningLanguage()
  const { pending: userPending, data: userData } = useSelector(({ user }) => user)
  const { teacherView, user } = userData
  const {
    last_selected_library: savedLibrarySelection,
    last_selected_group: savedGroupSelection,
    oid: userId,
    has_seen_lesson_tour,
    vocabulary_score,
  } = user
  const {
    pending: metaPending,
    lesson_semantics,
    lesson_topics,
    lessons,
  } = useSelector(({ metadata }) => metadata)
  const { pending: topicPending, topics } = useSelector(({ lessons }) => lessons)
  const { pending: lessonPending, lesson, step: goStep } = useSelector(({ lessonInstance }) => lessonInstance)

  const { groups, pending: groupPending } = useSelector(({ groups }) => groups)
  const currentGroup = groups.find(g => g.group_id === savedGroupSelection)

  const _lesson_sort_criterion = { direction: 'asc', sort_by: 'index' }
  // const smallWindow = useWindowDimensions().width < 520

  const [sorter, setSorter] = useState(_lesson_sort_criterion.sort_by)
  const [sortDirection, setSortDirection] = useState(_lesson_sort_criterion.direction)

  const { topic_ids: selectedTopicIds, semantic: selectedSemantics, vocab_diff, num_visited_exercises } = lesson
  const [sliderValue, setSliderValue] = useState(vocabulary_score)

  const [libraries, setLibraries] = useState({
    private: false,
    group: false,
  })

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLessons, setFilteredLessons] = useState(lessons);
  const [customizeLessonConfigs, setCustomizeLessonConfigs] = useState(false);
  const [accordionState, setAccordionState] = useState(0)

  // const [lesson2info, setLesson2info] = useState({})

  let lesson2info = {}
  if (lessons && lessons?.length){
    lessons.forEach((lesson) => {
      lesson2info[lesson.ID] = lesson;
    });
  }
  
  const dispatch = useDispatch()

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
    if (!metaPending) {
      dispatch(getMetadata(learningLanguage))
    }
  }, [learningLanguage])

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
    if (!lessonPending && !metaPending && !has_seen_lesson_tour ) {
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

  useEffect(() => {
    // Filter lessons based on search query
    if (searchQuery){
      const filtered = lessons.filter(lesson => {
        const lowercaseSearchQuery = searchQuery.toLowerCase();
        const nameMatch = lesson.name.toLowerCase().includes(lowercaseSearchQuery);
        const topicsMatch = lesson.topics.some(topic =>
          topic.toLowerCase().includes(lowercaseSearchQuery)
        );
        return nameMatch || topicsMatch;
      });
      
      setFilteredLessons(filtered);
    } else {
      setFilteredLessons(lessons);
    }
  }, [lessons, searchQuery]);

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  const finnishSelectingTopics = () => {
    const payload = { topic_ids: selectedTopicIds }
    if (libraries.group) payload.group_id = savedGroupSelection
    dispatch(setLessonInstance(payload))
  }

  const excludeAllTopics = () => {
    dispatch({ type: 'SET_LESSON_SELECTED_TOPICS', topic_ids: [] })
  }

  const toggleTopic = topicId => {
    let newTopics
    if (selectedTopicIds.includes(topicId)) {
      newTopics = selectedTopicIds.filter(id => id !== topicId)
    } else {
      newTopics = [...selectedTopicIds, topicId]
    }

    dispatch({ type: 'SET_LESSON_SELECTED_TOPICS', topic_ids: newTopics })
  }

  const includeLesson = LessonId => {
    let lessonTopics = lesson_topics.filter(lesson => lesson.lessons.includes(LessonId)).map(topic => topic.topic_id);
    let newTopics = selectedTopicIds
    for (let lesson_topic of lessonTopics){
      if (!selectedTopicIds.includes(lesson_topic)){
        newTopics = [...newTopics, lesson_topic]
      }
    }

    dispatch({ type: 'SET_LESSON_SELECTED_TOPICS', topic_ids: newTopics })
  }

  const excludeLesson = LessonId => {
    let lessonTopics = lesson_topics.filter(lesson => lesson.lessons.includes(LessonId)).map(topic => topic.topic_id);
    let newTopics = selectedTopicIds.filter(id => !lessonTopics.includes(id))

    dispatch({ type: 'SET_LESSON_SELECTED_TOPICS', topic_ids: newTopics })
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

  const lessonSemanticControls = (
    <div className="align-center">
      <h5>
        <FormattedMessage id="select-lesson-semantic-topic" />:
      </h5>
      <div className="group-buttons sm lesson-story-topic">
          <div style={{width: "100%", maxWidth: "500px", margin: "auto"}}>
        {lesson_semantics &&
          lesson_semantics.map(semantic => (
            <Button
              key={semantic}
              variant={
                selectedSemantics && selectedSemantics.includes(semantic)
                  ? 'primary'
                  : 'outline-primary'
              }
              onClick={() => toggleSemantic(semantic)}
              disabled={lessonPending || !(libraries.private || currentGroup && currentGroup.is_teaching)}
              style={{
                margin: '0.5em', cursor: lessonPending || !(libraries.private || currentGroup && currentGroup.is_teaching)
                  ? 'not-allowed' : 'pointer'
              }}
            >
              {selectedSemantics && selectedSemantics.includes(semantic) && (
                <Icon name="check" />
              )}
              <FormattedMessage id={semantic}/>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )

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
    <div className="align-center">
      <h5>
        <FormattedMessage id="select-lesson-vocab-diff" />:
      </h5>

      <div
        className="lesson-vocab-slider-container"
        style={{
          width: "80%",
          marginTop: "30px",
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
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
    </div>
  ) : (
    <div className="align-center">
      <h5>
        <FormattedMessage id="select-lesson-vocab-diff" />:
      </h5>

      <div
        className="lesson-vocab-slider-container"
        style={{
          width: "80%",
          marginTop: "30px",
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
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
    </div>
  )
  const lessonGroups = filteredLessons && filteredLessons.reduce((x, y) => {
    (x[y.group] = x[y.group] || []).push(y);
    return x;
  }, {}) || {} // Object.groupBy(filteredLessons, ({group})=> group)
  const handleClick = (e, props) => {
    const { index } = props
    const newIndex = accordionState === index ? -1 : index
    setAccordionState(newIndex)
  }
  const lessonTopicsControls = (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.0rem' }}>
        <Button
          variant='primary'
          disabled={
            lessonPending ||
            !selectedTopicIds ||
            selectedTopicIds.length === 0 ||
            !(libraries.private || (currentGroup && currentGroup.is_teaching))
          }
          style={{
            cursor: lessonPending || !(libraries.private || (currentGroup && currentGroup.is_teaching))
              ? 'not-allowed' : 'pointer',
          }}
          onClick={() => excludeAllTopics()}
        >
          <Icon name="trash alternate" />
          <FormattedMessage id="exclude-all-topics" />
        </Button>

        <input
          type="text"
          placeholder={intl.formatMessage({id: "Search lessons / topics ..." }) }
          value={searchQuery}
          onChange={handleSearchChange}
          style={{
            marginLeft: '0.5em',
            flex: '1', 
            padding: '5.5px', 
            borderRadius: '16px',
            border: '1px solid #ccc', 
            outline: 'none', 
            fontSize: '16px',
          }}
        />
      </div>

      {lessonGroups && (
        <Accordion fluid styled style={{background: '#fffaf0'}}>
        {
          Object.keys(lessonGroups).sort().map((group, index) => (
            <>
              <AccordionTitle
                key={`lesson-group-title-${group}`}
                active={accordionState === index}
                index={index}
                onClick={handleClick}
              >
                <h4>
                  <Icon name='dropdown' />
                  <FormattedMessage id='lesson-group' values={{group}}/>
                </h4>
              </AccordionTitle>
              <AccordionContent 
                key={`lesson-group-content-${group}`}
                active={accordionState === index}
              >
                {
                  lessonGroups[group].map((lesson) => (
                    rowRenderer({
                      key: `lesson-${lesson.ID}`,
                      lesson: lesson,
                      style: {}
                    })))
                }
              </AccordionContent>
            </>))
        }     
        </Accordion>
      )}
      

      {/* <Card.Group itemsPerRow={1} doubling data-cy="lesson-items" style={{ marginTop: '.5em' }}>
        <WindowScroller>
          {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <List
              autoHeight
              height={height}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              rowCount={filteredLessons.length}
              rowHeight={
                index => get_lesson_row_height(index)
              }
              rowRenderer={rowRenderer}
              scrollTop={scrollTop}
              width={10000}
            />
          )}
        </WindowScroller>
      </Card.Group> */}
    </div>
  )

  const handleCustomizeLessonCofigCogClick = () => {
    setCustomizeLessonConfigs(true)
    dispatch(setLessonStep(0))
  }

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

  function isLessonItemSelected(lesson_id) {
    const lesson_topics = lesson2info?.hasOwnProperty(lesson_id) ? lesson2info[lesson_id]['topics'] : []
    for (let lesson_topic of lesson_topics) {
      if (selectedTopicIds !== undefined && selectedTopicIds?.includes(lesson_topic)) {
        return true;
      }
    }
    return false;
  }

  function calculateLowestScore(topics) {
    if (topics.length === 0) {
      return { score: 0, correct: 0, total: 0 }
    }
  
    const { score, correct, total } = topics.reduce((lowest, topic) => {
      const currentScore = topic.correct / topic.total;
      if (currentScore < lowest.score) {
        return { score: currentScore, correct: topic.correct, total: topic.total };
      }
      return lowest;
    }, { score: topics[0].correct / topics[0].total, correct: topics[0].correct, total: topics[0].total });
  
    return { score, correct, total };
  }

  function rowRenderer({ key, lesson, style }) {
    if (!lesson) return null

    const lowestScore = calculateLowestScore(topics.filter(topic => lesson.topics && lesson.topics?.includes(topic.topic_id)))
    lesson.correct = lowestScore.correct
    lesson.total = lowestScore.total
    return (
      <div
        key={key}
        style={{ ...style, marginBottom: '1.5em' }}
      >
        <LessonListItem
          lesson={lesson}
          selected={isLessonItemSelected(lesson.ID)}
          toggleTopic={toggleTopic}
          includeLesson={includeLesson}
          excludeLesson={excludeLesson}
          disabled={(!currentGroup || !currentGroup.is_teaching) && !libraries.private}
        />
      </div>
    )
  }

  return (
    <div className="cont-tall pt-lg cont flex-col auto gap-row-sm ">

      {metaPending || groupPending ? (
        <Placeholder>
          <Placeholder.Line />
        </Placeholder>
      ) :
        noResults ? (
          <div className="justify-center mt-lg" style={{ color: 'rgb(112, 114, 120)' }}>
            <FormattedMessage id="no-lessons-found" />
          </div>
        ) : (
          <>
            <div className="library-selection">
              <LibraryTabs
                values={Object.fromEntries(Object.entries(libraries).filter(([key]) => 
                  (key === 'private' && !teacherView) || (key === 'group' && (teacherView || groups.length > 0))))}
                additionalClass="wrap-and-grow align-center pt-sm"
                onClick={handleLibraryChange}
                reverse
              />
              {libraries.group && (
                <Select
                  value={savedGroupSelection}
                  options={groupDropdownOptions}
                  onChange={handleGroupChange}
                  disabled={!libraries.group}
                  style={{ color: '#777', marginTop: '0.5em' }}
                />
              )}
            </div>

            {libraries.group && !teacherView ? (
              <div>
                {lessonStartControls}
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                  <Stepper
                    styleConfig={{
                      completedBgColor: '#c6e2ff',
                      activeBgColor: '#003366',
                      inactiveBgColor: '#d2d3d6',
                    }}
                  >
                    <Step
                      label={<FormattedMessage id="select-lesson-themes-and-vocabulary" />}
                      active={goStep == 0}
                      completed={goStep > 0}
                      onClick={() => {
                        if (goStep == 1){
                          finnishSelectingTopics()
                        }
                        dispatch(setLessonStep(0))
                      }}
                    />
                    <Step
                      label={<FormattedMessage id="select-lesson-grammar" />}
                      active={goStep == 1}
                      completed={goStep > 1}
                      onClick={() => {
                        if (goStep == 1){
                          finnishSelectingTopics()
                        }
                        dispatch(setLessonStep(1))
                      }}
                    />
                    <Step
                      label={<FormattedMessage id="start-lesson-practice" />}
                      active={goStep == 2}
                      completed={goStep > 2}
                      onClick={() => {
                        if (goStep == 1){
                          finnishSelectingTopics()
                        }
                        dispatch(setLessonStep(2))
                      }}
                    />
                  </Stepper>

                  <Button
                    style={{
                      float: 'right', marginBottom: '8%',
                      cursor: lessonPending || !(libraries.private || currentGroup && currentGroup.is_teaching)
                        ? 'not-allowed' : 'pointer'
                    }}
                    disabled={lessonPending || goStep >= 2 || selectedSemantics && selectedSemantics.length === 0 && goStep == 0 || 
                      selectedTopicIds && selectedTopicIds.length === 0 && goStep == 1}
                    onClick={() => {
                      if (goStep == 0){
                        finnishSelectingSemanticsAndVocabDiff()
                      }
                      if (goStep == 1){
                        finnishSelectingTopics()
                      }
                      dispatch(setLessonStep(goStep + 1))
                    }}>
                    <FormattedMessage id="next-step" />
                  </Button>
                </div>
                {lessonPending && goStep === -1 && (
                  <Placeholder>
                    <Placeholder.Line />
                  </Placeholder>
                )}
                {(goStep === 0 || !lessonPending && goStep === -1) && (
                 <>
                     <div style={{marginTop: '40px'}}>
                         {lessonSemanticControls}
                     </div>
                     <hr/>
                     <div style={{marginTop: '40px'}}>
                         {lessonVocabularyControls}
                     </div>
                 </>
                )}
                {goStep === 1 && (
                  <div>
                    {lessonTopicsControls}
                  </div>
                )}
                {goStep === 2 && (
                  <div>
                    {lessonStartControls}
                  </div>
                )}
                {/* {libraryControls} */}
              </div>
            )}
            <ScrollArrow />
          </>
        )}
    </div>
  )
}

export default LessonList
