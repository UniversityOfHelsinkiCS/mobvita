import { useDispatch, useSelector } from 'react-redux'
import { useIntl, FormattedMessage } from 'react-intl'
import { List, WindowScroller } from 'react-virtualized'
import React, { useEffect, useState } from 'react'
import { Placeholder, Card, Icon, Select } from 'semantic-ui-react'
import ScrollArrow from 'Components/ScrollArrow'
import LibraryTabs from 'Components/LibraryTabs'
import ReactSlider from 'react-slider'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { Stepper, Step } from 'react-form-stepper';
import { useLearningLanguage } from 'Utilities/common'
import { getLessonTopics } from 'Utilities/redux/lessonsReducer'
import { 
  getLessonInstance, 
  setLessonInstance, 
  clearLessonInstanceState } from 'Utilities/redux/lessonInstanceReducer'
import { getMetadata } from 'Utilities/redux/metadataReducer'
import { getGroups } from 'Utilities/redux/groupsReducer'
import LessonListItem from 'Components/Lessons/LessonLibrary/LessonListItem'
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
  } = useSelector(({ metadata }) => metadata)
  const { pending: topicPending, topics } = useSelector(({ lessons }) => lessons)
  const { pending: lessonPending, lesson } = useSelector(({ lessonInstance }) => lessonInstance)
  
  const { groups, deleteSuccessful } = useSelector(({ groups }) => groups)
  const currentGroup = groups.find(g => g.group_id === savedGroupSelection)

  const _lesson_sort_criterion = { direction: 'asc', sort_by: 'index' }
  const smallWindow = useWindowDimensions().width < 520

  const [sorter, setSorter] = useState(_lesson_sort_criterion.sort_by)
  const [sortDirection, setSortDirection] = useState(_lesson_sort_criterion.direction)

  const { topic_ids: selectedTopicIds, semantic: selectedSemantics, vocab_diff } = lesson
  const [sliderValue, setSliderValue] = useState(1.5)

  const [libraries, setLibraries] = useState({
    private: false,
    group: false,
  })

  const [goStep, setGoStep] = useState(0);

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
          style={{ float: 'right', cursor: lessonPending || !(libraries.private || currentGroup && currentGroup.is_teaching)
            ? 'not-allowed' : 'pointer'}}
          onClick={() => setGoStep(1)}>
            Next step
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
              style={{ margin: '0.5em', cursor: lessonPending || !(libraries.private || currentGroup && currentGroup.is_teaching)
              ? 'not-allowed' : 'pointer'}}
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
          style={{ float: 'right', cursor: lessonPending || !(libraries.private || currentGroup && currentGroup.is_teaching)
            ? 'not-allowed' : 'pointer'}}
          onClick={() => setGoStep(2)}>
            Next step
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
        <span><FormattedMessage id='Easy'/></span>
        <span><FormattedMessage id='Hard'/></span>
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
          style={{cursor: lessonPending || !(libraries.private || currentGroup && currentGroup.is_teaching)
            ? 'not-allowed' : 'pointer'}}
          onClick={()=> dispatch(setLessonInstance({ topic_ids: [], group_id: libraries.group && savedGroupSelection || null }))}>
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
          style={{ float: 'right', cursor: lessonPending || !(libraries.private || currentGroup && currentGroup.is_teaching)
            ? 'not-allowed' : 'pointer'}}
          onClick={() => setGoStep(3)}>
            Next step
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
              rowCount={topics.length}
              rowHeight={index => 130 + topics[index.index].topic.split(';').length * 25}
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
  const lessonStartControls = (
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

  function rowRenderer({ key, index, style }) {
    const topic = (topics && topics[index]) || lesson_topics[index]
    return (
      <div
        key={key}
        style={{ ...style, paddingRight: '0.5em', paddingLeft: '0.5em', marginBottom: '0.5em' }}
      >
        <LessonListItem
          topic={topic}
          selected={selectedTopicIds && selectedTopicIds.includes(topic.topic_id)}
          toggleTopic={toggleTopic}
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
                label='1. Select lesson themes' 
                active={goStep==0} 
                completed={goStep > 0}
                onClick={() => setGoStep(0)}
              />
              <Step 
                label='2. Choose difficulty of the vocabulary for lesson' 
                active={goStep==1} 
                completed={goStep > 1} 
                onClick={() => setGoStep(1)}
              />
              <Step 
                label='3. Select lesson topics' 
                active={goStep==2} 
                completed={goStep > 2}
                onClick={() => setGoStep(2)}
              />
              <Step 
                label='4. Start practicing lesson' 
                active={goStep==3} 
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
