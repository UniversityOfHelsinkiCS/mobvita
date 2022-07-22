import React from 'react'
import { Placeholder, Card, Select, Icon, Dropdown } from 'semantic-ui-react'
import { List, WindowScroller } from 'react-virtualized'
import { annotationsMock } from 'Utilities/common'
import AnnotationListItem from './AnnotationListItem'

const AnnotationsLibrary = () => {
  function rowRenderer({ key, index, style }) {
    return (
      <div key={key} style={{ ...style, paddingRight: '0.5em', paddingLeft: '0.5em' }}>
        <AnnotationListItem annotation={annotationsMock[index]} />
      </div>
    )
  }

  return (
    <div className="cont-tall pt-lg cont flex-col auto gap-row-sm ">
      <Card.Group itemsPerRow={1} doubling data-cy="story-items" style={{ marginTop: '.5em' }}>
        <WindowScroller>
          {({ height, isScrolling, onChildScroll, scrollTop }) => (
            <List
              autoHeight
              height={height}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              rowCount={annotationsMock.length}
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
