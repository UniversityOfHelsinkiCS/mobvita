import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router'
import { FormattedMessage } from 'react-intl'
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

const HomeviewButton = ({ imgSrc, altText, translationKey, handleClick, dataCy, wide }) => {
  return (
    <button
      className={`homeview-btn${wide ? ' homeview-btn-wide' : ' homeview-btn-narrow'}`}
      type="button"
      onClick={handleClick}
      data-cy={dataCy}
    >
      <div
        className={`align-center ${!wide ? 'flex-col space-evenly' : 'flex justify-center'}`}
        style={{ height: '100%' }}
      >
        <div className="homeview-btn-text">
          <FormattedMessage id={translationKey} />
        </div>
        {!wide && <img src={imgSrc} alt={altText} style={{ maxWidth: '65%', maxHeight: '65%' }} />}
      </div>
    </button>
  )
}

const HomeviewButtons = ({ setPracticeModalOpen, setAddStoryModalOpen, aTestIsEnabled }) => {
  const history = useHistory()
  const { hasTests, hasAdaptiveTests } = useSelector(({ metadata }) => metadata)

  return (
    <div className="home-btns-cont">
      <div className="add-new-stories-btn-cont tour-add-new-stories">
        <HomeviewButton
          wide
          translationKey="add-your-stories"
          handleClick={() => setAddStoryModalOpen(true)}
          dataCy="add-story-button"
        />
      </div>
      <div className="practice-btn-cont tour-practice-now">
        <HomeviewButton
          imgSrc={images.randomNew}
          altText="two dices"
          translationKey="practice-now"
          handleClick={() => setPracticeModalOpen(true)}
          dataCy="practice-now"
        />
      </div>
      <div className="library-btn-cont tour-library">
        <HomeviewButton
          imgSrc={images.libraryNew}
          altText="two books in a pile"
          translationKey="Library"
          handleClick={() => history.push('/library')}
          dataCy="library-button"
        />
      </div>

      <div className="flashcards-btn-cont tour-flashcards">
        <HomeviewButton
          imgSrc={images.flashcardsNew}
          altText="three playing cards"
          translationKey="Flashcards"
          handleClick={() => history.push('/flashcards')}
        />
      </div>

      {hasTests && aTestIsEnabled && (
        <div className="test-btn-cont">
          <HomeviewButton
            imgSrc={images.scienceNew}
            altText="<insert alt text here>"
            translationKey="Tests"
            handleClick={() => history.push('/tests')}
            dataCy="tests-button"
          />
        </div>
      )}

      {hasAdaptiveTests && (
        <div className="adaptive-test-btn-cont">
          <HomeviewButton
            wide
            translationKey="adaptive-test"
            handleClick={() => history.push('/adaptive-test')}
          />
        </div>
      )}
    </div>
  )
}

const HomeView = () => {
  const { width } = useWindowDimensions()
  const bigScreen = width > 730
  const showFooter = width > 800
  const dispatch = useDispatch()
  const { groups } = useSelector(({ groups }) => groups)
  const aTestIsEnabled = groups.some(e => e.test_deadline - Date.now() > 0)

  const [practiceModalOpen, setPracticeModalOpen] = useState(false)
  const [addStoryModalOpen, setAddStoryModalOpen] = useState(false)

  useEffect(() => {
    dispatch(getGroups())
  }, [])

  return (
    <div className="cont-tall cont flex-col auto gap-row-sm pt-lg">
      <AddStoryModal open={addStoryModalOpen} setOpen={setAddStoryModalOpen} />
      <PracticeModal open={practiceModalOpen} setOpen={setPracticeModalOpen} />
      <div className="grow flex-col">
        {bigScreen ? (
          <div className="grow flex-col space-between gap-row-nm">
            <div className="flex pb-nm">
              <HomeviewButtons
                setPracticeModalOpen={setPracticeModalOpen}
                setAddStoryModalOpen={setAddStoryModalOpen}
                aTestIsEnabled={aTestIsEnabled}
              />
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
            <HomeviewButtons
              setPracticeModalOpen={setPracticeModalOpen}
              setAddStoryModalOpen={setAddStoryModalOpen}
              aTestIsEnabled={aTestIsEnabled}
            />
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
