import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createRealToken, createAnonToken } from 'Utilities/redux/userReducer'
import { Segment, Header, Button, Form } from 'semantic-ui-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const loginError = useSelector(({ user }) => user.error)
  const errorMessage = useSelector(({ user }) => user.errorMessage)

  const dispatch = useDispatch()

  const login = () => dispatch(createRealToken(email, password))
  const loginAnon = () => dispatch(createAnonToken())

  return (
    <>
      <Header as="h3" style={{ margin: '0.7em auto', fontSize: '4em' }}>Login</Header>
      <Segment style={{ backgroundColor: 'azure' }}>
        <p>
          Master a language by learning from stories of your own choosing
        </p>
        <Form onSubmit={login}>
          <Form.Field>
            <Form.Input
              label="Email"
              error={loginError}
              type="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder="Email"
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label="Password"
              error={loginError}
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder=""
            />
          </Form.Field>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Form.Button
              type="submit"
              color="teal"
            >
              Login
            </Form.Button>
            {loginError && <div style={{ color: 'red' }}>{errorMessage}</div>}
          </div>
        </Form>
        <h3>
          Don't have an account yet?
        </h3>
        <div>
          <Button
            type="button"
            color="black"

            onClick={loginAnon}
          >
            Test Mobvita without an account
          </Button>
        </div>
      </Segment>
    </>
  )
}

export default Login
