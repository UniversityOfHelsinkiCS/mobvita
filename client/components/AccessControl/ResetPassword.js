import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { Button, Form, FormControl } from 'react-bootstrap'
import { resetPassword } from 'Utilities/redux/passwordResetReducer'

const ResetPassword = (props) => {
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')

  const dispatch = useDispatch()
  const history = useHistory()
  const query = new URLSearchParams(useLocation().search)

  console.log(query.get('token'))

  const handleSubmit = (e) => {
    e.preventDefault()

    dispatch(resetPassword(password, location))
  }

  return (
    <Form className="group-form" onSubmit={handleSubmit}>
      <FormattedMessage id="email" />
      <FormControl
        as="input"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <FormControl
        as="input"
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
