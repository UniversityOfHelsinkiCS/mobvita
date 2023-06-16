import { useDispatch, useSelector } from 'react-redux'
import { useIntl, FormattedMessage } from 'react-intl'
import { List, WindowScroller } from 'react-virtualized'
import React, { useEffect, useState } from 'react'
import { Placeholder, Card, Icon, Select } from 'semantic-ui-react'
import { Segment } from 'semantic-ui-react'

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
  clearLessonInstanceState
} from 'Utilities/redux/lessonInstanceReducer'
import { getMetadata } from 'Utilities/redux/metadataReducer'
import { getGroups } from 'Utilities/redux/groupsReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { startLessonsTour } from 'Utilities/redux/tourReducer'
import { lessonsTourViewed, updateGroupSelect, updateLibrarySelect } from 'Utilities/redux/userReducer'

import useWindowDimensions from 'Utilities/windowDimensions'
// import AddStoryModal from 'Components/AddStoryModal'
// import LessonLibrarySearch from './LessonLibrarySearch'

const LessonList = () => {
  const intl = useIntl()
  const learningLanguage = useLearningLanguage()
  const {
    last_selected_library: savedLibrarySelection,
    last_selected_group: savedGroupSelection,
    oid: userId,
    has_seen_lesson_tour,
  } = useSelector(({ user }) => user.data.user)
  const {
    pending: metaPending,
    lesson_semantics,
    lesson_topics,
    lessons,
  } = useSelector(({ metadata }) => metadata)
  const { pending: topicPending, topics } = useSelector(({ lessons }) => lessons)
  const { pending: lessonPending, lesson } = useSelector(({ lessonInstance }) => lessonInstance)

  const { groups, deleteSuccessful } = useSelector(({ groups }) => groups)
  const currentGroup = groups.find(g => g.group_id === savedGroupSelection)

  const _lesson_sort_criterion = { direction: 'asc', sort_by: 'index' }
  // const smallWindow = useWindowDimensions().width < 520

  const [sorter, setSorter] = useState(_lesson_sort_criterion.sort_by)
  const [sortDirection, setSortDirection] = useState(_lesson_sort_criterion.direction)

  const { topic_ids: selectedTopicIds, semantic: selectedSemantics, vocab_diff } = lesson
  const [sliderValue, setSliderValue] = useState(1.5)

  const [libraries, setLibraries] = useState({
    private: false,
    group: false,
  })

  const [goStep, setGoStep] = useState(0);
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
    if (!metaPending) {
      dispatch(getMetadata(learningLanguage))
    }
  }, [learningLanguage])

  useEffect(() => {
    dispatch(getLessonTopics())
    dispatch(getGroups())
    if (savedLibrarySelection == 'group' || savedLibrarySelection == 'public') {
      setLibrary('group')
      dispatch(getLessonInstance(savedGroupSelection))
    }
    else {
      setLibrary('private')
      dispatch(getLessonInstance())
    }
    if (!has_seen_lesson_tour) {
      dispatch(lessonsTourViewed())
      dispatch(sidebarSetOpen(false))
      dispatch(startLessonsTour())
    }
  }, [])


  useEffect(() => {
    if (!lessonPending) {
      setSliderValue(vocab_diff)
    }
  }, [vocab_diff])


  const toggleTopic = topicId => {
    let newTopics
    if (selectedTopicIds.includes(topicId)) {
      newTopics = selectedTopicIds.filter(id => id !== topicId)
    } else {
      newTopics = [...selectedTopicIds, topicId]
    }
    const payload = { topic_ids: newTopics }
    if (libraries.group) payload.group_id = savedGroupSelection
    dispatch(setLessonInstance(payload))
  }

  const includeLesson = LessonId => {
    let lessonTopics = lesson_topics.filter(lesson => lesson.lessons.includes(LessonId)).map(topic => topic.topic_id);
    let newTopics = selectedTopicIds
    for (let lesson_topic of lessonTopics){
      if (!selectedTopicIds.includes(lesson_topic)){
        newTopics = [...newTopics, lesson_topic]
      }
    }
    const payload = { topic_ids: newTopics }
    if (libraries.group) payload.group_id = savedGroupSelection
    dispatch(setLessonInstance(payload))
  }

  const excludeLesson = LessonId => {
    let lessonTopics = lesson_topics.filter(lesson => lesson.lessons.includes(LessonId)).map(topic => topic.topic_id);
    let newTopics = selectedTopicIds.filter(id => !lessonTopics.includes(id))
    const payload = { topic_ids: newTopics }
    if (libraries.group) payload.group_id = savedGroupSelection
    dispatch(setLessonInstance(payload))
  }

  const toggleSemantic = semantic => {
    let newSemantic
    if (selectedSemantics.includes(semantic)) {
      newSemantic = selectedSemantics.filter(s => s !== semantic)
    } else {
      newSemantic = [...selectedSemantics, semantic]
    }
    const payload = { semantic: newSemantic }
    if (libraries.group) payload.group_id = savedGroupSelection
    dispatch(setLessonInstance(payload))
  }

  const handleSlider = value => {
    setSliderValue(value)
    const payload = { vocab_diff: value }
    if (libraries.group) payload.group_id = savedGroupSelection
    dispatch(setLessonInstance(payload))
  }

  const handleLibraryChange = library => {
    dispatch(updateLibrarySelect(library))
    setLibrary(library)
    dispatch(clearLessonInstanceState())
    dispatch(getLessonInstance(library == 'group' && savedGroupSelection || null))
    setGoStep(0)
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
    setGoStep(0)
  }

  const lessonSemanticControls = (
    <div className="align-center">
      <h5>
        <FormattedMessage id="select-lesson-semantic-topic" />
        <Button
          style={{
            float: 'right', cursor: lessonPending || !(libraries.private || currentGroup && currentGroup.is_teaching)
              ? 'not-allowed' : 'pointer'
          }}
          onClick={() => setGoStep(1)}>
          <FormattedMessage id="next-step" />
        </Button>
      </h5>
      <div className="group-buttons sm lesson-story-topic">
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
              {semantic}
            </Button>
          ))}
      </div>
    </div>
  )

  const lessonVocabularyControls = (
    <div className="align-center">
      <h5>
        <FormattedMessage id="select-lesson-vocab-diff" />
        <Button
          style={{
            float: 'right', cursor: lessonPending || !(libraries.private || currentGroup && currentGroup.is_teaching)
              ? 'not-allowed' : 'pointer'
          }}
          onClick={() => setGoStep(2)}>
          <FormattedMessage id="next-step" />
        </Button>
      </h5>

      <ReactSlider
        className="exercise-density-slider lesson-vocab-diff"
        thumbClassName="exercise-density-slider-thumb"
        trackClassName='exercise-density-slider-track'
        onAfterChange={value => handleSlider(value)}
        min={0.8}
        max={3.3}
        step={0.5}
        value={sliderValue}
        disabled={lessonPending || !(libraries.private || currentGroup && currentGroup.is_teaching)}
      />
      <div className="space-between exercise-density-slider-label-cont bold">
        <span><FormattedMessage id='Easy' /></span>
        <span><FormattedMessage id='Hard' /></span>
      </div>
    </div>
  )

  const lessonTopicsControls = (
    <div>
      <div>
        <Button
          variant='primary'
          disabled={
            lessonPending ||
            !selectedTopicIds ||
            selectedTopicIds.length === 0 ||
            !(libraries.private || currentGroup && currentGroup.is_teaching)
          }
          style={{
            cursor: lessonPending || !(libraries.private || currentGroup && currentGroup.is_teaching)
              ? 'not-allowed' : 'pointer'
          }}
          onClick={() => dispatch(setLessonInstance({ topic_ids: [], group_id: libraries.group && savedGroupSelection || null }))}>
          <Icon name="trash alternate" />
          <FormattedMessage id="exclude-all-topics" />
        </Button>
        <Button
          disabled={
            lessonPending ||
            !selectedTopicIds ||
            selectedTopicIds.length === 0 ||
            !(libraries.private || currentGroup && currentGroup.is_teaching)
          }
          style={{
            float: 'right', cursor: lessonPending || !(libraries.private || currentGroup && currentGroup.is_teaching)
              ? 'not-allowed' : 'pointer'
          }}
          onClick={() => setGoStep(3)}>
          <FormattedMessage id="next-step" />
        </Button>
      </div>

      <Card.Group itemsPerRow={1} doubling data-cy="lesson-items" style={{ marginTop: '.5em' }}>
        <WindowScroller>
          {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <List
              autoHeight
              height={height}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              rowCount={lessons.length}
              rowHeight={index => 130 + lessons[index.index].topics.length * 27}
              rowRenderer={rowRenderer}
              scrollTop={scrollTop}
              width={10000}
            />
          )}
        </WindowScroller>
      </Card.Group>
      <ScrollArrow />
    </div>
  )

  const link = '/lesson' + (libraries.group ? `/group/${savedGroupSelection}/practice` : '/practice')
  let lessonStartControls = (
    <div>
      <div style={{ 'display': 'flex' }}>
        <LessonPracticeThemeHelp selectedThemes={selectedSemantics ? selectedSemantics : []} always_show={true} />
        <LessonPracticeTopicsHelp selectedTopics={selectedTopicIds} always_show={true} />
      </div>
      <Link to={link}>
        <Button
          size="big"
          className="lesson-practice"
          disabled={
            lessonPending ||
            !selectedTopicIds ||
            !selectedSemantics ||
            selectedTopicIds.length === 0 ||
            selectedSemantics.length === 0 || noResults
          }
          style={{
            fontSize: '1.3em',
            fontWeight: 500,
            margin: '1em 0',
            padding: '1rem 0',
            width: '100%',
            border: '2px solid #000',
          }}
        >
          {lessonPending && <Icon name="spinner" loading />}
          <FormattedMessage id="start-practice" />
        </Button>
      </Link>
    </div>
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

  const isLessonItemSelected = (lesson_id) => {
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

  function rowRenderer({ key, index, style }) {
    const lesson = lessons && lessons[index]
    const lowestScore = calculateLowestScore(topics.filter(topic => topic.lessons.includes(lesson.ID)))
    lesson.correct = lowestScore.correct
    lesson.total = lowestScore.total
    return (
      <div
        key={key}
        style={{ ...style, paddingRight: '0.5em', paddingLeft: '0.5em', marginBottom: '0.5em' }}
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

      {metaPending ? (
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
                values={libraries}
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

            <Stepper
              styleConfig={{
                completedBgColor: '#003366',
                activeBgColor: '#c6e2ff',
                inactiveBgColor: '#d2d3d6',
              }}
            >
              <Step
                label={<FormattedMessage id="select-lesson-themes" />}
                active={goStep == 0}
                completed={goStep > 0}
                onClick={() => setGoStep(0)}
              />
              <Step
                label={<FormattedMessage id="select-lesson-vocab" />}
                active={goStep == 1}
                completed={goStep > 1}
                onClick={() => setGoStep(1)}
              />
              <Step
                label={<FormattedMessage id="select-lesson-grammar" />}
                active={goStep == 2}
                completed={goStep > 2}
                onClick={() => setGoStep(2)}
              />
              <Step
                label={<FormattedMessage id="start-lesson-practice" />}
                active={goStep == 3}
                completed={goStep > 3}
                onClick={() => setGoStep(3)}
              />
            </Stepper>

            {goStep === 0 && (
              <div>
                {lessonSemanticControls}
              </div>
            )}
            {goStep === 1 && (
              <div>
                {lessonVocabularyControls}
              </div>
            )}
            {goStep === 2 && (
              <div>
                {lessonTopicsControls}
              </div>
            )}
            {goStep === 3 && (
              <div>
                {lessonStartControls}
              </div>
            )}

            {/* {libraryControls} */}
          </>
        )}
    </div>
  )
}

export default LessonList
