import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createRealToken, createAnonToken } from 'Utilities/redux/userReducer'
import { Segment, Header, Button, Form } from 'semantic-ui-react'
import { useHistory, useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const loginError = useSelector(({ user }) => user.error)
  const errorMessage = useSelector(({ user }) => user.errorMessage)
  const user = useSelector(({ user }) => user.data)
  const location = useLocation()
  const history = useHistory()
  const intl = useIntl()


  const dispatch = useDispatch()

  const login = () => dispatch(createRealToken(email, password))
  const loginAnon = () => dispatch(createAnonToken())

  useEffect(() => {
    const { from } = location.state || { from: { pathname: '/' } }

    if (user) {
      if (!user.user.last_used_language) {
        history.replace('/learningLanguage')
      } else {
        history.replace(from)
      }
    }
  }, [user])

  return (
    <>
      <Header as="h3" style={{ margin: '0.7em auto', fontSize: '4em' }}>{intl.formatMessage({id: "Login"})} </Header>
      <Segment style={{ backgroundColor: 'azure' }}>
        <p>
          <FormattedMessage id="master-a-language-by-learning-from-stories-of-your-own-choosing" />
        </p>
        <Form onSubmit={login}>
          <Form.Field>
            <Form.Input
              label={intl.formatMessage({id:"email-address"})}
              error={loginError}
              type="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder={intl.formatMessage({id: "email-address"})}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label={intl.formatMessage({id: "Password"})}
              error={loginError}
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder=""
            />
          </Form.Field>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Form.Button
              data-cy="login"
              type="submit"
              color="teal"
            >
              {intl.formatMessage({id: "Login"})}
            </Form.Button>
            {loginError && <div style={{ color: 'red' }}>{errorMessage}</div>}
          </div>
        </Form>
        <h3>
        {intl.formatMessage({id: "dont-have-an-account-yet-please-ce3fb38f81375d77a43cbaa071a4f72f"})}
        </h3>
        <div>
          <Button as={Link} to="/register">{intl.formatMessage({id: "Register"})} </Button>
          <Button
            data-cy="login-anon"
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
