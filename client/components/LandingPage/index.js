import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Icon, Dropdown, Popup } from 'semantic-ui-react'
import { images, localeOptions, localeCodeToName } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { createAnonToken, setLandingPageLangManuallySelected } from 'Utilities/redux/userReducer'
import Login from 'Components/AccessControl/Login'
import Register from 'Components/AccessControl/Register'
import TermsAndConditions from 'Components/StaticContent/TermsAndConditions'
import { setLocale } from 'Utilities/redux/localeReducer'
import ContactUs from '../StaticContent/ContactUs'

const LandingPage = () => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const smallWindow = useWindowDimensions().width < 700

  const [localeDropdownOptions, setLocaleDropdownOptions] = useState([])
  const [registering, setRegistering] = useState(false)

  const open = useSelector(({ sidebar }) => sidebar.open)
  const { locale } = useSelector(({ locale }) => locale)
  const { landingPageLangManuallySelected } = useSelector(({ user }) => user)
  const { pending, accountCreated } = useSelector(({ register }) => register)

  const actualLocale = locale

  useEffect(() => {
    const temp = localeOptions.map(option => ({
      value: option.code,
      text: option.displayName,
      key: option.code,
    }))
    setLocaleDropdownOptions(temp)

    // set browswer lang as the ui language (unless user has manually changed it)
    const userLang = navigator.language || navigator.userLanguage

    if (!landingPageLangManuallySelected) {
      if (userLang === 'fi-FI') dispatch(setLocale('fi'))
      if (userLang === 'it-IT') dispatch(setLocale('it'))
      if (userLang === 'ru-RU') dispatch(setLocale('ru'))
    }
  }, [])

  const handleLocaleChange = newLocale => {
    dispatch(setLandingPageLangManuallySelected(true))
    dispatch(setLocale(newLocale))
  }

  useEffect(() => {
    if (!pending && accountCreated) {
      setRegistering(false)
    }
  }, [pending])

  const loginAnon = () => dispatch(createAnonToken(localeCodeToName(locale)))

  return (
    <div className="landing-page">
      <div>
        {smallWindow && (
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
        )}
        {!smallWindow && (
          <div className="landing-page-menu-button-cont">
            <div className="flex align-center">
              <div style={{ whiteSpace: 'nowrap', marginRight: '.3em' }}>
                <FormattedMessage id="interface-language" />:
              </div>
              <Dropdown
                fluid
                value={actualLocale}
                options={localeDropdownOptions}
                selection
                onChange={(e, data) => handleLocaleChange(data.value)}
                data-cy="ui-lang-select"
                style={{ color: '#777', fontSize: '.9rem', width: '125px' }}
              />
            </div>
            <Dropdown
              scrolling={false}
              direction="left"
              floating
              style={{ alignSelf: 'center' }}
              icon={
                <img
                  src={images.infoIcon}
                  alt="info icon"
                  style={{ width: '24px', height: '24px', filter: 'grayscale(1) invert(1)' }}
                />
              }
            >
              <Dropdown.Menu style={{ fontSize: '1.05rem' }}>
                <Dropdown.Item
                  text={<FormattedMessage id="about" />}
                  href="https://revitaai.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                />
                <Dropdown.Item
                  text={intl.formatMessage({ id: 'help' }) + ' & ' + intl.formatMessage({ id: 'faq' })}
                  href="https://drive.google.com/drive/folders/1vnfFfUd4UCBkbli25krwcKwxExDjWOeY"
                  target="_blank"
                  rel="noopener noreferrer"
                />
                <ContactUs
                  trigger={
                    <Dropdown.Item>
                      <FormattedMessage id="contact-us" />
                    </Dropdown.Item>
                  }
                />
                <TermsAndConditions
                  trigger={
                    <Dropdown.Item data-cy="navbar-tc-button">
                      <span>
                        {intl.formatMessage({ id: 'terms-and-conditions' })}
                        <br /> & {intl.formatMessage({ id: 'privacy-policy' })}
                      </span>
                    </Dropdown.Item>
                  }
                />
              </Dropdown.Menu>
            </Dropdown>
            <Popup
              trigger={
                <a
                  href="https://revitaai.github.io/SERVER-STATUS.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginRight: '3em', alignSelf: 'center' }}
                >
                  <img
                      src={images.heartbeat}
                      alt="heartbeat icon"
                      style={{ width: '24px', height: '24px', filter: 'grayscale(1) invert(1)' }}
                    />
                </a>
              }
              content={
                <FormattedMessage id="server-status" />
              }
              on="hover"
              position="bottom right"
            />
          </div>
        )}
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
            <FormattedMessage id="Master-a-language-by-learning-from-stories" />
          </h2>
          <p
            style={{
              color: 'lightgray',
              fontSize: '16px',
              paddingBottom: '1em',
              paddingTop: '1em',
            }}
          >
            <FormattedMessage id="Revita: for language learning and supporting endangered languages" />
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
