import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navbar, Nav, NavDropdown } from 'react-bootstrap'
import Headroom from 'react-headroom'
import { Icon, Label, Popup } from 'semantic-ui-react'
import { Link, useHistory } from 'react-router-dom'
import { logout } from 'Utilities/redux/userReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { getMetadata } from 'Utilities/redux/metadataReducer'
import { getNews } from 'Utilities/redux/newsReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import {
  hiddenFeatures,
  capitalize,
  images,
  learningLanguageSelector,
  getBackgroundColor,
} from 'Utilities/common'
import { Offline } from 'react-detect-offline'
import { FormattedMessage, useIntl } from 'react-intl'
import TermsAndConditions from 'Components/StaticContent/TermsAndConditions'
import ContactUs from './StaticContent/ContactUs'
import Tour from './Tour'

const NavbarIcon = ({ imgSrc, altText, extraClass }) => {
  return (
    <img
      className={extraClass ?? ''}
      src={imgSrc}
      alt={altText}
      style={{ width: '21px', height: '21px' }}
    />
  )
}

export default function NavBar() {
  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const { numUnreadNews } = useSelector(({ metadata }) => metadata)
  const open = useSelector(({ sidebar }) => sidebar.open)
  const dispatch = useDispatch()
  const history = useHistory()
  const smallWindow = useWindowDimensions().width < 730
  const intl = useIntl()
  const learningLanguage = useSelector(learningLanguageSelector)

  const handleEloClick = () => {
    history.push('/profile/progress')
  }

  const signOut = () => {
    dispatch(logout())
    history.push('/')
  }

  const handleTourStart = () => {
    dispatch(sidebarSetOpen(false))
    dispatch({ type: 'TOUR_RESTART' })
  }

  const handleNewsClick = async () => {
    await dispatch(getNews())
    await dispatch(getMetadata(learningLanguage))
  }

  const getLearningLanguageFlag = () => {
    const lastUsedLanguage = user.user.last_used_language

    if (lastUsedLanguage) {
      return images[`flag${capitalize(lastUsedLanguage.toLowerCase().split('-').join(''))}`]
    }
    return null
  }

  useEffect(() => {
    dispatch(getMetadata(learningLanguage))
  }, [learningLanguage])

  const showStoryElo = history.location.pathname.includes('practice')
  const showFlashcardElo = hiddenFeatures && history.location.pathname.includes('flashcards')
  const hasChosenLearningLanguage = user?.user?.last_used_language !== null

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
      <Navbar className={getBackgroundColor()} style={{ paddingLeft: '0.5em' }}>
        <Tour />
        <div>
          {smallWindow && (
            <Icon
              name="bars"
              size="big"
              onClick={() => dispatch(sidebarSetOpen(!open))}
              className="sidebar-hamburger tour-sidebar"
              style={{ color: 'black' }}
              data-cy="hamburger"
            />
          )}
        </div>
        <Navbar.Collapse>
          <Nav className="mr-auto">
            <div className="navbar-container">
              <Link to="/home">
                <Navbar.Brand className="navbar-revita-logo tour-start-finish">
                  <img
                    src={images.navbarLogo}
                    alt="revita logo"
                    width="70"
                    style={{
                      filter: 'brightness(0%) sepia(100) saturate(100) hue-rotate(0deg)',
                    }}
                  />
                  {hiddenFeatures && <sup> &beta;</sup>}
                </Navbar.Brand>
              </Link>

              {!smallWindow && (
                <>
                  <Link to="/home">
                    <Navbar.Brand className="navbar-text-item">
                      <FormattedMessage id="Home" />
                    </Navbar.Brand>
                  </Link>
                  <Link data-cy="navbar-library-button" to="/library">
                    <Navbar.Brand className="navbar-text-item">
                      <FormattedMessage id="Library" />
                    </Navbar.Brand>
                  </Link>
                  <Link to="/flashcards">
                    <Navbar.Brand className="navbar-text-item">
                      <FormattedMessage id="Flashcards" />
                    </Navbar.Brand>
                  </Link>
                  <NavDropdown
                    data-cy="navbar-groups-dropdown"
                    title={
                      <Navbar.Brand className="navbar-dropdown-text">
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
            </div>
          </Nav>

          <Nav>
            <div className="navbar-container">
              <Offline className="navbar-basic-item" polling={{ timeout: 20000 }}>
                <Icon name="broken chain" size="large" style={{ color: '#ff944d' }} />
              </Offline>
              <Navbar.Text onClick={handleEloClick}>
                {showStoryElo && (
                  <div className="navbar-basic-item">
                    <Icon name="star outline" style={{ margin: 0, width: '16px' }} /> {storyElo}
                  </div>
                )}
                {showFlashcardElo && (
                  <div className="navbar-basic-item">
                    <img src={images.flashcardIcon} alt="three cards" width="16px" /> {flashcardElo}
                  </div>
                )}
              </Navbar.Text>

              {!smallWindow && (
                <>
                  <NavDropdown
                    className="navbar-dropdown-icon-cont"
                    title={
                      <Icon
                        className="navbar-dropdown-icon"
                        data-cy="navbar-user-dropdown"
                        name="user outline"
                        size="large"
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
                        className="tour-navbar-learning-language navbar-basic-icon navbar-flag"
                        style={{
                          height: '21px',
                          border: '1px solid black',
                        }}
                        src={getLearningLanguageFlag()}
                        alt="learningLanguageFlag"
                      />
                    </Link>
                  )}

                  <NavDropdown
                    data-cy="navbar-info-dropdown"
                    className="navbar-dropdown-icon-cont"
                    title={
                      <NavbarIcon
                        imgSrc={images.infoIcon}
                        altText="info icon"
                        extraClass="navbar-dropdown-icon"
                      />
                    }
                  >
                    <NavDropdown.Item
                      data-cy="navbar-about-button"
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
                    <NavDropdown.Item className="navbar-external-link" onClick={handleTourStart}>
                      <FormattedMessage id="start-tour" />
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item
                      className="navbar-external-link"
                      href="https://www2.helsinki.fi/en/projects/revita-language-learning-and-ai/faq"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FormattedMessage id="faq" />
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
                        <NavDropdown.Item data-cy="navbar-tc-button" style={{ fontSize: '0.8em' }}>
                          <span>
                            {intl.formatMessage({ id: 'terms-and-conditions' })}
                            <br /> & {intl.formatMessage({ id: 'privacy-policy' })}
                          </span>
                        </NavDropdown.Item>
                      }
                    />
                  </NavDropdown>
                </>
              )}

              <a
                className="navbar-basic-icon"
                style={{ display: 'table-cell' }}
                href="https://www2.helsinki.fi/en/projects/revita-language-learning-and-ai/news"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  style={{
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                >
                  <NavbarIcon imgSrc={images.bellIcon} altText="bell icon" />
                  {numUnreadNews > 0 ? (
                    <Popup
                      position="top right"
                      content={
                        <FormattedMessage
                          id="news-bell-info-popup-text"
                          values={{ numUnreadNews }}
                        />
                      }
                      trigger={
                        <Label
                          onClick={handleNewsClick}
                          className="navbar-news-label"
                          color="red"
                          size="mini"
                          floating
                        >
                          <span>{numUnreadNews}</span>
                        </Label>
                      }
                    />
                  ) : null}
                </span>
              </a>

              <Link
                to="/profile/settings"
                data-cy="navbar-settings-button"
                className="navbar-basic-icon"
              >
                <NavbarIcon imgSrc={images.settingsIcon} altText="gear icon" />
              </Link>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Headroom>
  )
}
