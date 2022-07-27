import React, { useState, useEffect } from 'react'
import { Placeholder, Card, Select, Icon, Dropdown } from 'semantic-ui-react'
import { getAllAnnotations } from 'Utilities/redux/annotationsReducer'
import { useDispatch } from 'react-redux'
import { List, WindowScroller } from 'react-virtualized'
import { annotationsMock } from 'Utilities/common'
import AnnotationListItem from './AnnotationListItem'

const AnnotationsLibrary = () => {
  const dispatch = useDispatch()
  const [category, setCategory] = useState('All')
  const [annotationsList, setAnnotationsList] = useState(annotationsMock || [])

  const dropDownMenuText = category ? `${category}` : 'All'
{/* 
  useEffect(() => {
    dispatch(getAllAnnotations())
  }, [])
*/}
  useEffect(() => {
    if (category === 'All') {
      setAnnotationsList(annotationsMock)
    } else {
      setAnnotationsList(
        annotationsMock.filter(annotation => annotation.categories.includes(category))
      )
    }
  }, [category])

  console.log('annotation list ', annotationsList, ' category ', category)

  const categoryOptions = [
    {
      key: '0',
      text: 'All',
      value: 'All',
    },
    {
      key: '1',
      text: 'Grammar',
      value: 'Grammar',
    },
    {
      key: '2',
      text: 'Phrases',
      value: 'Phrases',
    },
    {
      key: '3',
      text: 'Vocabulary',
      value: 'Vocabulary',
    },
  ]

  function rowRenderer({ key, index, style }) {
    return (
      <div
        key={key}
        style={{ ...style, paddingRight: '0.5em', paddingLeft: '0.5em', marginBottom: '.5em' }}
      >
        <AnnotationListItem annotation={annotationsList[index]} />
      </div>
    )
  }

  return (
    <div className="cont-tall pt-lg cont flex-col auto gap-row-sm ">
      <Dropdown
        text={dropDownMenuText}
        selection
        fluid
        options={categoryOptions}
        onChange={(_, { value }) => setCategory(value)}
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
