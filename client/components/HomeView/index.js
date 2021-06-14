import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import { images } from 'Utilities/common'
import { useDispatch, useSelector } from 'react-redux'
import { getGroups } from 'Utilities/redux/groupsReducer'

import useWindowDimensions from 'Utilities/windowDimensions'
import Footer from 'Components/Footer'
import AddStoryModal from 'Components/AddStoryModal'
import MedalSummary from './MedalSummary'
import PracticeModal from './PracticeModal'
import EloChart from './EloChart'
import LeaderboardSummary from './LeaderboardSummary'

const PracticeButton = props => {
  return (
    <Button
      className="tour-practice-now home-btn-wide"
      style={{
        backgroundImage: `url(${images.practiceNow})`,
      }}
      {...props}
    >
      <span style={{ fontSize: '1.5em' }}>
        <FormattedMessage id="practice-now" />
      </span>
    </Button>
  )
}

const AddStoriesButton = props => {
  return (
    <Button
      className="tour-add-new-stories home-btn-wide"
      style={{
        backgroundImage: `url(${images.addStory})`,
      }}
      {...props}
    >
      <span style={{ fontSize: '1.5em' }}>
        <FormattedMessage id="add-your-stories" />
      </span>
    </Button>
  )
}

const LibraryButton = props => {
  const history = useHistory()
  const handleClick = () => {
    history.push('/library')
  }

  return (
    <Button
      onClick={handleClick}
      className="tour-library home-btn-wide"
      style={{
        backgroundImage: `url(${images.library})`,
        width: '49.5%',
        float: 'left',
      }}
      {...props}
    >
      <span style={{ fontSize: '1.5em' }}>
        <FormattedMessage id="Library" />
      </span>
    </Button>
  )
}

const FlashcardsButton = props => {
  const history = useHistory()
  const handleClick = () => {
    history.push('/flashcards')
  }

  return (
    <Button
      className="tour-flashcards home-btn-wide"
      onClick={handleClick}
      style={{
        backgroundImage: `url(${images.flashcards})`,
        width: '49.5%',
        float: 'right',
      }}
      {...props}
    >
      <span style={{ fontSize: '1.5em' }}>
        <FormattedMessage id="Flashcards" />
      </span>
    </Button>
  )
}

const TestsButton = props => {
  const history = useHistory()
  const handleClick = () => {
    history.push('/tests')
  }
  return (
    <Button
      className="home-btn-wide"
      onClick={handleClick}
      style={{
        backgroundImage: `url(${images.tests})`,
      }}
      {...props}
    >
      <span style={{ fontSize: '1.5em' }}>
        <FormattedMessage id="Tests" />
      </span>
    </Button>
  )
}

const HomeView = () => {
  const { width } = useWindowDimensions()
  const bigScreen = width > 740
  const showFooter = width > 800
  const dispatch = useDispatch()
  const { hasTests } = useSelector(({ metadata }) => metadata)
  const { groups } = useSelector(({ groups }) => groups)
  const AtLeastOneTestEnabled = groups.some(e => e.test_deadline - Date.now() > 0)

  useEffect(() => {
    dispatch(getGroups())
  }, [])

  return (
    <div className="cont-tall cont flex-col auto gap-row-sm">
      <div className="grow flex-col">
        {bigScreen ? (
          <div className="grow flex-col space-between gap-row-nm">
            <div className="flex pb-nm">
              <div className="flex-col gap-row-sm" style={{ flexGrow: 2 }}>
                <PracticeModal trigger={<PracticeButton data-cy="practice-now" />} />
                <AddStoryModal trigger={<AddStoriesButton />} />

                <div>
                  <LibraryButton data-cy="library-button" />
                  <FlashcardsButton />
                </div>

                {hasTests && AtLeastOneTestEnabled && <TestsButton data-cy="tests-button" />}
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
          </div>
        ) : (
          <div className="pb-nm">
            <div className="flex gap-col-sm grow-children">
              <PracticeModal trigger={<PracticeButton data-cy="practice-now" />} />
              <AddStoryModal trigger={<AddStoriesButton />} />
            </div>
            <div className="flex gap-col-sm grow-children" style={{ marginTop: '0.5rem' }}>
              <LibraryButton />
              <FlashcardsButton />
            </div>
            <div className="flex gap-col-sm grow-children" style={{ marginTop: '0.5rem' }}>
              {hasTests && AtLeastOneTestEnabled && <TestsButton data-cy="tests-button" />}
            </div>
            <hr />
            <EloChart width="100%" />
            <hr />
            <LeaderboardSummary />
            <hr />
            <MedalSummary />
          </div>
        )}
        {showFooter && <Footer />}
      </div>
    </div>
  )
}

export default HomeView
