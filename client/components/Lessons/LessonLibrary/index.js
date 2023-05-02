import { useDispatch, useSelector } from 'react-redux'
import { useIntl, FormattedMessage } from 'react-intl'
import { List, WindowScroller } from 'react-virtualized'
import React, { useEffect, useState } from 'react'
import { Placeholder, Card, Icon, Dropdown } from 'semantic-ui-react'
import ReactSlider from 'react-slider'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useLearningLanguage } from 'Utilities/common'
import { getLessonTopics } from 'Utilities/redux/lessonsReducer'
import { getLessonInstance, setLessonInstance } from 'Utilities/redux/lessonInstanceReducer'
import { getMetadata } from 'Utilities/redux/metadataReducer'
import LessonListItem from 'Components/Lessons/LessonLibrary/LessonListItem'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { startLessonsTour } from 'Utilities/redux/tourReducer'
import { lessonsTourViewed, updateGroupSelect, updateLibrarySelect } from 'Utilities/redux/userReducer'

// import useWindowDimensions from 'Utilities/windowDimensions'
// import AddStoryModal from 'Components/AddStoryModal'
// import LessonLibrarySearch from './LessonLibrarySearch'

const LessonList = () => {
  const intl = useIntl()
  const learningLanguage = useLearningLanguage()
  const {
    last_selected_library: savedLibrarySelection,
    last_selected_group: savedGroupSelection,
    oid: userId,
  } = useSelector(({ user }) => user.data.user)
  const {
    pending: metaPending,
    lesson_semantics,
    lesson_topics,
  } = useSelector(({ metadata }) => metadata)
  const { pending: topicPending, topics } = useSelector(({ lessons }) => lessons)
  const { pending: lessonPending, lesson } = useSelector(({ lessonInstance }) => lessonInstance)
  const { user } = useSelector(({ user }) => ({ user: user.data }))

  const _lesson_sort_criterion = { direction: 'asc', sort_by: 'index' }

  const [sorter, setSorter] = useState(_lesson_sort_criterion.sort_by)
  const [sortDirection, setSortDirection] = useState(_lesson_sort_criterion.direction)

  const { topic_ids: selectedTopicIds, semantic: selectedSemantics, vocab_diff } = lesson
  const [sliderValue, setSliderValue] = useState(1.5)

  const [libraries, setLibraries] = useState({
    private: false,
    group: false,
  })

  const dispatch = useDispatch()

  // console.log("topics", topics)

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
    dispatch(getLessonInstance())
    dispatch(getLessonTopics())
    if (!user.user.has_seen_lesson_tour) {
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
    dispatch(setLessonInstance({ topic_ids: newTopics }))
  }

  const toggleSemantic = semantic => {
    let newSemantic
    if (selectedSemantics.includes(semantic)) {
      newSemantic = selectedSemantics.filter(s => s !== semantic)
    } else {
      newSemantic = [...selectedSemantics, semantic]
    }
    dispatch(setLessonInstance({ semantic: newSemantic }))
  }

  const handleSlider = value => {
    setSliderValue(value)
    dispatch(setLessonInstance({ vocab_diff: value }))
  }

  const handleLibraryChange = library => {
    dispatch(updateLibrarySelect(library))
    setLibrary(library)
  }

  // const sortDropdownOptions = [
  //   {
  //     key: 'index',
  //     text: intl.formatMessage({ id: 'sort-by-lesson-index-option' }),
  //     value: 'index',
  //   },
  //   {
  //     key: 'syllabus_id',
  //     text: intl.formatMessage({ id: 'sort-by-lesson-syllabus-id-option' }),
  //     value: 'syllabus_id',
  //   },
  // ]

  // // HANDLERS
  // const handleSortChange = (_e, option) => {
  //   setSorter(option.value)
  // }

  // const handleDirectionChange = () => {
  //   const newDirection = sortDirection === 'asc' ? 'desc' : 'asc'
  //   setSortDirection(newDirection)
  // }

  const libraryControls = (
    <div data-cy="library-controls" className="library-control">
      <div className="search-and-sort">
        <div className="align-center">
          {/* <Dropdown
            value={sorter}
            options={sortDropdownOptions}
            onChange={handleSortChange}
            selection
          />
          <Icon
            style={{ cursor: 'pointer', marginLeft: '0.5em' }}
            name={sortDirection === 'asc' ? 'caret up' : 'caret down'}
            size="large"
            color="grey"
            onClick={handleDirectionChange}
          /> */}
          <h5>
            <FormattedMessage id="select-lesson-semantic-topic" />
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
                  disabled={lessonPending}
                  style={{ margin: '0.5em' }}
                >
                  {selectedSemantics && selectedSemantics.includes(semantic) && (
                    <Icon name="check" />
                  )}
                  {semantic}
                </Button>
              ))}
          </div>
        </div>
        <div className="align-center">
          <h5>
            <FormattedMessage id="select-lesson-vocab-diff" />
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
            disabled={lessonPending}
          />
        </div>
        
        <Button 
          variant='primary'
          disabled={
            lessonPending ||
            !selectedTopicIds ||
            selectedTopicIds.length === 0
          }
          onClick={()=> dispatch(setLessonInstance({ topic_ids: [] }))}>
          <Icon name="trash alternate" />
          <FormattedMessage id="exclude-all-topics" />
        </Button>
      </div>
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
        />
      </div>
    )
  }

  return (
    <div className="cont-tall pt-lg cont flex-col auto gap-row-sm ">
      <Link to={'/lesson/practice'}>
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
            {libraryControls}
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
          </>
      )}
    </div>
  )
}

export default LessonList
