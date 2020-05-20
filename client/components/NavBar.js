import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Navbar } from 'react-bootstrap'
import Headroom from 'react-headroom'
import { Icon } from 'semantic-ui-react'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import { hiddenFeatures, images } from 'Utilities/common'

export default function NavBar({ history }) {
  const { user } = useSelector(({ user }) => ({ user: user.data }))
  const open = useSelector(({ sidebar }) => sidebar.open)
  const dispatch = useDispatch()
  const intl = useIntl()

  const smallWindow = useWindowDimensions().width < 640

  const handleEloClick = () => {
    history.push('/profile/progress')
  }

  const handleSettingClick = () => {
    history.push('/profile/settings')
  }

  const showStoryElo = history.location.pathname.includes('practice')
  const showFlashcardElo = history.location.pathname.includes('flashcards')

  const storyElo = (user && user.user.exercise_history && user.user.exercise_history.length > 0)
    ? user.user.exercise_history[user.user.exercise_history.length - 1].score
    : 0

  const flashcardElo = (user && user.user.flashcard_history && user.user.flashcard_history.length > 0)
    ? user.user.flashcard_history[user.user.flashcard_history.length - 1].score
    : 0

  const navBarStyle = smallWindow
    ? {}
    : { position: 'fixed', top: 0, width: '100%', zIndex: '100' }

  const blackToWhiteFilter = 'invert(92%) sepia(94%) saturate(29%) hue-rotate(251deg) '
    + 'brightness(108%) contrast(100%)'

  return (
    <Headroom
      disableInlineStyles={!smallWindow}
      style={navBarStyle}
    >
      <Navbar style={{ paddingLeft: '0.5em' }}>
        <div style={{ display: 'flex' }}>
          <Icon
            name="bars"
            size="big"
            onClick={() => dispatch(sidebarSetOpen(!open))}
            className="sidebar-hamburger"
            style={{ color: 'white' }}
            data-cy="hamburger"
          />
          <Navbar.Brand
            style={{ color: 'white', marginLeft: '0.5em', cursor: 'pointer' }}
            onClick={() => history.push('/home')}
          >

            Revita{hiddenFeatures && <sup> &beta;</sup>}
          </Navbar.Brand>
        </div>
        {user && (
          <div>
            <Navbar.Text style={{ color: 'white', marginRight: '1em', cursor: 'pointer' }} onClick={handleEloClick}>
              {showStoryElo && <div><Icon name="star outline" style={{ margin: 0 }} /> {storyElo}</div>}
              {showFlashcardElo
                && (
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

            <Icon name="setting" style={{ color: 'white', cursor: 'pointer' }} onClick={handleSettingClick} />
          </div>
        )}
      </Navbar>
    </Headroom>
  )
}
