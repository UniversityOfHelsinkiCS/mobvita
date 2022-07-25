import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const AnnotationActions = ({ annotation }) => {
  const deleteAnnotation = () => {
    console.log('delete')
  }

  return (
    <div className="flex">
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
        <Button variant="primary">
          <FormattedMessage id="review" />
        </Button>
      </Link>
      <Button
        onClick={deleteAnnotation}
        variant="outline-danger"
        style={{ marginRight: '.5em', marginBottom: '.25em' }}
      >
        <FormattedMessage id="delete-annotation" />
      </Button>
    </div>
  )
}

export default AnnotationActions
