import React from 'react'
import { Modal, Button } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'

const ConfirmationWarning = ({ open, setOpen, action, children }) => {
  const handleAccept = () => {
    setOpen(false)
    action()
  }

  const handleReject = () => {
    setOpen(false)
  }

  return (
    <Modal
      dimmer="inverted"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
    >
      <Modal.Header>
        <FormattedMessage id="Warning" />
      </Modal.Header>
      <Modal.Content>
        {children}
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => handleAccept()} data-cy="confirm-story-delete">
          <FormattedMessage id="Confirm" />
        </Button>
        <Button onClick={() => handleReject()}>
          <FormattedMessage id="Cancel" />
        </Button>
      </Modal.Actions>
    </Modal>

  )
}

export default ConfirmationWarning
