import React, { useState } from 'react'
import { Card, Button as SemanticButton, Popup } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { removeStoryAnnotation } from 'Utilities/redux/storiesReducer'
import { useDispatch } from 'react-redux'
import { getCategoryColor } from 'Utilities/common'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import useWindowDimensions from 'Utilities/windowDimensions'
import AnnotationActions from './AnnotationActions'

const AnnotationListItem = ({ annotationItem, annotationsList, setAnnotationsList }) => {
  // console.log('annotation ', annotation)
  const dispatch = useDispatch()
  const [openWarning, setOpenWarning] = useState(false)
  const bigScreen = useWindowDimensions().width >= 700

  const maxLength = bigScreen ? 95 : 30

  const {
    annotated_text,
    annotation,
    uid,
    language,
    precent_cov,
    token_id,
    end_token_id,
    category,
    story_id,
    story_title,
  } = annotationItem

  const handleDelete = async () => {
    const mode = 'preview'
    await dispatch(removeStoryAnnotation(story_id, token_id, end_token_id, mode))
    setAnnotationsList(annotationsList.filter(annotation => annotation !== annotationItem))
  }

  const truncateStoryTitle = title => {
    return `${title.slice(0, maxLength)}...`
  }

  return (
    <>
      <Card fluid key={uid}>
        <Card.Content extra className="story-card-title-cont">
          <Popup
            content={<div style={{ margin: '0.25em' }}>{annotation}</div>}
            trigger={
              <div className="flex space-between">
                <h5 className="annotation-item-title">{annotated_text}</h5>
                <div>
                  {category && (
                    <div className={getCategoryColor(category)} style={{ marginRight: '0.5em' }}>
                      <FormattedMessage id={`notes-${category}`} />
                    </div>
                  )}
                </div>
              </div>
            }
          />
        </Card.Content>
        <Card.Content extra className="story-card-actions-cont">
          <div className="flex" style={{ alignItems: 'center' }}>
            <AnnotationActions
              storyId={story_id}
              percentCov={precent_cov}
              setOpenWarning={setOpenWarning}
            />
            <h5 className="annotaion-item-story" style={{ marginLeft: '.5em' }}>
              {story_title.length > maxLength ? truncateStoryTitle(story_title) : story_title}
            </h5>
          </div>
        </Card.Content>
        <ConfirmationWarning open={openWarning} setOpen={setOpenWarning} action={handleDelete}>
          <FormattedMessage id="annotation-remove-confirm" />
        </ConfirmationWarning>
      </Card>
    </>
  )
}

export default AnnotationListItem
