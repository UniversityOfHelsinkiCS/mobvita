import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'semantic-ui-react'

const LessonPracticeList = ({ lessonsPractices, removePractice }) => {

  return (
    <div style={{ marginBottom: '.5rem' }}>
      {lessonsPractices.length < 1 && <FormattedMessage id="no-practices-yet" />}
      {lessonsPractices.map((practice, index) => (
        <div className="flex space-between" style={{ marginTop: '.5rem' }}>
          <div className="flex">
            <b style={{ marginRight: '1rem' }}>{index + 1}.</b>
            <FormattedMessage id={practice} />
          </div>
          <Icon
            className="interactable"
            style={{
              cursor: 'pointer',
              marginBottom: '.25em',
              color: 'red',
            }}
            size="large"
            name="close"
            onClick={() => removePractice(index)}
          />
        </div>
      ))}
    </div>
  )
}
export default LessonPracticeList