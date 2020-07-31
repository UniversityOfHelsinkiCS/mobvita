import React, { useState } from 'react'
import { Modal, Button } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { deleteGroup } from 'Utilities/redux/groupsReducer'


export default function DeleteConfirmationModal({ trigger, groupId }) {
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  const handleAccept = () => {
    setOpen(false)
    dispatch(deleteGroup(groupId))
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
      trigger={trigger}
    >
      <Modal.Header>
        <FormattedMessage id="Warning" />
      </Modal.Header>
      <Modal.Content>
        <FormattedMessage id="this-will-remove-the-group-are-you-sure-you-want-to-proceed" />
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => handleAccept()} data-cy="confirm-group-delete">
          <FormattedMessage id="Remove" />
        </Button>
        <Button onClick={() => handleReject()}>
          <FormattedMessage id="Cancel" />
        </Button>
      </Modal.Actions>
    </Modal>

  )
}
