import React, { useState } from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Button, FormControl, Form } from 'react-bootstrap'
import { forgotPassword } from 'Utilities/redux/passwordResetReducer'


const ForgotPassword = ({ isOpen, setOpen }) => {
  const [email, setEmail] = useState('')

  const dispatch = useDispatch()

  const requestPassword = (e) => {
    e.preventDefault()

    dispatch(forgotPassword(email))
    setOpen(false)
  }

  return (
    <Modal
      dimmer="inverted"
      closeIcon
      open={isOpen}
      onClose={() => setOpen(false)}
    >
      <Modal.Header><FormattedMessage id="reset-password" /></Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <Form className="group-form" onSubmit={requestPassword}>
          <FormattedMessage id="email" />
          <FormControl
            as="input"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Button
            variant="primary"
            type="submit"
          >
            <FormattedMessage id="Confirm" />
          </Button>
        </Form>
      </Modal.Content>

    </Modal>
  )
}

export default ForgotPassword
