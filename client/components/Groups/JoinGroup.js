import React, { useState } from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Button, FormControl, Form } from 'react-bootstrap'
import { joinGroup } from 'Utilities/redux/groupsReducer'


const JoinGroup = ({ isOpen, setOpen }) => {
  const [token, setToken] = useState('')


  const dispatch = useDispatch()

  const join = (event) => {
    event.preventDefault()

    dispatch(joinGroup(token))
    setOpen(false)
  }

  return (
    <Modal
      dimmer="inverted"
      closeIcon
      open={isOpen}
      onClose={() => setOpen(false)}
    >
      <Modal.Header><FormattedMessage id="join-group" /></Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <Form className="group-form" onSubmit={join}>
          <FormattedMessage id="token" />
          <FormControl
            as="input"
            onChange={e => setToken(e.target.value)}
          />
          <Button
            type="submit"
          >
            <FormattedMessage id="Confirm" />
          </Button>
        </Form>
      </Modal.Content>

    </Modal>
  )
}

export default JoinGroup
