import React from 'react'
import { Link } from 'react-router-dom'
import AppButton from 'Components/AppButton'
import { FormattedMessage } from 'react-intl'

const AnnotationActions = ({ storyId, percentCov, setOpenWarning }) => {
  return (
    <div className="story-actions">
      {percentCov === 0 ? (
        <Link
          to={`/stories/${storyId}/preview`}
          style={{ marginRight: '.5em', marginBottom: '.25em' }}
        >
          <AppButton variant="primary" data-cy="annotation-item-button">
            <FormattedMessage id="preview" />
          </AppButton>
        </Link>
      ) : (
        <Link
          to={`/stories/${storyId}/review`}
          style={{ marginRight: '.5em', marginBottom: '.25em' }}
        >
          <AppButton variant="primary" disabled={percentCov === 0}>
            <FormattedMessage id="review" />
          </AppButton>
        </Link>
      )}
      {/*
      <AppButton
        variant="secondary"
        onClick={() => setShowAnnotationForm(!showAnnotationForm)}
        style={{ marginRight: '.5em', marginBottom: '.25em' }}
      >
        <FormattedMessage id="edit" />
      </AppButton>
      <AppButton
        onClick={() => setOpenWarning(true)}
        variant="outline-danger"
        style={{ marginRight: '.5em', marginBottom: '.25em' }}
      >
        <FormattedMessage id="delete-annotation" />
      </AppButton>
      */}
    </div>
  )
}

export default AnnotationActions
