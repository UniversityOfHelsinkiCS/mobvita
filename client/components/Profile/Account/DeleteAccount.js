import React, { useState, useEffect } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import { Modal, Button, Form } from 'semantic-ui-react'
import { logout, deleteUser } from 'Utilities/redux/userReducer'
import { useDispatch, useSelector } from 'react-redux'

const DeleteAccount = () => {
  const intl = useIntl()
  const [open, setOpen] = useState(false)
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const dispatch = useDispatch()
  const { deleteSuccessful } = useSelector(({ user }) => user)

  useEffect(() => {
    if (deleteSuccessful) {
      dispatch(logout())
    }
  }, [deleteSuccessful])

  const handleAccept = () => {
    dispatch(deleteUser(passwordConfirmation))
  }

  const handleReject = () => {
    setOpen(false)
  }

  return (
    <div>
      <h2 className="header-2 pb-sm">{intl.formatMessage({ id: 'delete-account' })}</h2>
      <Button negative onClick={() => setOpen(true)}>
        <FormattedMessage id="delete-account" />
      </Button>
      <Modal
        dimmer="inverted"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      >
        <Modal.Header>
          <FormattedMessage id="delete-account-confirmation" />
        </Modal.Header>
        <Modal.Content>
          <div className="mb-nm">
            <FormattedMessage id="delete-account-information" />
          </div>
          <Form>
            <Form.Field>
              <Form.Input
                value={passwordConfirmation}
                type="password"
                onChange={e => setPasswordConfirmation(e.target.value)}
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => handleAccept()} data-cy="confirm-warning-dialog">
            <FormattedMessage id="Confirm" />
          </Button>
          <Button onClick={() => handleReject()}>
            <FormattedMessage id="Cancel" />
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  )
}

export default DeleteAccount
