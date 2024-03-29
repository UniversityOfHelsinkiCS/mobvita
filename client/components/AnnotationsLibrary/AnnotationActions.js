import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const AnnotationActions = ({ storyId, percentCov, setOpenWarning }) => {
  return (
    <div className="story-actions">
      {percentCov === 0 ? (
        <Link
          to={`/stories/${storyId}/preview`}
          style={{ marginRight: '.5em', marginBottom: '.25em' }}
        >
          <Button variant="primary" data-cy="annotation-item-button">
            <FormattedMessage id="preview" />
          </Button>
        </Link>
      ) : (
        <Link
          to={`/stories/${storyId}/review`}
          style={{ marginRight: '.5em', marginBottom: '.25em' }}
        >
          <Button variant="primary" disabled={percentCov === 0}>
            <FormattedMessage id="review" />
          </Button>
        </Link>
      )}
      {/* 
      <Button
        variant="secondary"
        onClick={() => setShowAnnotationForm(!showAnnotationForm)}
        style={{ marginRight: '.5em', marginBottom: '.25em' }}
      >
        <FormattedMessage id="edit" />
      </Button>
      <Button
        onClick={() => setOpenWarning(true)}
        variant="outline-danger"
        style={{ marginRight: '.5em', marginBottom: '.25em' }}
      >
        <FormattedMessage id="delete-annotation" />
      </Button>
      */}
    </div>
  )
}

export default AnnotationActions
