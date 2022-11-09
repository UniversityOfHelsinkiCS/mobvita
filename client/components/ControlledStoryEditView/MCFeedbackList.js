import React from 'react'
import { Divider, Icon } from 'semantic-ui-react'

const MCFeedbackList = ({ feedbackList, removeFeedback }) => {
  return (
    <div style={{ marginLeft: '.5em', marginTop: '.5rem' }}>
      {feedbackList.map((item, index) => (
        <div className="flex space-between interactable">
          <div>
            <span style={{ marginRight: '.5rem' }}>{index + 1}.</span>
            <span>{item}</span>
          </div>
          <Icon
            style={{
              cursor: 'pointer',
              marginBottom: '.25em',
              color: 'red',
            }}
            size="large"
            name="close"
            onClick={() => removeFeedback(index)}
          />
        </div>
      ))}
      <Divider />
    </div>
  )
}

export default MCFeedbackList
