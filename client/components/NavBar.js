import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navbar, Nav, NavDropdown, NavItem, Button } from 'react-bootstrap'
import Headroom from 'react-headroom'
import { Icon, Label, Popup } from 'semantic-ui-react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { logout, calculateIRTScore, getSelf, setIrtDummyScore } from 'Utilities/redux/userReducer'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { getMetadata } from 'Utilities/redux/metadataReducer'
import {
  hideIcon,
  openEncouragement,
  hideFCIcon,
  openFCEncouragement,
  showIcon,
  closeEncouragement,
} from 'Utilities/redux/encouragementsReducer'
import { getNews } from 'Utilities/redux/newsReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import {
  hiddenFeatures,
  capitalize,
  images,
  learningLanguageSelector,
  getBackgroundColor,
  supportedLearningLanguages,
} from 'Utilities/common'
import { Offline } from 'react-detect-offline'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { setAnnotationsVisibility } from 'Utilities/redux/annotationsReducer'

import TermsAndConditions from 'Components/StaticContent/TermsAndConditions'
import EncouragementButton from 'Components/Encouragements/EncouragementButton'
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
  const { irtCalculationPending, pending: userPending, irt_dummy_score } = useSelector(({ user }) => user)
  const { numUnreadNews } = useSelector(({ metadata }) => metadata)
  const { sessionId } = useSelector(({ snippets }) => snippets)
  const { show, open: encOpen, fcShow, fcOpen } = useSelector(({ encouragement }) => encouragement)
  const { focused: story, pending: storyPending } = useSelector(({ stories }) => stories)

  const open = useSelector(({ sidebar }) => sidebar.open)
  const storyLanguage = storyPending==false & story != undefined ? story.language : undefined
  const learningLanguage = useSelector(learningLanguageSelector)

  const dispatch = useDispatch()
  const history = useHistory()
  const smallWindow = useWindowDimensions().width < 700
  const intl = useIntl()
  const handleEloClick = () => {
    history.push('/profile/progress')
  }
  const isTeacher = user?.user.is_teacher
  const check = history.location.pathname
  const isMajorLanguage = supportedLearningLanguages?.major.includes(
    learningLanguage?.toLowerCase()
  )

  const irt_support_languages = ['Russian']

  const signOut = () => {
    dispatch(logout())
    history.push('/')
  }
  const showProfileDropdown = useSelector(state => state.dropdown.showProfileDropdown)

  const handleProfileButtonCLick = () => {
    if (showProfileDropdown) {
      dispatch({ type: 'CLOSE_PROFILE_DROPDOWN' })
    } else {
      dispatch({ type: 'SHOW_PROFILE_DROPDOWN' })
    }
  }

  const handleTourStart = () => {
    if (history.location.pathname.includes('progress')) {
      dispatch({ type: 'SHOW_PROFILE_DROPDOWN' })
      dispatch({ type: 'PROGRESS_TOUR_RESTART' })
    } else if (history.location.pathname.includes('lessons') && hiddenFeatures) {
      dispatch(sidebarSetOpen(false))
      dispatch({ type: 'LESSONS_TOUR_RESTART' })
    } else if (history.location.pathname.includes('library')) {
      dispatch(sidebarSetOpen(false))
      dispatch({ type: 'LIBRARY_TOUR_RESTART' })
    } else if (history.location.pathname.includes('preview') && hiddenFeatures) {
      dispatch(sidebarSetOpen(false))
      dispatch({ type: 'PRACTICE_TOUR_RESTART' })
    } else if (history.location.pathname.includes('/practice') && hiddenFeatures) {
      dispatch(sidebarSetOpen(false))
      dispatch({ type: 'PRACTICE_TOUR_ALTERNATIVE' })
    } else {
      dispatch(sidebarSetOpen(false))
      dispatch({ type: 'TOUR_RESTART' })
    }
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

  const confirmNewsClick = (event, url) => {
    const confirmationMessage = `${intl.formatMessage({ id: 'news-redirection-message' })}: ${url}`
    if (window.confirm(confirmationMessage)) {
      return true
    }
    event.preventDefault()
  }

  useEffect(() => {
    dispatch(setIrtDummyScore(undefined))
    dispatch(calculateIRTScore(learningLanguage))
  }, [sessionId])

  useEffect(() => {
    if (!irtCalculationPending) dispatch(getSelf())
  }, [irtCalculationPending])

  useEffect(() => {
    if (!userPending && irt_dummy_score == undefined) {
      let irtScore =
        user && user.user.irt_score_history && user.user.irt_score_history.length > 0
          ? user.user.irt_score_history[user.user.irt_score_history.length - 1].score
          : undefined
      dispatch(setIrtDummyScore(irtScore))
    }
  }, [user])

  useEffect(() => {
    if (check.includes('home') && !user?.user.enable_recmd) {
      dispatch(showIcon())
      dispatch(closeEncouragement())
      return
    }
    if (show) {
      dispatch(hideIcon())
    }
    if (fcShow) {
      dispatch(hideFCIcon())
    }
    if (check.includes('welcome')) {
      dispatch(openEncouragement())
      return
    }
    dispatch(openFCEncouragement())
  }, [check])

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

  const get_student_ability_score_component = () => {
    if (storyLanguage == undefined){
      return <div/>
    } else {
      let ability_score = storyElo
      let grammar_score_type = 'elo'
      if (irt_support_languages.includes(storyLanguage)){
        ability_score = irtCalculationPending ? '...' : irt_dummy_score != undefined ? Math.round(irt_dummy_score) : '...'
        grammar_score_type = 'irt'
      }
      return <Popup
        position="top center"
        content={<FormattedHTMLMessage id={"explanations-popup-story-" + grammar_score_type}/>}
        trigger={
          <div className="navbar-basic-item">
            <Icon name="star outline" style={{ margin: 0, width: '16px' }} />
            {ability_score}
          </div>
        }
      />
    }
  }

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
                <Navbar.Brand
                  data-cy="revita-logo"
                  className="navbar-revita-logo tour-start-finish"
                >
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
                    <Navbar.Brand
                      data-cy="goto-library"
                      className="navbar-text-item library-tour-start"
                    >
                      <FormattedMessage id="Library" />
                    </Navbar.Brand>
                  </Link>
                  <Link to="/flashcards">
                    <Navbar.Brand className="navbar-text-item">
                      <FormattedMessage id="Flashcards" />
                    </Navbar.Brand>
                  </Link>
                  <Link
                    data-cy="navbar-groups-button"
                    to={isTeacher ? '/groups/teacher' : '/groups/student'}
                  >
                    <Navbar.Brand className="navbar-text-item">
                      <FormattedMessage id="groups" />
                    </Navbar.Brand>
                  </Link>
                </>
              )}
            </div>
          </Nav>

          <Nav className="mr-auto">
            <div className="navbar-container">
              <Navbar.Text
                onClick={handleEloClick}
                onKeyDown={() => dispatch(setAnnotationsVisibility(true))}
              >
                {showStoryElo && (
                  get_student_ability_score_component()
                  // <Popup
                  //   position="top center"
                  //   // content={intl.formatMessage({ id: 'explanations-popup-story-elo' })}
                  //   content={<FormattedHTMLMessage id="explanations-popup-story-elo" />}
                  //   trigger={
                  //     <div className="navbar-basic-item">
                  //       <Icon name="star outline" style={{ margin: 0, width: '16px' }} />
                  //       {  }
                  //       {!irt_support_languages.includes(learningLanguage) ? storyElo : irtCalculationPending ? '...' : irt_dummy_score != undefined ? Math.round(irt_dummy_score) : '...'}
                  //       {/* {storyElo} */}
                  //     </div>
                  //   }
                  // />
                )}
                {showFlashcardElo && (
                  <Popup
                    position="top center"
                    // content={intl.formatMessage({ id: 'explanations-popup-flashcard-elo' })}
                    content={<FormattedHTMLMessage id="explanations-popup-flashcard-elo" value={{ score_type: 'ELO' }}/>}
                    trigger={
                      <div className="navbar-basic-item">
                        <img src={images.flashcardIcon} alt="three cards" width="16px" />{' '}
                        {flashcardElo}
                      </div>
                    }
                  />
                )}
              </Navbar.Text>
            </div>
          </Nav>

          <Nav>
            <div className="navbar-container" style={{ width: '90%' }}>
              <Offline className="navbar-basic-item" polling={{ timeout: 20000 }}>
                <Icon name="broken chain" size="large" style={{ color: '#ff944d' }} />
              </Offline>
              {show && !encOpen && (
                <EncouragementButton handleClick={() => dispatch(openEncouragement())} />
              )}
              {fcShow && !fcOpen && (
                <EncouragementButton handleClick={() => dispatch(openFCEncouragement())} />
              )}

              {!smallWindow && (
                <>
                  <Button className="tour-button" onClick={handleTourStart}>
                    <img src={images.direction} alt="direction icon" width="21" height="21" />
                  </Button>

                  <NavDropdown
                    className="navbar-dropdown-icon-cont"
                    onClick={handleProfileButtonCLick}
                    show={showProfileDropdown}
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
                        <span className="bold user-icon" style={{ padding: '1.5em' }}>
                          {user.user.username}
                        </span>
                        <NavDropdown.Divider />
                        <NavDropdown.Item
                          className="profile-button"
                          as={Link}
                          to="/profile/progress"
                        >
                          <FormattedMessage id="Profile" />
                        </NavDropdown.Item>
                        <NavDropdown.Item data-cy="navbar-logout-button" onClick={signOut}>
                          <FormattedMessage id="sign-out" />
                        </NavDropdown.Item>
                      </>
                    )}
                  </NavDropdown>

                  {user && user.user.last_used_language && (
                    <span style={{ position: 'relative', cursor: 'pointer' }}>
                      <Link to="/learningLanguage">
                        <img
                          className="tour-navbar-learning-language navbar-basic-icon navbar-flag"
                          src={getLearningLanguageFlag()}
                          alt="learningLanguageFlag"
                        />
                        {!isMajorLanguage && (
                          <Popup
                            position="top right"
                            content={
                              <FormattedMessage
                                id="beta-language-warning"
                                values={{ language: user.user.last_used_language }}
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
                                <span>&beta;</span>
                              </Label>
                            }
                          />
                        )}
                      </Link>
                    </span>
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

              <Popup
                trigger={
                  <a
                    className="navbar-basic-icon"
                    style={{ display: 'table-cell' }}
                    href="https://www2.helsinki.fi/en/projects/revita-language-learning-and-ai/news"
                    onClick={event => {
                      confirmNewsClick(
                        event,
                        'https://www2.helsinki.fi/en/projects/revita-language-learning-and-ai/news'
                      )
                    }}
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
                        <Label
                          onClick={handleNewsClick}
                          className="navbar-news-label"
                          color="red"
                          size="mini"
                          floating
                        >
                          <span>{numUnreadNews}</span>
                        </Label>
                      ) : null}
                    </span>
                  </a>
                }
                content={
                  <FormattedMessage id="news-bell-info-popup-text" values={{ numUnreadNews }} />
                }
                on="hover"
                position="bottom right"
              />

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
