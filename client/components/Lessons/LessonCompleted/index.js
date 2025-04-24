import React from 'react'
import { useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'

import { images } from 'Utilities/common'

import './LessonCompletedStyles.css'

const LessonCompleted = ({ startOvertLessonSnippets, setShowLessonCompleted }) => {
  const history = useHistory()

  const handleContinueClick = () => {
    startOvertLessonSnippets()
    setShowLessonCompleted(false)
  }

  return (
    <div className="lesson-completed-container">
      <img src={images.encTrophy} alt="encouraging trophy" />
      <h2>Lesson completed!</h2>
      <h5>Do you want to continue practicing with another set of 10 snippets?</h5>
      <div className="lesson-completed-button-group">
        <Button variant="secondary" type="button" onClick={() => history.push('/lessons/library')}>
          <FormattedMessage id="lesson-story-topic" />
        </Button>
        <Button
          variant="primary"
          style={{ width: '100px' }}
          type="button"
          onClick={handleContinueClick}
        >
          <FormattedMessage id="Continue" />
        </Button>
      </div>
    </div>
  )
}

export default LessonCompleted
