import React from 'react'
import { Button } from 'react-bootstrap'
import { Divider } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'

const AddFeedbackInput = ({ addFeedback, customFeedback, setCustomFeedback }) => {
  return (
    <div style={{ marginLeft: '0.5em' }}>
      <Divider />
      <FormattedMessage id="custom-feedback-header" />
      <div className="flex">
        <input
          className="multi-choice-long-input interactable"
          style={{ marginLeft: '.5rem' }}
          type="text"
          value={customFeedback}
          onChange={({ target }) => setCustomFeedback(target.value)}
        />
        <Button variant="primary" onClick={addFeedback}>
          <FormattedMessage id="add-lesson-practice-btn" />
        </Button>
      </div>
    </div>
  )
}

export default AddFeedbackInput