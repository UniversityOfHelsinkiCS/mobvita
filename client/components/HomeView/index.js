import React from 'react'
import { useHistory } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import { images, hiddenFeatures } from 'Utilities/common'

import useWindowDimensions from 'Utilities/windowDimensions'
import Footer from 'Components/Footer'
import MedalSummary from './MedalSummary'
import PracticeModal from './PracticeModal'
import EloChart from './EloChart'
import LeaderboardSummary from './LeaderboardSummary'

const PracticeButton = props => (
  <Button
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

const FlashcardsButton = props => {
  const history = useHistory()
  const handleClick = () => {
    history.push('/flashcards')
  }

  return (
    <Button
      onClick={handleClick}
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
            <div className="flex-column gap-row-1" style={{ flexGrow: 2 }}>
              <PracticeModal trigger={<PracticeButton data-cy="practice-now" />} />
              <FlashcardsButton />
              {hiddenFeatures && <Button onClick={() => undef()}>hidden breaking thing</Button>}
            </div>
            <div className="vertical-line" />
            {hiddenFeatures ? (
              <div style={{ width: '300px' }}>
                <EloChart width="100%" />
                <hr />
                <MedalSummary />
                <hr />
                <LeaderboardSummary />
              </div>
            ) : (
              <EloChart width="30%" />
            )}
          </div>
        ) : (
          <>
            <div className="flex gap-1 grow-children">
              <PracticeModal trigger={<PracticeButton data-cy="practice-now" />} />
              <FlashcardsButton />
            </div>
            <hr />
            <EloChart width="100%" />
            <hr />
            <MedalSummary />
            <hr />
            <LeaderboardSummary />
            <Button style={{ display: 'none' }} onClick={() => undefun()}>
              hidden breaking thing
            </Button>
          </>
        )}
      </div>
      {bigScreen && <Footer />}
    </div>
  )
}

export default HomeView
