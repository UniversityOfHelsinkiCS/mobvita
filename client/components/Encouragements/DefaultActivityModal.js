import React, { useEffect, useState } from 'react'
import { Popup, Icon } from 'semantic-ui-react'
import { useIntl, FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import { images, dictionaryLanguageSelector, backgroundColors } from 'Utilities/common'
import { showIcon, closeEncouragement } from 'Utilities/redux/encouragementsReducer'
import { useDispatch, useSelector } from 'react-redux'
import useWindowDimensions from 'Utilities/windowDimensions'
import Draggable from 'react-draggable'
import { updateEnableRecmd } from 'Utilities/redux/userReducer'
import { getStoriesBlueFlashcards } from 'Utilities/redux/flashcardReducer'
import { getIncompleteStories } from 'Utilities/redux/incompleteStoriesReducer'
import { getLeaderboards } from 'Utilities/redux/leaderboardReducer'
import { Form, Button } from 'react-bootstrap'
import DailyStories from './DailyStories'

const DefaultActivityModal = ({
  open,
  storiesCovered,
  incompleteStories,
  pending,
  learningLanguage,
  enable_recmd,
  username,
  welcomeBack = false,
}) => {
  const intl = useIntl()
  const [latestIncompleteStory, setLatestIncompleteStory] = useState(null)
  const [storiesToReview, setStoriesToReview] = useState([])
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { storyBlueCards, storyCardsPending } = useSelector(({ flashcards }) => flashcards)
  const [prevBlueCards, setPrevBlueCards] = useState(null)
  const [recmdList, setRecmdList] = useState([])
  const { user_rank } = useSelector(({ leaderboard }) => leaderboard.data)
  const { cachedStories, pending: metadataPending } = useSelector(({ metadata }) => metadata)
  const { width } = useWindowDimensions()
  const [openDailyStories, setOpenDailyStories] = useState(false)
  const [unseenInGroup, setUnseenInGroup] = useState(null)
  const stories = useSelector(({ stories }) => stories.data)
  const [userRanking, setUserRanking] = useState(null)
  const [sharedStory, setSharedStory] = useState(null)
  const { pending: userPending } = useSelector(({ user }) => user)
  const dispatch = useDispatch()
  const bigScreen = width > 700

  const dailyStoriesEncouragement = listLen => {
    return (
      <div className="pt-md">
        <div
          className="flex enc-message-body"
          style={{ alignItems: 'center', backgroundColor: backgroundColors[listLen % 3] }}
        >
          <img
            src={images.library}
            alt="pile of books"
            style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
          />
          <div>
            <div className="flex space-between">
              <div>
                <FormattedMessage id="daily-stories" />
                &nbsp;
                <FormattedMessage id="daily-stories-explanation" />
              </div>
              <Button onClick={() => setOpenDailyStories(true)} style={{ marginLeft: '.5rem' }}>
                <FormattedMessage id="show-daily-stories-button" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const fillList = () => {
    let initList = []
    if (userRanking) {
      initList = initList.concat(
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{ alignItems: 'center', backgroundColor: backgroundColors[initList.length % 3] }}
          >
            <img
              src={images.encTrophy}
              alt="encouraging trophy"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedHTMLMessage
                id="leaderboard-ranking-encouragement"
                values={{ userRanking }}
              />
              &nbsp;
              <Link className="interactable" to="/leaderboard">
                <FormattedMessage id="leaderboard-link-encouragement" />
              </Link>
              !
              <br />
              <FormattedMessage id="practice-makes-perfect" />
            </div>
          </div>
        </div>
      )
    }
    if (sharedStory) {
      initList = initList.concat(
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{ alignItems: 'center', backgroundColor: backgroundColors[initList.length % 3] }}
          >
            <img
              src={images.exclamationMark}
              alt="exclamation mark"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedHTMLMessage id="controlled-story-reminder" />
              <br />
              <ul style={{ paddingLeft: 0 }}>
                <li style={{ listStylePosition: 'inside' }}>
                  <Link
                    className="interactable"
                    to={`/stories/${sharedStory._id}/controlled-practice`}
                  >
                    <i>{sharedStory.title}</i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
    if (unseenInGroup) {
      initList = initList.concat(
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{ alignItems: 'center', backgroundColor: backgroundColors[initList.length % 3] }}
          >
            <img
              src={images.exclamationMark}
              alt="exclamation mark"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedHTMLMessage id="new-group-story-encouragement" />
              &nbsp;
              <Link className="interactable" to="/library/group">
                <FormattedMessage id="go-to-group-library-link" />
              </Link>
            </div>
          </div>
        </div>
      )
    }
    if (prevBlueCards?.num_of_rewardable_words >= 5) {
      initList = initList.concat(
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{ alignItems: 'center', backgroundColor: backgroundColors[initList.length % 3] }}
          >
            <img
              src={images.flashcards}
              alt="flashcard batch"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedHTMLMessage
                id="previous-stories-blue-cards"
                values={{
                  nWords: prevBlueCards.num_of_rewardable_words,
                  story: prevBlueCards.title,
                }}
              />
              &nbsp;
              <Link
                className="interactable"
                to={`/flashcards/fillin/test/${prevBlueCards.story_id}`}
              >
                <FormattedMessage id="flashcards-review" />
              </Link>
            </div>
          </div>
        </div>
      )
    }
    if (cachedStories?.length > 0) {
      initList = initList.concat(dailyStoriesEncouragement(initList.length))
    }
    if (latestIncompleteStory && enable_recmd) {
      initList = initList.concat(
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{ alignItems: 'center', backgroundColor: backgroundColors[initList.length % 3] }}
          >
            <img
              src={images.practice}
              alt="weight"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedMessage id="continue-last-story-left-in-the-middle" />
              <br />
              <ul style={{ paddingLeft: 0 }}>
                <li style={{ marginTop: '0.5rem', listStylePosition: 'inside' }}>
                  <Link
                    className="interactable"
                    to={`/stories/${latestIncompleteStory._id}/practice`}
                  >
                    <i>{latestIncompleteStory.title}</i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    }
    if (storiesToReview.length > 0 && enable_recmd) {
      initList = initList.concat(
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{ alignItems: 'center', backgroundColor: backgroundColors[initList.length % 3] }}
          >
            <img
              src={images.magnifyingGlass}
              alt="magnifying glass"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedMessage id="review-recent-stories" />
              <ul style={{ paddingLeft: 0 }}>
                {storiesToReview.map(story => (
                  <li style={{ marginTop: '0.5rem', listStylePosition: 'inside' }}>
                    <Link className="interactable" to={`/stories/${story._id}/review`}>
                      <i>{story.title}</i>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )
    }
    if (initList.length < 1 && cachedStories?.length > 0) {
      initList = initList.concat(dailyStoriesEncouragement(initList.length))
      return initList
    }

    return initList
  }

  useEffect(() => {
    dispatch(
      getIncompleteStories(learningLanguage, {
        sort_by: 'access',
      })
    )
    dispatch(getLeaderboards())
    dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
    if (storyBlueCards?.length > 0) {
      setPrevBlueCards(storyBlueCards[0])
    } else {
      setPrevBlueCards([])
    }
  }, [])

  useEffect(() => {
    if (user_rank < 100) {
      setUserRanking(user_rank + 1)
    }
  }, [user_rank])

  useEffect(() => {
    if (stories) {
      const sharedIncompleteStories = stories.find(
        story => story.shared && !story.has_read && story.control_story
      )
      const unseenStoriesInGroup = stories.find(
        story => story.shared && !story.has_read && story.groups?.length > 0 && !story.control_story
      )
      if (sharedIncompleteStories) {
        setSharedStory(sharedIncompleteStories)
      } else {
        setSharedStory(null)
      }

      if (unseenStoriesInGroup) {
        setUnseenInGroup(unseenStoriesInGroup)
      } else {
        setUnseenInGroup(null)
      }
    }
  }, [stories])

  useEffect(() => {
    if (storyBlueCards?.length > 0) {
      setPrevBlueCards(storyBlueCards[0])
    } else {
      setPrevBlueCards(null)
    }
  }, [storyBlueCards])

  useEffect(() => {
    if (incompleteStories?.length > 0) {
      const readyToReview = incompleteStories.filter(
        story => story.last_snippet_id === story.num_snippets - 1
      )
      const previousStories = []

      for (let i = readyToReview.length - 1; i >= 0 && i >= readyToReview.length - 3; i--) {
        previousStories.push(readyToReview[i])
      }

      setStoriesToReview(previousStories)

      const listOfLatest = incompleteStories.filter(
        story => story.last_snippet_id !== story.num_snippets - 1
      )

      if (listOfLatest.length > 0) {
        setLatestIncompleteStory(listOfLatest[listOfLatest.length - 1])
      } else {
        setLatestIncompleteStory(null)
      }
    } else {
      setStoriesToReview([])
      setLatestIncompleteStory(null)
    }
  }, [incompleteStories])

  useEffect(() => {
    if (!userPending && !storyCardsPending && !pending) {
      setRecmdList(fillList())
    }
  }, [
    userRanking,
    storiesCovered,
    storiesToReview,
    latestIncompleteStory,
    sharedStory,
    prevBlueCards,
    cachedStories,
    unseenInGroup,
  ])

  const closeModal = () => {
    dispatch(showIcon())
    dispatch(closeEncouragement())
  }

  const updatePreferences = () => {
    dispatch(updateEnableRecmd(!enable_recmd))
  }

  if (pending || storyCardsPending || metadataPending || recmdList.length < 1) {
    return null
  }

  if (open) {
    return (
      <>
        <DailyStories
          cachedStories={cachedStories}
          bigScreen={bigScreen}
          open={openDailyStories}
          setOpen={setOpenDailyStories}
        />
        <Draggable cancel=".interactable">
          <div className={bigScreen ? 'draggable-encouragement' : 'draggable-encouragement-mobile'}>
            <div>
              <div className="col-flex">
                {welcomeBack ? (
                  <div className="flex">
                    <div className="col-flex">
                      <div
                        style={{
                          fontWeight: 500,
                          fontSize: '1.4rem',
                          marginBottom: bigScreen ? '1em' : '.5em',
                        }}
                      >
                        {intl.formatMessage({ id: 'welcome-back-encouragement' }, { username })}
                      </div>
                      <>
                        {storiesCovered > 0 && (
                          <div style={{ marginBottom: '.5em' }}>
                            {intl.formatMessage(
                              { id: 'stories-covered-encouragement' },
                              { stories: storiesCovered }
                            )}
                          </div>
                        )}
                      </>
                    </div>
                    <img
                      src={images.balloons}
                      alt="encouraging balloons"
                      className={bigScreen ? 'enc-picture' : 'enc-picture-mobile'}
                    />
                    <Icon
                      className="interactable"
                      style={{
                        cursor: 'pointer',
                        marginBottom: '.25em',
                      }}
                      size="large"
                      name="close"
                      onClick={closeModal}
                    />
                  </div>
                ) : (
                  <div className="flex-reverse">
                    <Icon
                      className="interactable"
                      style={{
                        cursor: 'pointer',
                        marginBottom: '.25em',
                      }}
                      size="large"
                      name="close"
                      onClick={closeModal}
                    />
                  </div>
                )}
                <div className="interactable" style={{ overflow: 'auto', maxHeight: 300 }}>
                  {recmdList.map(recommendation => recommendation)}
                </div>
              </div>
              <div className="flex pt-lg">
                <Form.Group>
                  <Form.Check
                    className="interactable"
                    style={{ marginTop: '0.15em' }}
                    type="checkbox"
                    inline
                    onChange={updatePreferences}
                    checked={!enable_recmd}
                    disabled={userPending}
                  />
                </Form.Group>
                <span style={{ color: '#708090' }}>
                  <FormattedMessage id="never-show-recommendations" />
                </span>
                <Popup
                  className="interactable"
                  content={intl.formatMessage({ id: 'disable-recmd-tooltip' })}
                  trigger={
                    <Icon
                      className="interactable"
                      style={{ marginLeft: '0.5em' }}
                      name="info circle"
                      color="grey"
                    />
                  }
                />
              </div>
            </div>
          </div>
        </Draggable>
      </>
    )
  }

  return null
}

export default DefaultActivityModal
