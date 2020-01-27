import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from 'Utilities/redux/registerReducer'
import { Header, Form, Checkbox, Segment } from 'semantic-ui-react'
import TermsAndConditions from 'Components/TermsAndConditions'
import { useIntl } from 'react-intl'
import Login from 'Components/AccessControl/Login'
import { Link } from 'react-router-dom'
import { setNotification } from 'Utilities/redux/notificationReducer'


const Register = () => {
  const [formState, setFormState] = useState({
    email: '',
    username: '',
    password: '',
    passwordAgain: '',
  })
  const intl = useIntl()

  const [accepted, setAccepted] = useState(false)

  const toggleAccepted = () => {
    setAccepted(!accepted)
  }

  const { error, errorMessage } = useSelector(({ register }) => register)

  const dispatch = useDispatch()


  useEffect(() => {
    if (error) {
      dispatch(setNotification(errorMessage, 'error'))
    }
  }, [error])


  const handleSubmit = () => {
    const { email, username, password, passwordAgain } = formState

    if (password !== passwordAgain) {
      dispatch(setNotification('Passwords dont match!', 'error'))
    } else if (accepted) {
      const payload = {
        username,
        password,
        email,
      }

      dispatch(registerUser(payload))
    } else {
      dispatch(setNotification('You must accept Terms and Conditions', 'error'))
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
    <>
      <h1>{intl.formatMessage({ id: 'Register' })}</h1>
      <Segment className="container" style={{ backgroundColor: 'azure' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <Form.Input
              label="Email"
              name="email"
              error={error}
              type="email"
              value={formState.email}
              onChange={e => handleFormChange(e)}
              placeholder="Email"
            />
            <Form.Input
              label="Username"
              name="username"
              error={error}
              type="username"
              value={formState.username}
              onChange={e => handleFormChange(e)}
              placeholder="Username"
            />
            <Form.Input
              label="Password"
              name="password"
              error={error}
              type="password"
              value={formState.password}
              onChange={e => handleFormChange(e)}
              placeholder=""
            />
            <Form.Input
              label="Repeat password"
              name="passwordAgain"
              error={error}
              type="password"
              value={formState.passwordAgain}
              onChange={e => handleFormChange(e)}
              placeholder=""
            />
          </Form.Field>
          <Checkbox checked={accepted} onChange={() => toggleAccepted()} />
          <TermsAndConditions trigger={<button type="button" className="btn btn-link"> Terms and Conditions </button>} />
          <div>
            <button
              type="submit"
              color="teal"
              className="btn btn-primary"
            >
              {intl.formatMessage({ id: 'Register' })}
            </button>
          </div>
        </Form>
        <Link to="/login"><button type="button" className="btn btn-secondary">Already have an account? Login</button></Link>
      </Segment>
    </>
  )
}

export default Register
