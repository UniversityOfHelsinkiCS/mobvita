import React, { useState, useEffect } from 'react'
import { Placeholder, Card, Select, Icon, Dropdown } from 'semantic-ui-react'
import { getAllAnnotations } from 'Utilities/redux/annotationsReducer'
import { useDispatch, useSelector } from 'react-redux'
import { List, WindowScroller } from 'react-virtualized'
import { FormattedMessage } from 'react-intl'
import AnnotationListItem from './AnnotationListItem'
import AnnotationsLibrarySearch from './AnnotationsLibrarySearch'

const AnnotationsLibrary = () => {
  const dispatch = useDispatch()
  const [category, setCategory] = useState('All')
  const [annotationsList, setAnnotationsList] = useState([])
  const { allAnnotations } = useSelector(({ annotations }) => annotations)

  useEffect(() => {
    dispatch(getAllAnnotations())
  }, [])

  useEffect(() => {
    if (allAnnotations.length > 0) {
      setAnnotationsList(allAnnotations)
    }
  }, [allAnnotations])

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
      <AnnotationsLibrarySearch
        category={category}
        setCategory={setCategory}
        allAnnotations={allAnnotations}
        annotationsList={annotationsList}
        setAnnotationsList={setAnnotationsList}
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
              rowHeight={160}
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
