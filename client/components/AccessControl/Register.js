import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { registerUser } from 'Utilities/redux/registerReducer'
import { Segment, Header, Button, Form } from 'semantic-ui-react'

const Register = () => {
  const [formState, setFormState] = useState({
    email: '',
    username: '',
    password: '',
    passwordAgain: '',
  })

  const dispatch = useDispatch()

  const handleSubmit = () => {
    const { email, username, password } = formState

    // TODO: Check email and password validity

    const payload = {
      username,
      password,
      email,
    }

    dispatch(registerUser(payload))
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target

    setFormState({
      ...formState,
      [name]: value,
    })
  }

  const registerError = null
  const errorMessage = null


  return (
    <>
      <Header as="h3" style={{ margin: '0.7em auto', fontSize: '4em' }}>Register</Header>
      <Segment style={{ backgroundColor: 'azure' }}>
        <p>
          Create an account
        </p>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <Form.Input
              label="Email"
              name="email"
              error={registerError}
              type="email"
              value={formState.email}
              onChange={e => handleFormChange(e)}
              placeholder="Email"
            />
            <Form.Input
              label="Username"
              name="username"
              error={registerError}
              type="username"
              value={formState.username}
              onChange={e => handleFormChange(e)}
              placeholder="Username"
            />
            <Form.Input
              label="Password"
              name="password"
              error={registerError}
              type="password"
              value={formState.password}
              onChange={e => handleFormChange(e)}
              placeholder=""
            />
            <Form.Input
              label="Repeat password"
              name="passwordAgain"
              error={registerError}
              type="password"
              value={formState.passwordAgain}
              onChange={e => handleFormChange(e)}
              placeholder=""
            />
          </Form.Field>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Form.Button
              type="submit"
              color="teal"
            >
              Register
            </Form.Button>
            {registerError && <div style={{ color: 'red' }}>{errorMessage}</div>}
          </div>
        </Form>
      </Segment>
    </>
  )
}

export default Register
