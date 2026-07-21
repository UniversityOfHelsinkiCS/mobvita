import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { images, localeOptions, localeCodeToName } from 'Utilities/common'
import { createAnonToken, setLandingPageLangManuallySelected } from 'Utilities/redux/userReducer'
import Login from 'Components/AccessControl/Login'
import Register from 'Components/AccessControl/Register'
import TermsAndConditions from 'Components/StaticContent/TermsAndConditions'
import { setLocale } from 'Utilities/redux/localeReducer'
import ContactUs from '../StaticContent/ContactUs'
import AppMenu, { AppMenuItem } from 'Components/ui/AppMenu'
import { colors, font, shape } from 'Assets/mui_theme/designTokens'

const BRAND_TAGLINE_ID = 'Revita: for language learning and supporting endangered languages'

const menuIconStyle = { width: '22px', height: '22px' }

const LANG_BUTTON_STYLE = {
  backgroundColor: colors.green,
  color: colors.ink,
  border: 'none',
  borderRadius: '999px',
  padding: '4px 8px 4px 16px',
  fontFamily: font.family,
  fontWeight: 500,
  fontSize: '16px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  cursor: 'pointer',
  marginLeft: '40px',
}

const LandingPage = () => {
  const dispatch = useDispatch()
  const intl = useIntl()

  const [localeDropdownOptions, setLocaleDropdownOptions] = useState([])
  const [registering, setRegistering] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)

  const { locale } = useSelector(({ locale }) => locale)
  const { landingPageLangManuallySelected } = useSelector(({ user }) => user)
  const { pending, accountCreated } = useSelector(({ register }) => register)

  const actualLocale = locale
  const currentLanguageName =
    localeOptions.find(option => option.code === actualLocale)?.displayName || actualLocale

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
    <div
      className="landing-page"
      style={{
        backgroundImage: 'none',
        backgroundColor: colors.panel,
        padding: 0,
        overflow: 'auto',
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: colors.card,
          padding: '0.5em 1.25em',
          zIndex: 100,
        }}
      >
        {/* Left: burger menu — opens upward/overlapping so the X close lands on the burger */}
        <AppMenu
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          // Nudge the panel in px: +marginTop moves down, +marginLeft moves right (negatives = up/left)
          slotProps={{ paper: { sx: { marginTop: '-10px', marginLeft: '-30px' } } }}
          trigger={
            <img
              src={images.menu2}
              alt="menu"
              style={{
                width: '24px',
                height: '24px',
                cursor: 'pointer',
                display: 'block',
                marginLeft: '16px',
              }}
            />
          }
          closeIcon={<img src={images.xClose} alt="close" />}
        >
          <AppMenuItem
            href="https://drive.google.com/drive/folders/1vnfFfUd4UCBkbli25krwcKwxExDjWOeY"
            target="_blank"
            rel="noopener noreferrer"
            icon={<img src={images.helpCircle} alt="" style={menuIconStyle} />}
          >
            <FormattedMessage id="help" />
          </AppMenuItem>

          <AppMenuItem
            href="https://revitaai.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            icon={<img src={images.asterisk02} alt="" style={menuIconStyle} />}
          >
            <FormattedMessage id="about-revita" />
          </AppMenuItem>

          <AppMenuItem
            icon={<img src={images.mail05} alt="" style={menuIconStyle} />}
            onClick={() => setContactOpen(true)}
          >
            <FormattedMessage id="contact-us" />
          </AppMenuItem>

          <AppMenuItem
            data-cy="navbar-tc-button"
            icon={<img src={images.alertCircle} alt="" style={menuIconStyle} />}
            onClick={() => setTermsOpen(true)}
          >
            <span>
              {intl.formatMessage({ id: 'terms-and-conditions' })},{' '}
              {intl.formatMessage({ id: 'privacy-policy' })}
            </span>
          </AppMenuItem>

          <AppMenuItem
            href="https://revitaai.github.io/SERVER-STATUS.html"
            target="_blank"
            rel="noopener noreferrer"
            icon={<img src={images.activityHeart} alt="" style={menuIconStyle} />}
          >
            <FormattedMessage id="server-status" />
          </AppMenuItem>
        </AppMenu>

        {/* Right: language switcher */}
        <AppMenu
          minWidth={200}
          borderRadius="30px 30px 30px 30px"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          trigger={
            <button type="button" data-cy="ui-lang-select" style={LANG_BUTTON_STYLE}>
              {currentLanguageName}
              <KeyboardArrowDownIcon style={{ fontSize: 20 }} />
            </button>
          }
        >
          {localeDropdownOptions.map(option => (
            <AppMenuItem
              key={option.value}
              selected={option.value === actualLocale}
              onClick={() => handleLocaleChange(option.value)}
            >
              {option.text}
            </AppMenuItem>
          ))}
        </AppMenu>
      </div>

      {/* Modals lifted out of the menu so closing the menu doesn't unmount them */}
      <ContactUs open={contactOpen} setOpen={setContactOpen} />
      <TermsAndConditions open={termsOpen} setOpen={setTermsOpen} />
      <div
        className="slide-from-bottom"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: '2em 1em',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '48px',
            width: '100%',
            maxWidth: '960px',
          }}
        >
          {/* Brand — text directly on the blue page background (no card) */}
          <div
            style={{
              flex: '1 1 300px',
              color: colors.ink,
              padding: '1em 0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div>
                <h1
                  style={{
                    fontFamily: font.family,
                    fontSize: font.brand,
                    fontWeight: 500,
                    margin: 0,
                    lineHeight: 1,
                  }}
                >
                  Revita
                </h1>
                <p
                  style={{
                    fontFamily: font.family,
                    fontSize: '15px',
                    marginTop: '1em',
                    maxWidth: '20em',
                    color: colors.ink,
                  }}
                >
                  <FormattedMessage id={BRAND_TAGLINE_ID} />
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginTop: '2em',
                  fontFamily: font.family,
                  fontSize: '12px',
                  color: colors.ink,
                }}
              >
                <img
                  src={images.universityOfHelsinki}
                  alt="University of Helsinki"
                  style={{ height: '40px', display: 'block' }}
                />
                <div style={{ lineHeight: 1.4 }}>
                  © 2020–{new Date().getFullYear()}
                  <br />
                  University of Helsinki
                </div>
              </div>
            </div>
          </div>

          {/* Form card — cream card floating on the blue page background */}
          <div
            style={{
              flex: '0 1 450px',
              backgroundColor: colors.card,
              borderRadius: `${shape.cardRadius}px`,
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18)',
              padding: shape.cardPadding,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {registering ? (
              <Register onSwitchToLogin={() => setRegistering(false)} />
            ) : (
              <Login onSwitchToSignUp={() => setRegistering(true)} onTryRevita={loginAnon} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
