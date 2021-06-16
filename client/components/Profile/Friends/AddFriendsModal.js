import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Button, FormControl, Form } from 'react-bootstrap'
import { Modal } from 'semantic-ui-react'
import { addFriends } from 'Utilities/redux/userReducer'
import { formatEmailList } from 'Utilities/common'

const AddFriendsModal = ({ showModal, setShowModal }) => {
  const dispatch = useDispatch()
  const [friend, setFriend] = useState('')

  const add = event => {
    event.preventDefault()
    dispatch(addFriends(formatEmailList(friend)))
    setFriend('')
    setShowModal(false)
  }

  return (
    <Modal
      dimmer="inverted"
      closeIcon={{ style: { top: '1.0535rem', right: '1rem' }, color: 'black', name: 'close' }}
      open={showModal}
      onClose={() => setShowModal(false)}
      onOpen={() => setShowModal(true)}
    >
      <Modal.Header className="bold" as="h2">
        <FormattedMessage id="add-a-friend" />
      </Modal.Header>
      <Modal.Content>
        <Form className="group-form" onSubmit={add}>
          <span className="sm-label">
            <FormattedMessage id="enter-email-address" />{' '}
            <FormattedMessage id="multiple-emails-separated-by-space" />
          </span>
          <FormControl as="textarea" value={friend} onChange={e => setFriend(e.target.value)} />
          <Button variant="primary" type="submit">
            <FormattedMessage id="Confirm" />
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default AddFriendsModal
