import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Sidebar, Menu, Icon, Header, Dropdown } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { Swipeable } from 'react-swipeable'
import { FormattedMessage } from 'react-intl'
import { localeOptions, capitalize, localeNameToCode, images, hiddenFeatures } from 'Utilities/common'
import { setLocale } from 'Utilities/redux/localeReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { logout, updateLocale } from 'Utilities/redux/userReducer'
import TermsAndConditions from 'Components/TermsAndConditions'
import { Button } from 'react-bootstrap'
import AboutUs from './StaticContent/AboutUs'
import ContactUs from './StaticContent/ContactUs'
import Settings from './Settings'


export default function Bar({ history }) {
  const dispatch = useDispatch()

  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const open = useSelector(({ sidebar }) => sidebar.open)

  const locale = useSelector(({ locale }) => locale)

  const [localeDropdownOptions, setLocaleDropdownOptions] = useState([])

  const handleLocaleChange = (newLocale) => {
    dispatch(setLocale(newLocale)) // Sets locale in root reducer...
    if (user) dispatch(updateLocale(newLocale)) // Updates user-object
  }


  useEffect(() => {
    const temp = localeOptions.map(option => ({
      value: option.code,
      text: option.displayName,
      key: option.code,
    }))
    setLocaleDropdownOptions(temp)
  }, [])


  const signOut = () => {
    dispatch(logout())
    history.push('/')
  }

  const menuClickWrapper = (func) => {
    if (func) func()

    if (window.innerWidth <= 1024) {
      dispatch(sidebarSetOpen(false))
    }
  }

  const getLearningLanguageFlag = () => {
    const lastUsedLanguage = (user.user.last_used_language)

    if (lastUsedLanguage) {
      return images[`flag${capitalize(lastUsedLanguage.split('-').join(''))}`]
    }
    return null
  }

  let actualLocale = locale
  if (user && user.user.interfaceLanguage) { // If user has logged in, use locale from user object, else use value from localeReducer
    actualLocale = localeNameToCode(user.user.interfaceLanguage)
  }

  return (
    <>
      <Swipeable
        className="sidebar-swipeable"
        onSwipedRight={() => dispatch(sidebarSetOpen(true))}
        onSwipedLeft={() => dispatch(sidebarSetOpen(false))}
        trackMouse
      >
        <Sidebar
          as={Menu}
          animation="push"
          icon="labeled"
          vertical
          visible={open}
        >

          <div className="sidebar-content">
            <div style={{ padding: '0.5em 1em 1em 0.5em', display: 'flex' }}>
              <Icon
                name="bars"
                size="big"
                onClick={() => dispatch(sidebarSetOpen(!open))}
                className="sidebar-hamburger"
                style={{ position: 'fixed', paddingTop: 0 }}
              />
              <div
                style={{ padding: '1em 1em 1em 1.5em', display: 'flex', flexDirection: 'column', marginRight: 'auto', marginLeft: 'auto' }}
              >
                <Link to="/home" onClick={() => menuClickWrapper()}>
                  <Header as="h2">MobVita - alpha</Header>
                  <img
                    style={{ width: '6em', margin: '0 auto' }}
                    src={images.revitaLogoTransparent}
                    alt="revitaLogo"
                  />
                </Link>
              </div>
            </div>

            {user && (
              <>
                {user.user.email === 'anonymous_email' && (
                <Menu.Item>
                  <div style={{ padding: '1em 0em' }}>
                    <Link onClick={() => menuClickWrapper()} to="/register"><Button variant="primary"><FormattedMessage id="register-to-upload-your-own-stories" /></Button></Link>
                  </div>
                </Menu.Item>
                )}

                <Menu.Item>


                  <Link to="/learningLanguage" onClick={() => menuClickWrapper()}>
                    <Button variant="primary" block>
                      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                        <span><FormattedMessage id="Learning-language" /></span>
                        {user && user.user.last_used_language && <img style={{ width: '3em', height: '2em' }} src={getLearningLanguageFlag()} alt="learningLanguageFlag" />}
                      </div>
                    </Button>
                  </Link>

                  {hiddenFeatures
                    && <Settings trigger={<Button variant="secondary" block style={{ marginTop: '0.5em' }}>Learning settings</Button>} />}
                  {hiddenFeatures
                    && (
                    <Link to="/groups">
                      <Button data-cy="groups-link" variant="secondary" onClick={() => dispatch(sidebarSetOpen(!open))} block>
                        <FormattedMessage id="Groups" />
                      </Button>
                    </Link>
                    )}
                </Menu.Item>
              </>
            )}

            <Menu.Item>
              <div style={{ textAlign: 'left' }}><FormattedMessage id="interface-language" /></div>
              <Dropdown
                fluid
                placeholder="Choose interface language..."
                value={actualLocale}
                options={localeDropdownOptions}
                selection
                onChange={(e, data) => handleLocaleChange(data.value)}
                data-cy="ui-lang-select"
              />
            </Menu.Item>


            <div style={{ marginTop: 'auto' }}>
              <Menu.Item style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <AboutUs
                  trigger={(
                    <Button data-cy="about-button" variant="secondary" style={{ flexBasis: '50%' }}>
                      <FormattedMessage id="About" />
                    </Button>
                  )}
                />
                <ContactUs trigger={<Button variant="secondary" style={{ flexBasis: '50%' }}><FormattedMessage id="Contact" /></Button>} />
                {user && <Button data-cy="logout" variant="secondary" style={{ flexBasis: '50%' }} onClick={() => menuClickWrapper(signOut)}><FormattedMessage id="sign-out" /></Button>}
              </Menu.Item>
              <TermsAndConditions
                trigger={<Button data-cy="tc-button" variant="link"> Terms and Conditions, Privacy Policy </Button>}
              />

              {/* eslint-disable no-undef */}
              <div>{`Built at: ${__VERSION__}`}</div>
              <div>{`Commit: ${__COMMIT__}`}</div>

            </div>
          </div>
        </Sidebar>
      </Swipeable>
    </>
  )
}
