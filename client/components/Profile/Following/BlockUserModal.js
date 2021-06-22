import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button, FormControl, Form } from 'react-bootstrap'
import { Modal } from 'semantic-ui-react'
import { blockUser } from 'Utilities/redux/userReducer'
import { formatEmailList } from 'Utilities/common'

const BlockUserModal = ({ showModal, setShowModal }) => {
  const dispatch = useDispatch()
  const ownEmail = useSelector(({ user }) => user.data.user.email)
  const [userToBlock, setuserToBlock] = useState('')
  const [showSelfAddWarning, setShowSelfAddWarning] = useState(false)

  const block = event => {
    event.preventDefault()

    if (formatEmailList(userToBlock).includes(ownEmail)) {
      setShowSelfAddWarning(true)
    } else {
      setShowSelfAddWarning(false)
      dispatch(blockUser(formatEmailList(userToBlock)))
      setuserToBlock('')
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
        <FormattedMessage id="block-a-user" />
      </Modal.Header>
      <Modal.Content>
        <Form className="group-form" onSubmit={block}>
          <span className="sm-label">
            <FormattedMessage id="enter-email-address" />{' '}
            <FormattedMessage id="multiple-emails-separated-by-space" />
          </span>
          <FormControl
            as="textarea"
            value={userToBlock}
            onChange={e => setuserToBlock(e.target.value)}
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

export default BlockUserModal
