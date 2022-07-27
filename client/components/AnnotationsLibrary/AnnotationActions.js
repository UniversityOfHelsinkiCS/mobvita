import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const AnnotationActions = ({ annotation, setOpenWarning }) => {

  return (
    <div className="story-actions">
      <Link
        to={`/stories/${annotation.story.story_id}/preview`}
        style={{ marginRight: '.5em', marginBottom: '.25em' }}
      >
        <Button variant="primary">
          <FormattedMessage id="preview" />
        </Button>
      </Link>
      <Link
        to={`/stories/${annotation.story.story_id}/review`}
        style={{ marginRight: '.5em', marginBottom: '.25em' }}
      >
        <Button variant="primary" disabled={annotation.story.percent_cov === 0}>
          <FormattedMessage id="review" />
        </Button>
      </Link>
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
