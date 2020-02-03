import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createRealToken, createAnonToken } from 'Utilities/redux/userReducer'
import { Segment, Header, Form } from 'semantic-ui-react'
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
      <h1>{intl.formatMessage({ id: 'Login' })} </h1>
      <Segment>
        <p>
          <FormattedMessage id="master-a-language-by-learning-from-stories-of-your-own-choosing" />
        </p>
        <Form onSubmit={login}>
          <Form.Field>
            <Form.Input
              label={intl.formatMessage({ id: 'email-address' })}
              error={loginError}
              type="email"
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              placeholder={intl.formatMessage({ id: 'email-address' })}
            />
          </Form.Field>
          <Form.Field>
            <Form.Input
              label={intl.formatMessage({ id: 'Password' })}
              error={loginError}
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder=""
            />
          </Form.Field>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <button
              data-cy="login"
              type="submit"
              color="teal"
              className="btn btn-primary"
            >
              {intl.formatMessage({ id: 'Login' })}
            </button>
            {loginError && <div style={{ color: 'red' }}>{errorMessage}</div>}
          </div>
        </Form>
        <h5>
          {intl.formatMessage({ id: 'dont-have-an-account-yet-please-ce3fb38f81375d77a43cbaa071a4f72f' })}
        </h5>
        <div>
          <Link to="/register"><button type="button" className="btn btn-secondary">{intl.formatMessage({ id: 'Register' })} </button></Link>
          <button data-cy="login-anon" type="button" className="btn btn-secondary" onClick={loginAnon}>
            <FormattedMessage id="try-mobvita" />
          </button>
        </div>
      </Segment>
    </>
  )
}

export default Login
