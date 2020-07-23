import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { images, localeCodeToName } from 'Utilities/common'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { createAnonToken } from 'Utilities/redux/userReducer'
import Login from 'Components/AccessControl/Login'
import Register from 'Components/AccessControl/Register'

const LandingPage = () => {
  const dispatch = useDispatch()

  const [registering, setRegistering] = useState(false)

  const open = useSelector(({ sidebar }) => sidebar.open)
  const locale = useSelector(({ locale }) => locale)
  const { pending, accountCreated } = useSelector(({ register }) => register)

  useEffect(() => {
    if (!pending && accountCreated) {
      setRegistering(false)
    }
  }, [pending])

  const loginAnon = () => dispatch(createAnonToken(localeCodeToName(locale)))

  return (
    <div className="landing-page">
      <div>
        <Icon
          name="bars"
          size="big"
          onClick={() => dispatch(sidebarSetOpen(!open))}
          style={{
            position: 'fixed',
            color: 'whitesmoke',
            top: '0.2em',
            left: '0.3em',
            cursor: 'pointer',
            zIndex: 90,
          }}
          data-cy="hamburger"
        />
      </div>
      <div
        className="space-evenly align-center slide-from-bottom"
        style={{ height: '100%', flexWrap: 'wrap', maxWidth: '1920px', margin: 'auto' }}
      >
        <div style={{ width: '40%', maxWidth: '520px', minWidth: '300px' }}>
          <img
            style={{ width: '15em', marginLeft: '-0.5em', filter: 'brightness(1.3)' }}
            src={images.logo}
            alt="revitaLogo"
          />
          <h2 style={{ color: 'white', fontWeight: 600, paddingTop: '0.5em' }}>
            Master a language by learning from stories of your own choosing
          </h2>
          <p
            style={{
              color: 'lightgray',
              fontSize: '16px',
              paddingBottom: '1em',
              paddingTop: '1em',
            }}
          >
            Revita provides tools for language learning, and for supporting endangered languages.
            Revita stimulates the student to practice in actively producing language, rather than
            passively absorbing rules.
          </p>
          <button
            type="button"
            onClick={loginAnon}
            className="landing-page-button"
            style={{ marginRight: '1em', marginBottom: '1em' }}
            data-cy="login-anon"
          >
            <FormattedMessage id="try-revita" />
          </button>
          {registering ? (
            <button
              type="button"
              onClick={() => setRegistering(false)}
              className="landing-page-button"
              style={{ marginBottom: '1em' }}
            >
              <FormattedMessage id="Login" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setRegistering(true)}
              className="landing-page-button"
              style={{ marginBottom: '1em' }}
              data-cy="register-button"
            >
              <FormattedMessage id="Register" />
            </button>
          )}
        </div>
        <div style={{ width: '40%', maxWidth: '520px', minWidth: '300px' }}>
          {registering ? <Register /> : <Login />}
        </div>
      </div>
    </div>
  )
}

export default LandingPage
