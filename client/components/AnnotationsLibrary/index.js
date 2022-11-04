/* eslint-disable no-lonely-if */
import React, { useState, useEffect } from 'react'
import { Card } from 'semantic-ui-react'
import { getAllAnnotations } from 'Utilities/redux/annotationsReducer'
import { useDispatch, useSelector } from 'react-redux'
import { List, WindowScroller } from 'react-virtualized'
import { FormattedMessage } from 'react-intl'
import LibraryTabs from 'Components/LibraryTabs'
import AnnotationListItem from './AnnotationListItem'
import AnnotationsLibrarySearch from './AnnotationsLibrarySearch'

const AnnotationsLibrary = () => {
  const dispatch = useDispatch()
  const [category, setCategory] = useState('All')
  const [annotationsList, setAnnotationsList] = useState([])
  const [publicAnnotations, setPublicAnnotations] = useState([])
  const [privateAnnotations, setPrivateAnnotations] = useState([])
  const { allAnnotations } = useSelector(({ annotations }) => annotations)
  const [activeLibrary, setActiveLibrary] = useState([])
  const [libraries, setLibraries] = useState({
    public: true,
    private: false,
    // group: false,
  })

  const setLibrary = library => {
    const librariesCopy = {}
    Object.keys(libraries).forEach(key => {
      librariesCopy[key] = false
    })

    setLibraries({ ...librariesCopy, [library]: true })
  }

  const changeLibraryView = () => {
    if (category === 'All') {
      setAnnotationsList(activeLibrary)
    } else {
      setAnnotationsList(activeLibrary.filter(annotation => annotation.category === category))
    }
  }

  const handleLibraryChange = library => {
    // dispatch(updateLibrarySelect(library))
    if (library === 'private') {
      setActiveLibrary(privateAnnotations)
    } else {
      setActiveLibrary(publicAnnotations)
    }
    setLibrary(library)
    /*
    setSorter(savedSortCriterion[library].sort_by)
    setSortDirection(savedSortCriterion[library].direction)
    if (library === 'group' && sharedToGroupSinceLastFetch) {
      dispatch(
        getAllStories(learningLanguage, {
          sort_by: 'date',
          order: -1,
        })
      )
    }
    */
  }

  useEffect(() => {
    dispatch(getAllAnnotations())
  }, [])

  useEffect(() => {
    if (libraries.private) {
      setActiveLibrary(privateAnnotations)
    } else {
      setActiveLibrary(publicAnnotations)
    }
    changeLibraryView()
  }, [libraries])

  useEffect(() => {
    if (allAnnotations.length > 0) {
      const allPublic = allAnnotations.filter(annotation => annotation.public)
      setPrivateAnnotations(allAnnotations.filter(annotation => !annotation.public))
      setPublicAnnotations(allPublic)
      setActiveLibrary(allPublic)
      setAnnotationsList(allPublic)
    }
  }, [allAnnotations])

  console.log('annotations ', allAnnotations)

  function rowRenderer({ key, index, style }) {
    return (
      <div
        key={key}
        style={{ ...style, paddingRight: '0.5em', paddingLeft: '0.5em', marginBottom: '.5em' }}
      >
        <AnnotationListItem
          annotationItem={annotationsList[index]}
          annotationsList={annotationsList}
          setAnnotationsList={setAnnotationsList}
        />
      </div>
    )
  }

  return (
    <div className="cont-tall pt-lg cont flex-col auto gap-row-sm ">
      <div style={{ marginBottom: '1rem' }}>
        <LibraryTabs
          values={libraries}
          additionalClass="wrap-and-grow align-center pt-sm"
          onClick={handleLibraryChange}
          reverse
        />
      </div>
      <AnnotationsLibrarySearch
        category={category}
        setCategory={setCategory}
        setAnnotationsList={setAnnotationsList}
        activeLibrary={activeLibrary}
      />
      <Card.Group itemsPerRow={1} doubling data-cy="annotation-items" style={{ marginTop: '.5em' }}>
        <WindowScroller>
          {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <List
              autoHeight
              height={height}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              rowCount={annotationsList.length}
              rowHeight={130}
              rowRenderer={rowRenderer}
              scrollTop={scrollTop}
              width={10000}
            />
          )}
        </WindowScroller>
      </Card.Group>
    </div>
  )
}

export default AnnotationsLibrary
