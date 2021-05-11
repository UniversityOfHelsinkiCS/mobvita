import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import Headroom from 'react-headroom'
import { Icon, Label } from 'semantic-ui-react'
import { Link, useHistory } from 'react-router-dom'
import { logout } from 'Utilities/redux/userReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import { hiddenFeatures, capitalize, images } from 'Utilities/common'
import { Offline } from 'react-detect-offline'
import { FormattedMessage, useIntl } from 'react-intl'
import TermsAndConditions from 'Components/StaticContent/TermsAndConditions'
import ContactUs from './StaticContent/ContactUs'
import AboutUs from './StaticContent/AboutUs'
import Tour from './Tour'
import NewsModal from './NewsModal'

export default function NavBar() {
  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const { numUnreadNews } = useSelector(({ metadata }) => metadata)
  const open = useSelector(({ sidebar }) => sidebar.open)
  const dispatch = useDispatch()
  const history = useHistory()
  const smallWindow = useWindowDimensions().width < 640
  const intl = useIntl()

  const handleEloClick = () => {
    history.push('/profile/progress')
  }

  const signOut = () => {
    dispatch(logout())
    history.push('/')
  }

  const handleTourStart = () => {
    dispatch(sidebarSetOpen(false))
    dispatch({ type: 'RESTART' })
  }

  const getLearningLanguageFlag = () => {
    const lastUsedLanguage = user.user.last_used_language

    if (lastUsedLanguage) {
      return images[`flag${capitalize(lastUsedLanguage.split('-').join(''))}`]
    }
    return null
  }

  const showStoryElo = history.location.pathname.includes('practice')
  const showFlashcardElo = hiddenFeatures && history.location.pathname.includes('flashcards')
  const hasChosenLearningLanguage = user?.user?.last_used_language !== null
  const isNewUser = user?.user?.total_time_spent < 0.5

  const storyElo =
    user && user.user.exercise_history && user.user.exercise_history.length > 0
      ? user.user.exercise_history[user.user.exercise_history.length - 1].score
      : 0

  const flashcardElo =
    user && user.user.flashcard_history && user.user.flashcard_history.length > 0
      ? user.user.flashcard_history[user.user.flashcard_history.length - 1].score
      : 0

  const navBarStyle = smallWindow ? {} : { position: 'fixed', top: 0, width: '100%', zIndex: '100' }

  const blackToWhiteFilter =
    'invert(92%) sepia(94%) saturate(29%) hue-rotate(251deg) brightness(108%) contrast(100%)'

  if (!user) return null

  return (
    <Headroom disableInlineStyles={!smallWindow} style={navBarStyle}>
      <Navbar style={{ paddingLeft: '0.5em' }}>
        <div style={{ display: 'flex' }}>
          {smallWindow && (
            <Icon
              name="bars"
              size="big"
              onClick={() => dispatch(sidebarSetOpen(!open))}
              className="sidebar-hamburger tour-sidebar"
              style={{ color: 'white', marginBottom: '0.3em' }}
              data-cy="hamburger"
            />
          )}
        </div>
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <Link to="/home">
              <Icon
                name="home"
                size="big"
                style={{
                  color: 'white',
                  cursor: 'pointer',
                  marginLeft: '0.2em',
                  marginTop: '0.1em',
                  marginBottom: '0.01em',
                }}
              />
            </Link>
            <Link to="/home">
              <Navbar.Brand
                className="tour-start-finish"
                style={{
                  color: 'white',
                  marginRight: '2em',
                }}
              >
                <img src={images.navbarLogo} alt="revita logo" width="70" />
                {hiddenFeatures && <sup> &beta;</sup>}
              </Navbar.Brand>
            </Link>

            {!smallWindow && (
              <>
                <Link data-cy="navbar-library-button" to="/library">
                  <Navbar.Brand
                    style={{
                      color: 'white',
                      marginRight: '2em',
                    }}
                  >
                    <FormattedMessage id="Library" />
                  </Navbar.Brand>
                </Link>
                <Link to="/flashcards">
                  <Navbar.Brand
                    style={{
                      color: 'white',
                      marginRight: '2em',
                    }}
                  >
                    <FormattedMessage id="Flashcards" />
                  </Navbar.Brand>
                </Link>
                <NavDropdown
                  data-cy="navbar-groups-dropdown"
                  title={
                    <Navbar.Brand
                      style={{
                        color: 'white',
                        marginTop: '-0.5rem',
                        marginBottom: '-0.5rem',
                        marginRight: '0em',
                      }}
                    >
                      <FormattedMessage id="groups" />
                    </Navbar.Brand>
                  }
                >
                  <NavDropdown.Item
                    data-cy="navbar-student-groups-button"
                    as={Link}
                    to="/groups/student"
                  >
                    <FormattedMessage id="Groups-for-students" />
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/groups/teacher">
                    <FormattedMessage id="Groups-for-teachers" />
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>

          <Nav>
            <Offline polling={{ timeout: 20000 }}>
              <Icon
                name="broken chain"
                size="large"
                style={{ color: '#ff944d', paddinTop: '12em' }}
              />
            </Offline>
            <Navbar.Text
              style={{ color: 'white', marginRight: '1em', cursor: 'pointer' }}
              onClick={handleEloClick}
            >
              {showStoryElo && (
                <div>
                  <Icon className="nav-basic-item" name="star outline" style={{ margin: 0 }} />{' '}
                  {storyElo}
                </div>
              )}
              {showFlashcardElo && (
                <div>
                  <img
                    src={images.flashcardIcon}
                    alt="three cards"
                    width="18px"
                    style={{
                      filter: blackToWhiteFilter,
                      marginRight: '0.2em',
                      marginBottom: '0.2em',
                      marginTop: '0.5em',
                    }}
                  />
                  {flashcardElo}
                </div>
              )}
            </Navbar.Text>

            {!smallWindow && (
              <>
                <NavDropdown
                  title={
                    <Icon
                      className="navbar-dropdown-icon"
                      data-cy="navbar-user-dropdown"
                      name="user"
                      size="big"
                    />
                  }
                >
                  {user.user.email === 'anonymous_email' && (
                    <>
                      <NavDropdown.Item as={Link} to="/register">
                        <FormattedMessage id="Register" />
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={signOut}>
                        <FormattedMessage id="Login" />
                      </NavDropdown.Item>
                    </>
                  )}

                  {user.user.email !== 'anonymous_email' && (
                    <>
                      <span className="bold" style={{ padding: '1.5em' }}>
                        {user.user.username}
                      </span>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={Link} to="/profile/progress">
                        <FormattedMessage id="Profile" />
                      </NavDropdown.Item>
                      <NavDropdown.Item data-cy="navbar-logout-button" onClick={signOut}>
                        <FormattedMessage id="sign-out" />
                      </NavDropdown.Item>
                    </>
                  )}
                </NavDropdown>

                {user && user.user.last_used_language && (
                  <Link to="/learningLanguage">
                    <img
                      style={{
                        height: '1.9em',
                        marginTop: '0.5rem',
                        marginLeft: '0.6rem',
                        marginRight: '0.6rem',
                        left: '2em',
                        border: '1px solid black',
                      }}
                      src={getLearningLanguageFlag()}
                      alt="learningLanguageFlag"
                    />
                  </Link>
                )}

                <NavDropdown
                  title={
                    <Icon
                      data-cy="navbar-info-dropdown"
                      className="navbar-dropdown-icon"
                      name="info circle"
                      size="big"
                    />
                  }
                >
                  <NavDropdown.Item
                    className="navbar-external-link"
                    href="https://www2.helsinki.fi/en/projects/revita-language-learning-and-ai/about-the-project"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FormattedMessage id="about" />
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/help">
                    <FormattedMessage id="help" />
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    className="navbar-external-link"
                    href="https://www2.helsinki.fi/en/projects/revita-language-learning-and-ai/faq"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    FAQ
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <ContactUs
                    trigger={
                      <NavDropdown.Item>
                        <FormattedMessage id="contact-us" />
                      </NavDropdown.Item>
                    }
                  />
                  <NavDropdown.Divider />
                  <TermsAndConditions
                    trigger={
                      <NavDropdown.Item data-cy="navbar-tc-button" style={{ fontSize: '0.9em' }}>
                        {intl.formatMessage({ id: 'terms-and-conditions' })} &
                        <br />
                        {intl.formatMessage({ id: 'privacy-policy' })}
                      </NavDropdown.Item>
                    }
                  />
                </NavDropdown>
              </>
            )}

            <NewsModal
              trigger={
                <div style={{ paddingTop: '0.5em' }}>
                  <span
                    style={{
                      color: 'white',
                      position: 'relative',
                      marginLeft: '0.3em',
                      cursor: 'pointer',
                    }}
                  >
                    <Icon name="bell" size="big" />
                    {numUnreadNews > 0 ? (
                      <Label color="red" size="mini" floating>
                        <span style={{ fontSize: '0.9rem' }}>{numUnreadNews}</span>
                      </Label>
                    ) : null}
                  </span>
                </div>
              }
            />

            <Link to="/profile/settings">
              <Icon
                data-cy="navbar-settings-button"
                className="nav-basic-item"
                name="setting"
                size="big"
              />
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Headroom>
  )
}
