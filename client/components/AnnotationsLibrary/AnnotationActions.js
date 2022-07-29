import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const AnnotationActions = ({ storyId, percentCov, setOpenWarning }) => {
  const editAnnotation = () => {}

  return (
    <div className="story-actions">
      <Link
        to={`/stories/${storyId}/preview`}
        style={{ marginRight: '.5em', marginBottom: '.25em' }}
      >
        <Button variant="primary">
          <FormattedMessage id="preview" />
        </Button>
      </Link>
      <Link
        to={`/stories/${storyId}/review`}
        style={{ marginRight: '.5em', marginBottom: '.25em' }}
      >
        <Button variant="primary" disabled={percentCov === 0}>
          <FormattedMessage id="review" />
        </Button>
      </Link>
      <Button
        variant="secondary"
        onClick={editAnnotation}
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
    </div>
  )
}

export default AnnotationActions
