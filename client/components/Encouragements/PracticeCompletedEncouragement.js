import React from 'react'
import { images } from 'Utilities/common'
import { useNavigate } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'

import './Encouragements.css'

const PracticeCompletedEncouragement = ({
  continueAction,
  practiceType,
  setMessageIndex,
  setShow }) => {
  const navigate = useNavigate()

  const handlePrimaryButtonClick = () => {
    continueAction()
    setShow(false)
  }

  const handleHomeClick = () => {
    setShow(false)
    navigate('/home')
  }

  return (
    <div className="encouragement-container">
      <div className="encouragement-message-container">
        <img src={images.encTrophy} alt="encouraging trophy" />
        <h2>
          <FormattedMessage id={`${practiceType}-completed-title`} />
        </h2>
        <h5>
          <FormattedMessage id={`${practiceType}-completed-message`} />
        </h5>
      </div>
      <div className="encouragement-button-group">
        <Button variant="primary" type="button" onClick={handlePrimaryButtonClick}>
          <FormattedMessage id={practiceType === 'story' ? 'restart-story' : 'Continue'} />
        </Button>
        <Button
          variant="secondary"
          type="button"
          onClick={practiceType === 'story' ? () => setMessageIndex(1) : handleHomeClick}
        >
          <FormattedMessage id={practiceType === 'story' ? 'Continue' : 'Home'} />
        </Button>
      </div>
    </div>
  )
}

export default PracticeCompletedEncouragement
