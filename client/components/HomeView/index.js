import React from 'react'
import { useHistory } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import { images } from 'Utilities/common'

import useWindowDimensions from 'Utilities/windowDimensions'
import Footer from 'Components/Footer'
import PracticeModal from './PracticeModal'
import EloChart from './EloChart'

// import StoryAddition from 'Components/StoryAddition'

const PracticeButton = props => (
  <Button
    block
    style={{
      backgroundImage: `url(${images.practiceNow})`,
      height: '10em',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
    {...props}
  >
    <FormattedMessage id="practice-now" />
  </Button>
)

const FlashcardsButton = (props) => {
  const history = useHistory()
  const handleClick = () => {
    history.push('/flashcards')
  }

  return (
    <Button
      onClick={handleClick}
      block
      style={{
        backgroundImage: `url(${images.flashcards})`,
        height: '10em',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'black',
      }}
      {...props}
    >
      <FormattedMessage id="Flashcards" />
    </Button>
  )
}

const HomeView = () => {
  const { width } = useWindowDimensions()

  const bigScreen = width > 740

  return (
    <div>
      <div className="component-container">
        {bigScreen ? (
          <div style={{ display: 'flex' }}>
            <div style={{ flexGrow: 2 }}>
              <PracticeModal trigger={<PracticeButton data-cy="practice-now" />} />
              <FlashcardsButton />
              <Button style={{ display: 'none' }} onClick={() => undefun()}>hidden breaking thing</Button>
            </div>
            <EloChart width="30%" />
          </div>
        ) : (
          <>
            <EloChart width="100%" />
            <PracticeModal trigger={<PracticeButton data-cy="practice-now" />} />
            <FlashcardsButton />
            <Button style={{ display: 'none' }} onClick={() => undefun()}>hidden breaking thing</Button>
          </>
        )}
      </div>
      {bigScreen && <Footer />}
    </div>
  )
}

export default HomeView
