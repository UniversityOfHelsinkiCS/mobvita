import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import { images } from 'Utilities/common'
import { useDispatch } from 'react-redux'
import { getGroups } from 'Utilities/redux/groupsReducer'

import useWindowDimensions from 'Utilities/windowDimensions'
import Footer from 'Components/Footer'
import MedalSummary from './MedalSummary'
import PracticeModal from './PracticeModal'
import EloChart from './EloChart'
import LeaderboardSummary from './LeaderboardSummary'

const PracticeButton = props => (
  <Button
    className="tour-practice-now"
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
      className="tour-flashcards"
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
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getGroups())
  }, [])

  return (
    <div className="grow flex-col space-between gap-row-nm">
      {bigScreen ? (
        <div className="flex pb-nm">
          <div className="flex-col gap-row-sm" style={{ flexGrow: 2 }}>
            <PracticeModal trigger={<PracticeButton data-cy="practice-now" />} />
            <FlashcardsButton />
          </div>
          <div className="vertical-line" />
          <div style={{ width: '300px' }}>
            <EloChart width="100%" />
            <hr />
            <LeaderboardSummary />
            <hr />
            <MedalSummary />
          </div>
        </div>
      ) : (
        <div className="pb-nm">
          <div className="flex gap-col-sm grow-children">
            <PracticeModal trigger={<PracticeButton data-cy="practice-now" />} />
            <FlashcardsButton />
          </div>
          <hr />
          <EloChart width="100%" />
          <hr />
          <LeaderboardSummary />
          <hr />
          <MedalSummary />
        </div>
      )}
      {bigScreen && <Footer />}
    </div>
  )
}

export default HomeView
