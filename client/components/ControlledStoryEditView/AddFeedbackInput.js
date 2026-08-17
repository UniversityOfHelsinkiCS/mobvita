import React from 'react'
import AppButton from 'Components/AppButton'
import { Divider } from '@mui/material'
import { FormattedMessage } from 'react-intl'

const AddFeedbackInput = ({ addFeedback, customFeedback, setCustomFeedback }) => {
  return (
    <div style={{ marginLeft: '0.5em' }}>
      <Divider sx={{ my: '1em' }} />
      <FormattedMessage id="custom-feedback-header" />
      <div className="flex">
        <input
          className="multi-choice-long-input interactable"
          style={{ marginLeft: '.5rem' }}
          type="text"
          value={customFeedback}
          onChange={({ target }) => setCustomFeedback(target.value)}
          data-cy="add-feedback-input"
        />
        <AppButton variant="primary" onClick={addFeedback} data-cy="add-feedback-button">
          <FormattedMessage id="add-lesson-practice-btn" />
        </AppButton>
      </div>
    </div>
  )
}

export default AddFeedbackInput