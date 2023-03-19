import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useWindowDimensions from 'Utilities/windowDimensions'
import Draggable from 'react-draggable'
import { Icon } from 'semantic-ui-react'
import { closeEncouragement } from 'Utilities/redux/encouragementsReducer'
import { getLeaderboards } from 'Utilities/redux/leaderboardReducer'
import { getIncompleteStories } from 'Utilities/redux/incompleteStoriesReducer'
import HomeViewFlashcardEncouragement from 'Components/NewEncouragements/SubComponents/HomeViewFlashcardEncouragement'
import UnseenStoriesInGroup from './SubComponents/UnseenStoriesInGroup'
import LatestIncompleteStory from './SubComponents/LatestIncompleteStory'
import TurnOffRecommendations from './SubComponents/TurnOffRecommendations'
import LeaderboardEncouragement from './SubComponents/LeaderboardEncouragement'
import DailyStoriesEncouragement from './SubComponents/DailyStoriesEncouragement'
import DailyStoriesDraggable from './SubComponents/DailyStoriesDraggable'
import WelcomeBackEncouragement from './SubComponents/WelcomeBackEncouragement'

const Recommender = () => {
  const userData = useSelector(state => state.user.data.user)
  const { enable_recmd } = userData
  const learningLanguage = userData ? userData.last_used_language : null
  const { cachedStories, pending: metadataPending } = useSelector(({ metadata }) => metadata)
  const { open } = useSelector(({ encouragement }) => encouragement)
  const [dailyStoriesDraggableIsOpen, setDailyStoriesDraggableIsOpen] = useState(false)
  const bigScreen = useWindowDimensions().width > 700
  const dispatch = useDispatch()
  // See default_activity_modal row 260
  // This is probably necessary to get the data from BE??
  // Or would it be better to dispatch these in the individual sub components?
  useEffect(() => {
    dispatch(
      getIncompleteStories(learningLanguage, {
        sort_by: 'access',
      })
    )
    dispatch(getLeaderboards())
    /*
    dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
    if (storyBlueCards?.length > 0) {
      setPrevBlueCards(storyBlueCards[0])
    } else {
      setPrevBlueCards([])
    } */
  }, [])

  const handleDailyStoriesClick = () => {
    if (dailyStoriesDraggableIsOpen) {
      setDailyStoriesDraggableIsOpen(false)
      return
    }
    setDailyStoriesDraggableIsOpen(true)
  }

  const handleCloseClick = () => {
    dispatch(closeEncouragement())
  }

  if (open) {
    return (
      <>
        <Draggable cancel=".interactable">
          <div className={bigScreen ? 'draggable-encouragement' : 'draggable-encouragement-mobile'}>
            <Icon
              className="interactable"
              style={{
                cursor: 'pointer',
                marginBottom: '.25em',
              }}
              size="large"
              name="close"
              onClick={handleCloseClick}
            />
            <WelcomeBackEncouragement />
            <LeaderboardEncouragement />
            <DailyStoriesEncouragement handleDailyStoriesClick={handleDailyStoriesClick} />
            <LatestIncompleteStory enable_recmd={enable_recmd} />
            <HomeViewFlashcardEncouragement />
            <UnseenStoriesInGroup />
            <TurnOffRecommendations />
          </div>
        </Draggable>
        <DailyStoriesDraggable
          cachedStories={cachedStories}
          bigScreen={bigScreen}
          open={dailyStoriesDraggableIsOpen}
          setOpen={setDailyStoriesDraggableIsOpen}
        />
      </>
    )
  }
  return null
}

export default Recommender
