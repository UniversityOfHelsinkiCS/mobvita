import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Modal, Button, Icon } from 'semantic-ui-react'
import { deleteFlashcard } from 'Utilities/redux/flashcardReducer'

const FlashcardDelete = ({ id }) => {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  const handleRemove = async () => {
    await dispatch(deleteFlashcard(id))
  }

  return (
    <Modal
      dimmer="inverted"
      open={open}
      trigger={
        <button className="flashcard-blended-input" type="button" onClick={() => setOpen(true)}>
          <Icon name="delete" color="grey" />
        </button>
      }
    >
      <Modal.Header>
        <FormattedMessage id="Warning" />
      </Modal.Header>
      <Modal.Content>
        <FormattedMessage id="this-will-permanently-remove-this-flashcard-are-you-sure-you-want-to-proceed" />
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => handleRemove()}>
          <FormattedMessage id="Remove" />
        </Button>
        <Button onClick={() => setOpen(false)}>
          <FormattedMessage id="Cancel" />
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default FlashcardDelete
