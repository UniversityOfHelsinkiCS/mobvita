import React, { useState } from 'react'
import { Modal, Form } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Button } from 'react-bootstrap'
import { forgotPassword } from 'Utilities/redux/passwordResetReducer'

const ForgotPassword = ({ isOpen, setOpen }) => {
  const [email, setEmail] = useState('')

  const dispatch = useDispatch()
  const intl = useIntl()

  const requestPassword = e => {
    e.preventDefault()

    dispatch(forgotPassword(email))
    setOpen(false)
  }

  return (
    <Modal dimmer="inverted" closeIcon open={isOpen} onClose={() => setOpen(false)}>
      <Modal.Header>
        <FormattedMessage id="forgot-password" />
      </Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <Form onSubmit={requestPassword}>
          <Form.Field>
            <Form.Input
              label={intl.formatMessage({ id: 'password-reset-instructions' })}
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder={intl.formatMessage({ id: 'Email' })}
            />
          </Form.Field>
          <Form.Field>
            <Button variant="primary" type="submit">
              <FormattedMessage id="Confirm-Password" />
            </Button>
          </Form.Field>
        </Form>
      </Modal.Content>
    </Modal>
  )
}

export default ForgotPassword
