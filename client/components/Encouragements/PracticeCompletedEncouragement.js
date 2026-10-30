import React from 'react'
import { images } from 'Utilities/common'
import { useNavigate } from 'react-router'
import { FormattedMessage } from 'react-intl'
import AppButton from 'Components/AppButton'

import './Encouragements.css'

// End-of-practice message. `layout`: 'dialog' (default) is the centred modal with large art and
// side-by-side buttons; 'chat' sits inside an assistant bubble with no frame of its own.
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

  // In the assistant the recommendation bubble is the surface: it draws the icon column and the
  // dismiss X, so this renders only the title, the message and the one action that continues.
  if (inChat) {
    return (
      <>
        <strong className="encouragement-chat-title">{title}</strong>
        <p className="encouragement-chat-message">{message}</p>
        <AppButton
          variant="contrast"
          size="sm"
          type="button"
          onClick={handlePrimaryButtonClick}
          style={{ marginTop: 10 }}
        >
          <FormattedMessage id={practiceType === 'story' ? 'restart-story' : 'Continue'} />
        </AppButton>
      </>
    )
  }

  return (
    <div className="encouragement-container">
      <div className="encouragement-message-container">
        <img src={images.trophy} alt="encouraging trophy" />
        <h2>{title}</h2>
        <h5>{message}</h5>
      </div>
      <div className="encouragement-button-group">{actions}</div>
    </div>
  )
}

export default PracticeCompletedEncouragement
