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

  const title = practiceType === 'lesson' ? 'Lesson completed!' : 'Deck completed!'

  const message =
    practiceType === 'lesson'
      ? 'Do you want to continue practicing with another set of 10 snippets?'
      : 'Do you want to continue practicing with another set of 25 flashcards?'

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
