import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'semantic-ui-react'

const LessonPracticeList = ({ lessonsPractices, removePractice }) => {

  return (
    <div>
      {lessonsPractices.map((practice, index) => (
        <div className="flex space-between" style={{ marginTop: '.5rem' }}>
          <FormattedMessage id={practice} />
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