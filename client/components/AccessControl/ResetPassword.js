import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { Button, Form, FormControl } from 'react-bootstrap'
import { resetPassword } from 'Utilities/redux/passwordResetReducer'

const ResetPassword = ({ match }) => {
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')

  const dispatch = useDispatch()
  const history = useHistory()

  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch(resetPassword(password, match.params.token))
    history.replace('/login')
  }

  return (
    <Form className="group-form" onSubmit={handleSubmit}>
      <FormattedMessage id="Password" />
      <FormControl
        as="input"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <FormattedMessage id="repeat-password" />
      <FormControl
        as="input"
        type="password"
        value={repeat}
        onChange={e => setRepeat(e.target.value)}
      />
      <Button
        variant="primary"
        type="submit"
      >
        <FormattedMessage id="Confirm" />
      </Button>
    </Form>
  )
}

export default ResetPassword
