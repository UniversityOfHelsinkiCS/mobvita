import React from 'react'
import { images } from 'Utilities/common'
import { useNavigate } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import AppButton from 'Components/AppButton'

import './Encouragements.css'

/**
 * `layout` picks the surface it is drawn for:
 *   'dialog' (default) - the centred modal: large art, fixed height, side-by-side buttons
 *   'chat'             - inside an assistant bubble: no frame of its own, narrow-column sizing
 */
const PracticeCompletedEncouragement = ({
  continueAction,
  practiceType,
  setMessageIndex,
  setShow,
  layout = 'dialog',
}) => {
  const navigate = useNavigate()

  const handlePrimaryButtonClick = () => {
    continueAction()
    setShow(false)
  }

  const handleHomeClick = () => {
    setShow(false)
    navigate('/home')
  }

  const inChat = layout === 'chat'

  const title = <FormattedMessage id={`${practiceType}-completed-title`} />
  const message = <FormattedMessage id={`${practiceType}-completed-message`} />

  const actions = (
    <>
      <AppButton
        variant="primary"
        size={inChat ? 'sm' : undefined}
        type="button"
        onClick={handlePrimaryButtonClick}
      >
        <FormattedMessage id={practiceType === 'story' ? 'restart-story' : 'Continue'} />
      </AppButton>
      <AppButton
        variant="secondary"
        size={inChat ? 'sm' : undefined}
        type="button"
        onClick={practiceType === 'story' ? () => setMessageIndex(1) : handleHomeClick}
      >
        <FormattedMessage id={practiceType === 'story' ? 'Continue' : 'Home'} />
      </AppButton>
    </>
  )

  // In the assistant the bubble is the surface, so this renders bare.
  if (inChat) {
    return (
      <div className="encouragement-chat">
        <div className="encouragement-chat-head">
          <img src={images.encTrophy} alt="" />
          <strong>{title}</strong>
        </div>
        <p className="encouragement-chat-message">{message}</p>
        <div className="encouragement-chat-actions">{actions}</div>
      </div>
    )
  }

  return (
    <div className="encouragement-container">
      <div className="encouragement-message-container">
        <img src={images.encTrophy} alt="encouraging trophy" />
        <h2>{title}</h2>
        <h5>{message}</h5>
      </div>
      <div className="encouragement-button-group">{actions}</div>
    </div>
  )
}

export default PracticeCompletedEncouragement
