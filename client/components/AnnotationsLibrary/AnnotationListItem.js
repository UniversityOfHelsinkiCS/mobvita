import React, { useState } from 'react'
import { Card, Button as SemanticButton, Icon, Popup } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { addEditStoryAnnotation, removeStoryAnnotation } from 'Utilities/redux/storiesReducer'
import { useDispatch } from 'react-redux'
import { getCategoryColor } from 'Utilities/common'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import Tooltip from 'Components/PracticeView/Tooltip'
import AnnotationActions from './AnnotationActions'

const AnnotationListItem = ({ annotationItem, annotationsList, setAnnotationsList }) => {
  // console.log('annotation ', annotation)
  const dispatch = useDispatch()
  const [openWarning, setOpenWarning] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const {
    annotated_text,
    annotation,
    uid,
    language,
    precent_cov,
    token_id,
    end_token_id,
    categories,
    story_id,
    story_title,
  } = annotationItem

  const handleDelete = async () => {
    const mode = 'preview'
    await dispatch(removeStoryAnnotation(story_id, token_id, end_token_id, mode))
    setAnnotationsList(annotationsList.filter(annotation => annotation !== annotationItem))
  }

  return (
    <Card fluid key={uid}>
      <Card.Content extra className="story-card-title-cont">
        <Popup
          content={<div style={{ margin: '0.25em' }}>{annotation}</div>}
          trigger={<h2 style={{ color: '#000000', cursor: 'pointer' }}>{annotated_text}</h2>}
        />
        <div className="flex space-between">
          <div style={{ fontWeight: '16px' }}>{story_title}</div>
          <div>
            {categories?.map(category => (
              <span className={getCategoryColor(category)} style={{ marginRight: '0.5em' }}>
                {category}
              </span>
            ))}
          </div>
        </div>
      </Card.Content>
      <Card.Content extra className="story-card-actions-cont">
        <AnnotationActions
          storyId={story_id}
          percentCov={precent_cov}
          setOpenWarning={setOpenWarning}
        />
      </Card.Content>
      <ConfirmationWarning open={openWarning} setOpen={setOpenWarning} action={handleDelete}>
        <FormattedMessage id="annotation-remove-confirm" />
      </ConfirmationWarning>
    </Card>
  )
}

export default AnnotationListItem
