import { useDispatch, useSelector } from 'react-redux'
import { useIntl, FormattedMessage } from 'react-intl'
import { List, WindowScroller } from 'react-virtualized'
import React, { useEffect, useState } from 'react'
import { Placeholder, Card, Icon, Dropdown } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useLearningLanguage } from 'Utilities/common'
import { getLessonTopics } from 'Utilities/redux/lessonsReducer'
import { getLessonInstance, setLessonInstance } from 'Utilities/redux/lessonInstanceReducer'
import { getMetadata } from 'Utilities/redux/metadataReducer'
import LessonListItem from 'Components/Lessons/LessonLibrary/LessonListItem'

import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { startLessonsTour } from 'Utilities/redux/tourReducer'
import { lessonsTourViewed } from 'Utilities/redux/userReducer'

// import useWindowDimensions from 'Utilities/windowDimensions'
// import AddStoryModal from 'Components/AddStoryModal'
// import LessonLibrarySearch from './LessonLibrarySearch'

const LessonList = () => {
  const intl = useIntl()
  const learningLanguage = useLearningLanguage()
  const refreshed = useSelector(({ user }) => user.refreshed)
  const { pending: metaPending, lesson_semantics, lesson_topics } = useSelector(({ metadata }) => metadata)
  const { pending: topicPending, topics } = useSelector(({ lessons }) => lessons)
  const { pending: lessonPending, lesson  } = useSelector(({ lessonInstance }) => lessonInstance)
  const { user } = useSelector(({ user }) => ({ user: user.data }))

  const _lesson_sort_criterion = { direction: 'asc', sort_by: 'index' }
  

  const [sorter, setSorter] = useState(_lesson_sort_criterion.sort_by)
  const [sortDirection, setSortDirection] = useState(_lesson_sort_criterion.direction)

  const {topic_ids: selectedTopicIds, semantic: selectedSemantics} = lesson


  


  const dispatch = useDispatch()

  // console.log("topics", topics)

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

  const toggleTopic = (topicId) => {
    let newTopics
    if (selectedTopicIds.includes(topicId)) {
      newTopics = selectedTopicIds.filter((id) => id !== topicId)
    } else {
      newTopics = [...selectedTopicIds, topicId]
    }
    dispatch(setLessonInstance({ topic_ids: newTopics }))
  }

  const toggleSemantic = (semantic) => {
    let newSemantic
    if (selectedSemantics.includes(semantic)) {
      newSemantic = selectedSemantics.filter((s) => s !== semantic)
    } else {
      newSemantic = [...selectedSemantics, semantic]
    }
    dispatch(setLessonInstance({ semantic: newSemantic }))
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

  // const libraryControls = (
  //   <div data-cy="library-controls" className="library-control">
  //     <div className="search-and-sort">
  //       <div className="flex align-center">
  //         <Dropdown
  //           value={sorter}
  //           options={sortDropdownOptions}
  //           onChange={handleSortChange}
  //           selection
  //         />
  //         <Icon
  //           style={{ cursor: 'pointer', marginLeft: '0.5em' }}
  //           name={sortDirection === 'asc' ? 'caret up' : 'caret down'}
  //           size="large"
  //           color="grey"
  //           onClick={handleDirectionChange}
  //         />
  //       </div>
  //     </div>
  //   </div>
  // )



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
    const topic = topics && topics[index] || lesson_topics[index]
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

  if (metaPending ) {
    return (
      <div className="cont-tall cont flex-col auto gap-row-sm">
        {/* {libraryControls} */}
        <Placeholder>
          <Placeholder.Line />
        </Placeholder>
      </div>
    )
  }

  return (
    <div className="cont-tall pt-lg cont flex-col auto gap-row-sm ">
      {noResults ? (
        <div className="justify-center mt-lg" style={{ color: 'rgb(112, 114, 120)' }}>
          <FormattedMessage id="no-lessons-found" />
        </div>
      ) : (
        <>
        <Link to={'/lesson/practice'}>
          <Button size="big"
            disabled={lessonPending || !selectedTopicIds || !selectedSemantics || 
              selectedTopicIds.length === 0 || selectedSemantics.length === 0}
            style={{
              fontSize: '1.3em',
              fontWeight: 500,
              margin: '1em 0',
              padding: '1rem 0',
              width: '100%',
              border: '2px solid #000',
            }}>
            <FormattedMessage id="start-practice" />
          </Button>
        </Link>
        <h5><FormattedMessage id="select-lesson-semantic-topic"/></h5>
        <div className="group-buttons sm">
          {
            lesson_semantics && lesson_semantics.map(semantic => (
              <Button 
                variant={selectedSemantics && selectedSemantics.includes(semantic)? 'primary' : 'outline-primary'}
                onClick={() => toggleSemantic(semantic)}
              >
                {selectedSemantics && selectedSemantics.includes(semantic) && <Icon name="check" />}
                {semantic}
              </Button>
            ))
          }
        </div>
        {/* {libraryControls} */}
        <Card.Group itemsPerRow={2} doubling data-cy="lesson-items" style={{ marginTop: '.5em' }}>
          <WindowScroller>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
              <List
                autoHeight
                height={height}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                rowCount={topics.length}
                rowHeight={155}
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
