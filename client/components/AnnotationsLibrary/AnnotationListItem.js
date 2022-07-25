import React from 'react'
import { Card, Dropdown, Button as SemanticButton, Icon, Popup } from 'semantic-ui-react'
import AnnotationActions from './AnnotationActions'

const AnnotationListItem = ({ annotation }) => {
  console.log('annotation ', annotation)
  const { name, _id, categories, story } = annotation

  return (
    <div>
      <Card fluid key={_id}>
        <Card.Content extra className="story-card-title-cont">
          <h2 style={{ color: '#000000' }}>{name}</h2>
          <div style={{ fontWeight: '16px' }}>{story.title}</div>
        </Card.Content>
        <Card.Content extra className="story-card-actions-cont">
          <AnnotationActions annotation={annotation} />
        </Card.Content>
      </Card>
    </div>
  )
}

export default AnnotationListItem
