import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button, FormControl, Form } from 'react-bootstrap'
import { Modal } from 'semantic-ui-react'
import { followUser } from 'Utilities/redux/userReducer'
import { formatEmailList } from 'Utilities/common'

const FollowUserModal = ({ showModal, setShowModal }) => {
  const dispatch = useDispatch()
  const ownEmail = useSelector(({ user }) => user.data.user.email)
  const [usersToFollow, setUsersToFollow] = useState('')
  const [showSelfAddWarning, setShowSelfAddWarning] = useState(false)

  const follow = event => {
    event.preventDefault()
    if (formatEmailList(usersToFollow).includes(ownEmail)) {
      setShowSelfAddWarning(true)
    } else {
      setShowSelfAddWarning(false)
      dispatch(followUser(formatEmailList(usersToFollow)))
      setUsersToFollow('')
      setShowModal(false)
    }
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
        <FormattedMessage id="follow-a-user" />
      </Modal.Header>
      <Modal.Content>
        <Form className="group-form" onSubmit={follow}>
          <span className="sm-label">
            <FormattedMessage id="enter-email-address" />{' '}
            <FormattedMessage id="multiple-emails-separated-by-space" />
          </span>
          <FormControl
            as="textarea"
            value={usersToFollow}
            onChange={e => setUsersToFollow(e.target.value)}
          />
          {showSelfAddWarning && (
            <div style={{ color: 'red', marginBottom: '1em' }}>
              <FormattedMessage id="you-cannot-add-yourself" />
            </div>
          )}
          <Button variant="primary" type="submit">
            <FormattedMessage id="Confirm" />
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default FollowUserModal
