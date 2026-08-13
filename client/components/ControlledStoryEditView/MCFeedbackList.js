import React from 'react'
import { Divider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const MCFeedbackList = ({ feedbackList, removeFeedback }) => {
  return (
    <div style={{ marginLeft: '.5em', marginTop: '.5rem' }}>
      {feedbackList.map((item, index) => (
        <div className="flex space-between interactable">
          <div>
            <span style={{ marginRight: '.5rem' }}>{index + 1}.</span>
            <span>{item}</span>
          </div>
          <CloseIcon
            style={{
              cursor: 'pointer',
              marginBottom: '.25em',
              color: 'red',
            }}
            fontSize="large"
            data-cy={`mc-feedback-remove-${index}`}
            onClick={() => removeFeedback(index)}
          />
        </div>
      ))}
      <Divider sx={{ my: '1em' }} />
    </div>
  )
}

export default MCFeedbackList
