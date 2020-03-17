import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from 'Utilities/redux/registerReducer'
import { Form, Checkbox, Segment } from 'semantic-ui-react'
import TermsAndConditions from 'Components/TermsAndConditions'
import { useIntl, FormattedMessage } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import { setNotification } from 'Utilities/redux/notificationReducer'
import { Button } from 'react-bootstrap'

const Register = () => {
  const [formState, setFormState] = useState({
    email: '',
    username: '',
    password: '',
    passwordAgain: '',
  })
  const intl = useIntl()
  const history = useHistory()
  const [accepted, setAccepted] = useState(false)

  const toggleAccepted = () => {
    setAccepted(!accepted)
  }

  const { error, errorMessage, pending, accountCreated } = useSelector(({ register }) => register)

  const dispatch = useDispatch()

  useEffect(() => {
    if (error) {
      dispatch(setNotification(errorMessage, 'error'))
    }
  }, [error])

  useEffect(() => {
    if (!pending && accountCreated) {
      history.push('/login')
    }
  }, [pending])


  const handleSubmit = () => {
    const { email, username, password, passwordAgain } = formState

    if (password !== passwordAgain) {
      dispatch(setNotification(intl.formatMessage({ id: 'passwords-do-not-match' }), 'error'))
    } else if (accepted) {
      const payload = {
        username,
        password,
        email,
      }

      dispatch(registerUser(payload))
    } else {
      dispatch(setNotification(intl.formatMessage({ id: 'you-must-accept-terms-and-conditions' }), 'error'))
    }

    // TODO: Check email and password validity
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target

    setFormState({
      ...formState,
      [name]: value,
    })
  }
  return (
    <div className="component-container">
      <h1>{intl.formatMessage({ id: 'Register' })}</h1>
      <Segment>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <Form.Input
              label={intl.formatMessage({ id: 'Email' })}
              name="email"
              error={error}
              type="email"
              value={formState.email}
              onChange={e => handleFormChange(e)}
              placeholder={intl.formatMessage({ id: 'Email' })}
            />
            <Form.Input
              label={intl.formatMessage({ id: 'Username' })}
              name="username"
              error={error}
              type="username"
              value={formState.username}
              onChange={e => handleFormChange(e)}
              placeholder={intl.formatMessage({ id: 'Username' })}
            />
            <Form.Input
              label={intl.formatMessage({ id: 'Password' })}
              name="password"
              error={error}
              type="password"
              value={formState.password}
              onChange={e => handleFormChange(e)}
              placeholder=""
            />
            <Form.Input
              label={intl.formatMessage({ id: 'repeat-password' })}
              name="passwordAgain"
              error={error}
              type="password"
              value={formState.passwordAgain}
              onChange={e => handleFormChange(e)}
              placeholder=""
            />
          </Form.Field>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkbox data-cy="accept-terms" checked={accepted} onChange={() => toggleAccepted()} />
            <TermsAndConditions trigger={<Button variant="link"> Terms and Conditions, Privacy Policy </Button>} />
          </div>
          <div>
            <Button
              type="submit"
              variant="primary"
            >
              {intl.formatMessage({ id: 'Register' })}
            </Button>
            <Link to="/login"><Button variant="secondary"><FormattedMessage id="Login" /></Button></Link>
          </div>
        </Form>
      </Segment>
    </div>
  )
}

export default Register
