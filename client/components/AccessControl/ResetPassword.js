import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button } from 'react-bootstrap'
import { Form } from 'semantic-ui-react'
import { resetPassword } from 'Utilities/redux/passwordResetReducer'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')
  const [error, setError] = useState(false)

  const dispatch = useDispatch()
  const intl = useIntl()
  const navigate = useNavigate()
  const { token } = useParams()

  const handleSubmit = e => {
    e.preventDefault()
    if (password !== repeat) {
      setError(true)
      return
    }

    dispatch(resetPassword(password, token))
    navigate('/home', { replace: true })
  }

  return (
    <div className="cont-narrow auto pt-xl">
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <Form.Input
            label={intl.formatMessage({ id: 'new-password' })}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={error}
          />
        </Form.Field>
        <Form.Field>
          <Form.Input
            label={intl.formatMessage({ id: 'repeat-password' })}
            type="password"
            value={repeat}
            onChange={e => setRepeat(e.target.value)}
            error={error}
          />
        </Form.Field>
        <Form.Field>
          <Button variant="primary" type="submit">
            <FormattedMessage id="Confirm-Password" />
          </Button>
        </Form.Field>
      </Form>
    </div>
  )
}

export default ResetPassword
