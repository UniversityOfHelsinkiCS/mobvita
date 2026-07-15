import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import AppButton from 'Components/AppButton'

import { images } from 'Utilities/common'

import './LessonCompletedStyles.css'

const LessonCompleted = ({ startOvertLessonSnippets, setShowLessonCompleted }) => {
  const navigate = useNavigate()

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
        <AppButton variant="secondary" type="button" onClick={() => navigate('/lessons/library')}>
          <FormattedMessage id="lesson-story-topic" />
        </AppButton>
        <AppButton
          variant="primary"
          style={{ width: '100px' }}
          type="button"
          onClick={handleContinueClick}
        >
          <FormattedMessage id="Continue" />
        </AppButton>
      </div>
    </div>
  )
}

export default LessonCompleted
