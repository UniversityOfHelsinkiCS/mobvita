import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { registerUser } from 'Utilities/redux/registerReducer'
import { getSelf } from 'Utilities//redux/userReducer'
import { Form, Checkbox, Dropdown } from 'semantic-ui-react'
import TermsAndConditions from 'Components/StaticContent/TermsAndConditions'
import { useIntl, FormattedMessage } from 'react-intl'
import { setNotification } from 'Utilities/redux/notificationReducer'
import { localeCodeToName, supportedLearningLanguages, capitalize, images } from 'Utilities/common'
import { Button, Spinner } from 'react-bootstrap'

const Register = () => {
  const intl = useIntl()
  const history = useHistory()
  const [isTeacher, setIsTeacher] = useState(false)
  const [chosenLanguage, setChosenLanguage] = useState('Finnish')
  const [formState, setFormState] = useState({
    email: '',
    username: '',
    password: '',
    passwordAgain: '',
  })
  const [accepted, setAccepted] = useState(false)

  const toggleAccepted = () => {
    setAccepted(!accepted)
  }
  const mergeList = supportedLearningLanguages.major
    .concat(supportedLearningLanguages.majorBeta)
    .concat(supportedLearningLanguages.minor)
    .map(language => ({
      key: language,
      text: capitalize(language),
      value: JSON.stringify(language), // needs to be string
      image: {
        avatar: true,
        src: images[`flag${capitalize(language.split('-').join(''))}`],
      },
    }))

  const {
    error,
    errorMessage,
    pending: registerPending,
    accountCreated,
  } = useSelector(({ register }) => register)
  const userEmail = useSelector(({ user }) => user.data?.user?.email)
  const locale = useSelector(({ locale }) => locale)

  const dispatch = useDispatch()

  useEffect(() => {
    if (error) {
      dispatch(setNotification(errorMessage, 'error'))
    }
  }, [error])

  useEffect(() => {
    if (!registerPending && accountCreated && history.location.pathname.includes('register')) {
      dispatch(getSelf())
    }
  }, [registerPending])

  useEffect(() => {
    if (history.location.pathname.includes('register') && userEmail !== 'anonymous_email')
      history.push('/home')
  }, [userEmail])

  const handleSubmit = () => {
    const { email, username, password, passwordAgain } = formState

    if (password !== passwordAgain) {
      dispatch(setNotification('passwords-do-not-match', 'error'))
    } else if (accepted) {
      const payload = {
        username,
        password,
        email,
        interface_language: localeCodeToName(locale),
        is_teacher: isTeacher,
        learning_language: chosenLanguage,
      }

      dispatch(registerUser(payload))
    } else {
      dispatch(setNotification('you-must-accept-terms-and-conditions', 'error'))
    }

    // TODO: Check email and password validity
  }

  const handleFormChange = e => {
    const { name, value } = e.target

    setFormState({
      ...formState,
      [name]: value,
    })
  }
  return (
    <div className="login-form">
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <Form.Input
            name="email"
            error={error}
            type="email"
            value={formState.email}
            onChange={e => handleFormChange(e)}
            placeholder={intl.formatMessage({ id: 'Email' })}
          />
          <Form.Input
            name="username"
            error={error}
            type="username"
            value={formState.username}
            onChange={e => handleFormChange(e)}
            placeholder={intl.formatMessage({ id: 'Username' })}
          />
          <Form.Input
            name="password"
            error={error}
            type="password"
            value={formState.password}
            onChange={e => handleFormChange(e)}
            placeholder={intl.formatMessage({ id: 'Password' })}
          />
          <Form.Input
            name="passwordAgain"
            error={error}
            type="password"
            value={formState.passwordAgain}
            onChange={e => handleFormChange(e)}
            placeholder={intl.formatMessage({ id: 'repeat-password' })}
          />
        </Form.Field>
        <div style={{ display: 'flex' }}>
          <span style={{ marginRight: '0.5em' }}>
            <input type="radio" onChange={() => setIsTeacher(false)} checked={!isTeacher} />
          </span>
          <span style={{ marginRight: '0.5em' }}>
            <FormattedMessage id="user-role-select-student" />
          </span>
          <span style={{ marginRight: '0.5em' }}>
            <input type="radio" onChange={() => setIsTeacher(true)} checked={isTeacher} />
          </span>
          <span style={{ marginRight: '0.5em' }}>
            <FormattedMessage id="user-role-select-teacher" />
          </span>
        </div>
        <hr />
        <div className="flex">
          <FormattedMessage id="Learning-language" />
          <Dropdown
            selection
            fluid
            options={mergeList}
            text={<b>{chosenLanguage}</b>}
            onChange={(_, { value }) => setChosenLanguage(capitalize(JSON.parse(value)))}
          />
        </div>
        <hr />
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em' }}>
          <Checkbox data-cy="accept-terms" checked={accepted} onChange={() => toggleAccepted()} />
          <TermsAndConditions
            trigger={<Button variant="link"> Terms and Conditions, Privacy Policy </Button>}
          />
        </div>
        <div>
          <button type="submit" className="landing-page-button" disabled={registerPending}>
            {registerPending ? (
              <Spinner animation="border" variant="info" size="sm" />
            ) : (
              <span>{intl.formatMessage({ id: 'Register' })}</span>
            )}
          </button>
        </div>
      </Form>
    </div>
  )
}

export default Register
