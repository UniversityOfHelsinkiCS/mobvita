import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navbar } from 'react-bootstrap'
import Headroom from 'react-headroom'
import { Icon, Button } from 'semantic-ui-react'
import { Link, useHistory } from 'react-router-dom'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import { hiddenFeatures, images } from 'Utilities/common'
import { Offline } from 'react-detect-offline'
import { FormattedMessage } from 'react-intl'
import Tour from './Tour'

export default function NavBar() {
  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const open = useSelector(({ sidebar }) => sidebar.open)
  const dispatch = useDispatch()
  const history = useHistory()

  const smallWindow = useWindowDimensions().width < 640

  const handleEloClick = () => {
    history.push('/profile/progress')
  }

  console.log(user)

  const handleTourStart = () => {
    dispatch(sidebarSetOpen(false))
    dispatch({ type: 'RESTART' })
  }

  const handleSettingClick = () => {
    history.push('/profile/settings')
  }

  const showStoryElo = history.location.pathname.includes('practice')
  const showFlashcardElo = hiddenFeatures && history.location.pathname.includes('flashcards')
  const hasChosenLearningLanguage = user?.user?.last_used_language !== null
  const isNewUser = true ? user?.user?.total_time_spent < 0.5 : false

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
          <Icon
            name="bars"
            size="big"
            onClick={() => dispatch(sidebarSetOpen(!open))}
            className="sidebar-hamburger tour-sidebar"
            style={{ color: 'white', marginBottom: '0.3em' }}
            data-cy="hamburger"
          />
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
                marginLeft: '0.5em',
                marginTop: '0.18em',
                cursor: 'pointer',
              }}
            >
              Revita{hiddenFeatures && <sup> &beta;</sup>}
            </Navbar.Brand>
          </Link>
        </div>
        {isNewUser && hasChosenLearningLanguage && (
          <Button type="button" onClick={handleTourStart} className="tour-start">
            <Icon name="info circle" /> <FormattedMessage id="start-tour" />
          </Button>
        )}
        <Tour />
        {user && (
          <div>
            <Navbar.Text
              style={{ color: 'white', marginRight: '1em', cursor: 'pointer' }}
              onClick={handleEloClick}
            >
              {showStoryElo && (
                <div>
                  <Icon name="star outline" style={{ margin: 0 }} /> {storyElo}
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
                    }}
                  />
                  {flashcardElo}
                </div>
              )}
            </Navbar.Text>
            <Offline polling={{ timeout: 20000 }}>
              <Icon name="broken chain" size="large" style={{ color: '#ff944d' }} />
            </Offline>
            <Icon
              name="setting"
              size="big"
              style={{ color: 'white', cursor: 'pointer' }}
              onClick={handleSettingClick}
            />
          </div>
        )}
      </Navbar>
    </Headroom>
  )
}
