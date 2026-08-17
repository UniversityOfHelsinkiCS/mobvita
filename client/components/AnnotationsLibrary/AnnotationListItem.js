import React, { useState } from 'react'
import { Card, CardContent } from '@mui/material'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { removeStoryAnnotation } from 'Utilities/redux/storiesReducer'
import { useDispatch } from 'react-redux'
import { getCategoryColor } from 'Utilities/common'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import CustomTooltip from 'Components/CustomTooltip'
import useWindowDimensions from 'Utilities/windowDimensions'
import AnnotationActions from './AnnotationActions'

const AnnotationListItem = ({ annotationItem, annotationsList, setAnnotationsList }) => {
  // console.log('annotation ', annotation)
  const dispatch = useDispatch()
  const [openWarning, setOpenWarning] = useState(false)
  const bigScreen = useWindowDimensions().width >= 700

  const maxLength = bigScreen ? 90 : 30

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
    name,
  } = annotationItem
  const storyMode = precent_cov === 0 ? 'preview' : 'review'

  const handleDelete = async () => {
    const mode = 'preview'
    await dispatch(removeStoryAnnotation(story_id, token_id, end_token_id, mode))
    setAnnotationsList(annotationsList.filter(annotation => annotation !== annotationItem))
  }

  const truncateStoryTitle = title => {
    return <span>{`${title.slice(0, maxLength)}...`}</span>
  }

  return (
    <>
      <Card key={uid} className="annotation-list-item" data-cy="annotation-list-item">
        <CardContent className="story-card-title-cont">
          <CustomTooltip permanent title={<div style={{ margin: '0.25em' }}>{annotation}</div>}>
            <div className="flex space-between" style={{ alignItems: 'center' }}>
              <Link to={`/stories/${story_id}/${storyMode}`} data-cy="annotation-item-name-link">
                <h5 className="story-item-title">{name}</h5>
              </Link>
              {category && category !== 'None' && (
                <div className={getCategoryColor(category)} style={{ marginRight: '.5em', marginBottom: '.5em' }}>
                  <FormattedMessage id={`notes-${category}`} />
                </div>
              )}
            </div>
          </CustomTooltip>
        </CardContent>
        <CardContent className="story-card-actions-cont">
          <div className="flex" style={{ alignItems: 'center' }}>
            {/*
            <AnnotationActions
              storyId={story_id}
              percentCov={precent_cov}
              setOpenWarning={setOpenWarning}
            />
            */}
            <Link to={`/stories/${story_id}/${storyMode}`}>
              <h5 className="annotation-item-text" style={{ color: 'gray', marginLeft: '.5em' }} data-cy="annotation-item-link">
                {story_title.length > maxLength ? (
                  <CustomTooltip
                    permanent
                    title={<div style={{ margin: '0.25em' }}>{story_title}</div>}
                  >
                    {truncateStoryTitle(story_title)}
                  </CustomTooltip>
                ) : (
                  story_title
                )}
              </h5>
            </Link>
          </div>
        </CardContent>
        <ConfirmationWarning open={openWarning} setOpen={setOpenWarning} action={handleDelete}>
          <FormattedMessage id="annotation-remove-confirm" />
        </ConfirmationWarning>
      </Card>
    </>
  )
}

export default AnnotationListItem
