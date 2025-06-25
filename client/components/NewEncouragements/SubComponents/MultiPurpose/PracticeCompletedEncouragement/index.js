import React from 'react'
import { useDispatch } from 'react-redux'
import { images } from 'Utilities/common'
import { useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'

import { closeLPEncouragement } from 'Utilities/redux/encouragementsReducer'

import './PracticeCompletedStyles.css'

const PracticeCompletedEncouragement = ({ continueAction, practiceType }) => {
  const history = useHistory()
  const dispatch = useDispatch()

  const handleContinueClick = () => {
    dispatch(closeLPEncouragement())
    continueAction()
  }

  const handleHomeClick = () => {
    dispatch(closeLPEncouragement())
    history.push('/home')
  }

  const title = (
    <FormattedMessage
      id={practiceType === 'lesson' ? 'lesson-completed-title' : 'deck-completed-title'}
    />
  )

  const message = (
    <FormattedMessage
      id={practiceType === 'lesson' ? 'lesson-completed-message' : 'deck-completed-message'}
    />
  )

  return (
    <div className="practice-completed-container">
      <img src={images.encTrophy} alt="encouraging trophy" />
      <h2>{title}</h2>
      <h5>{message}</h5>
      <div className="practice-completed-button-group">
        <Button variant="primary" type="button" onClick={handleContinueClick}>
          <FormattedMessage id="Continue" />
        </Button>
        <Button variant="secondary" type="button" onClick={handleHomeClick}>
          <FormattedMessage id="Home" />
        </Button>
      </div>
    </div>
  )
}

export default PracticeCompletedEncouragement
