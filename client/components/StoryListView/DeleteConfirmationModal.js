import React, { useState } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { removeStory } from 'Utilities/redux/storiesReducer'

const DeleteConfirmationModal = ({ open, setOpen, storyId }) => {
  const dispatch = useDispatch()

  const handleAccept = () => {
    setOpen(false)
    dispatch(removeStory(storyId))
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
        <FormattedMessage id="this-will-permanently-remove-this-story-from-your-collection-are-you-sure-you-want-to-proceed" />
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => handleAccept()} data-cy="confirm-story-delete">
          <FormattedMessage id="Remove" />
        </Button>
        <Button onClick={() => handleReject()}>
          <FormattedMessage id="Cancel" />
        </Button>
      </Modal.Actions>
    </Modal>

  )
}

export default DeleteConfirmationModal
