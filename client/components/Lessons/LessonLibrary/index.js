import { useDispatch, useSelector } from 'react-redux'
import { useIntl, FormattedMessage } from 'react-intl'
import { List, WindowScroller } from 'react-virtualized'
import React, { useEffect, useState } from 'react'
import { Placeholder, Card, Icon, Dropdown } from 'semantic-ui-react'

import { useLearningLanguage } from 'Utilities/common'
import { getMetadata } from 'Utilities/redux/metadataReducer'
// import { getLessons } from 'Utilities/redux/lessonsReducer'

import SelectLessonModal from 'Components/Lessons/SelectLessonModal'
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

  const { pending, lessons } = useSelector(({ metadata }) => metadata)
  const { user } = useSelector(({ user }) => ({ user: user.data }))

  const _lesson_sort_criterion = { direction: 'asc', sort_by: 'index' }
  // let _selected_lesson_tab = 'all_lessons'
  // const smallScreenSearchbar = useRef()
  // const smallWindow = useWindowDimensions().width < 520

  const [sorter, setSorter] = useState(_lesson_sort_criterion.sort_by)
  const [sortDirection, setSortDirection] = useState(_lesson_sort_criterion.direction)
  // const [smallScreenSearchOpen, setSmallScreenSearchOpen] = useState(false)
  const [displayedLessons, setDisplayedLessons] = useState([])
  const [lessonSyllabusId, setlessonSyllabusId] = useState(null)

  const dispatch = useDispatch()

  // console.log("lessons", lessons)

  useEffect(() => {
    dispatch(getMetadata(learningLanguage))
  }, [])

  useEffect(() => {
    if (lessons) setDisplayedLessons(lessons)
  }, [lessons])

  useEffect(() => {
    if (!user.user.has_seen_lesson_tour) {
      dispatch(lessonsTourViewed())
      dispatch(sidebarSetOpen(false))
      dispatch(startLessonsTour())
    }
  }, [])

  // useEffect(() => {
  //   setSorter('index')
  // }, [_selected_lesson_tab])

  // useEffect(() => {
  //   if (smallScreenSearchbar.current && smallScreenSearchOpen) smallScreenSearchbar.current.focus()
  // }, [smallScreenSearchOpen])

  const sortDropdownOptions = [
    {
      key: 'index',
      text: intl.formatMessage({ id: 'sort-by-lesson-index-option' }),
      value: 'index',
    },
    {
      key: 'syllabus_id',
      text: intl.formatMessage({ id: 'sort-by-lesson-syllabus-id-option' }),
      value: 'syllabus_id',
    },
  ]

  // HANDLERS
  const handleSortChange = (_e, option) => {
    setSorter(option.value)
  }

  const handleDirectionChange = () => {
    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc'
    setSortDirection(newDirection)
  }
  /*
  const handleOpenLessonModal = (lesson_syllabus_id, isOpen) => {
    setlessonSyllabusId(lesson_syllabus_id)
    setLessonModalOpen(isOpen)
  }
*/
  const libraryControls = (
    <div data-cy="library-controls" className="library-control">
      <div className="search-and-sort">
        <div className="flex align-center">
          <Dropdown
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
          />
        </div>
        {/* {smallWindow ? (
          <Icon
            name={smallScreenSearchOpen ? 'close' : 'search'}
            circular
            color="grey"
            onClick={handleSearchIconClick}
          />
        ) : (
          <LessonLibrarySearch
            setDisplayedStories={setDisplayedStories}
            setDisplaySearchResults={setDisplaySearchResults}
          />
        )} */}
      </div>
      {/* {smallScreenSearchOpen && (
        <LessonLibrarySearch
          setDisplayedStories={setDisplayedStories}
          setDisplaySearchResults={setDisplaySearchResults}
          fluid
        />
      )} */}
    </div>
  )

  const libraryFilteredLessons = displayedLessons.filter(lesson => {
    return lesson
  })

  const noResults = !pending && libraryFilteredLessons.length === 0

  libraryFilteredLessons.sort((a, b) => {
    let dir = 0
    switch (sorter) {
      case 'index':
        dir = a.index > b.index ? 1 : -1
        break
      case 'syllabus_id':
        dir = a.syllabus_id > b.syllabus_id ? 1 : -1
        break
      default:
        break
    }
    const multiplier = sortDirection === 'asc' ? 1 : -1
    return dir * multiplier
  })

  const showModal = useSelector(state => state.modal.showModal)

  const handleShowModal = lesson_syllabus_id => {
    setlessonSyllabusId(lesson_syllabus_id)
    if (showModal) {
      dispatch({ type: 'CLOSE_MODAL' })
    } else {
      dispatch({ type: 'SHOW_MODAL' })
    }
  }

  function rowRenderer({ key, index, style }) {
    return (
      <div
        key={key}
        style={{ ...style, paddingRight: '0.5em', paddingLeft: '0.5em', marginBottom: '0.5em' }}
      >
        <LessonListItem lesson={libraryFilteredLessons[index]} handleShowModal={handleShowModal} />
      </div>
    )
  }

  if (pending || !refreshed || !libraryFilteredLessons) {
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
      <SelectLessonModal
        showModal={showModal}
        handleShowModal={handleShowModal}
        lesson_syllabus_id={lessonSyllabusId}
      />
      {/* {libraryControls} */}
      {noResults ? (
        <div className="justify-center mt-lg" style={{ color: 'rgb(112, 114, 120)' }}>
          <FormattedMessage id="no-lessons-found" />
        </div>
      ) : (
        <Card.Group itemsPerRow={1} doubling data-cy="lesson-items" style={{ marginTop: '.5em' }}>
          <WindowScroller>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
              <List
                autoHeight
                height={height}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                rowCount={libraryFilteredLessons.length}
                rowHeight={index => {
                  const lesson = libraryFilteredLessons[index.index]
                  const topics = lesson ? lesson.topics : []
                  const concepts = []
                  topics.forEach((topic, i) => {
                    const topic_concepts = topic.topic.split(';')
                    topic_concepts.forEach((topic_concept, k) => {
                      concepts.push(topic_concept)
                    })
                  })
                  return 130 + concepts.length * 25 //  + (topics.length - 1) * 5;
                }}
                // rowHeight= {300}
                rowRenderer={rowRenderer}
                scrollTop={scrollTop}
                width={10000}
              />
            )}
          </WindowScroller>
        </Card.Group>
      )}
    </div>
  )
}

export default LessonList
