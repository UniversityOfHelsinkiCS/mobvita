import React, { useState } from 'react'
import { Card, Button as SemanticButton, Icon, Popup } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import AnnotationActions from './AnnotationActions'

const AnnotationListItem = ({ annotation }) => {
  // console.log('annotation ', annotation)
  const [openWarning, setOpenWarning] = useState(false)
  const { name, _id, categories, story } = annotation

  const handleDelete = () => {
    console.log('delete note')
  }

  return (
    <Card fluid key={_id}>
      <Card.Content extra className="story-card-title-cont">
        <h2 style={{ color: '#000000' }}>{name}</h2>
        <div style={{ fontWeight: '16px' }}>{story.title}</div>
      </Card.Content>
      <Card.Content extra className="story-card-actions-cont">
        <AnnotationActions annotation={annotation} setOpenWarning={setOpenWarning} />
      </Card.Content>
      <ConfirmationWarning open={openWarning} setOpen={setOpenWarning} action={handleDelete}>
        <FormattedMessage id="annotation-remove-confirm" />
      </ConfirmationWarning>
    </Card>
  )
}

export default AnnotationListItem
