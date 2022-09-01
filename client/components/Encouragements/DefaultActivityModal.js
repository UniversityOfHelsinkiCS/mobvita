import React, { useEffect, useState } from 'react'
import { Popup, Icon } from 'semantic-ui-react'
import { useIntl, FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import { images, dictionaryLanguageSelector } from 'Utilities/common'
import { useDispatch, useSelector } from 'react-redux'
import useWindowDimensions from 'Utilities/windowDimensions'
import Draggable from 'react-draggable'
import { updateEnableRecmd } from 'Utilities/redux/userReducer'
import { getStoriesBlueFlashcards } from 'Utilities/redux/flashcardReducer'
import { getIncompleteStories } from 'Utilities/redux/incompleteStoriesReducer'
import { getLeaderboards } from 'Utilities/redux/leaderboardReducer'
import { Form, Button } from 'react-bootstrap'

const DefaultActivityModal = ({
  open,
  setOpen,
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
  const [upperBound, setUpperBound] = useState(3)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { storyBlueCards, storyCardsPending } = useSelector(({ flashcards }) => flashcards)
  const [prevBlueCards, setPrevBlueCards] = useState(null)
  const [recmdList, setRecmdList] = useState([])
  const { user_rank } = useSelector(({ leaderboard }) => leaderboard.data)
  const { width } = useWindowDimensions()
  const stories = useSelector(({ stories }) => stories.data)
  const [userRanking, setUserRanking] = useState(null)
  const [sharedStory, setSharedStory] = useState(null)
  const { pending: userPending } = useSelector(({ user }) => user)
  const dispatch = useDispatch()
  const bigScreen = width > 700 

  const fillList = () => {
    let initList = []
    if (userRanking) {
      initList = initList.concat(
        <div className="pt-md">
          <div className="flex" style={{ alignItems: 'center' }}>
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
          <hr />
        </div>
      )
    }
    if (sharedStory) {
      initList = initList.concat(
        <div className="pt-md">
          <div className="flex" style={{ alignItems: 'center' }}>
            <img
              src={images.exclamationMark}
              alt="exclamation mark"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedHTMLMessage id="controlled-story-reminder" />
              <br />
              <Link className="interactable" to={`/stories/${sharedStory._id}/controlled-practice`}>
                {sharedStory.title}
              </Link>
            </div>
          </div>
          <hr />
        </div>
      )
    }
    if (prevBlueCards?.num_of_rewardable_words >= 5) {
      initList = initList.concat(
        <div className="pt-md">
          <div className="flex" style={{ alignItems: 'center' }}>
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
              <Link className="interactable" to={`/flashcards/fillin/test/${prevBlueCards.story_id}`}>
                <FormattedMessage id="flashcards-review" />
              </Link>
            </div>
          </div>
          <hr />
        </div>
      )
    }
    if (latestIncompleteStory && enable_recmd) {
      initList = initList.concat(
        <div className="pt-md">
          <div className="flex" style={{ alignItems: 'center' }}>
            <img
              src={images.practice}
              alt="weight"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedMessage id="continue-last-story-left-in-the-middle" />
              <br />
              <Link className="interactable" to={`/stories/${latestIncompleteStory._id}/practice`}>
                {latestIncompleteStory.title}
              </Link>
            </div>
          </div>
          <hr />
        </div>
      )
    }
    if (storiesToReview.length > 0 && enable_recmd) {
      initList = initList.concat(
        <div className="pt-md">
          <div className="flex" style={{ alignItems: 'center' }}>
            <img
              src={images.magnifyingGlass}
              alt="magnifying glass"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedMessage id="review-recent-stories" />

              <ul>
                {storiesToReview.map(story => (
                  <li style={{ marginTop: '0.5rem' }}>
                    <Link className="interactable" to={`/stories/${story._id}/review`}>{story.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <hr />
        </div>
      )
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
    }
  }, [])

  useEffect(() => {
    if (user_rank < 100) {
      setUserRanking(user_rank + 1)
    }
  }, [user_rank])

  useEffect(() => {
    if (stories) {
      const sharedIncompleteStories = stories.filter(
        story => story.shared && !story.has_read && story.control_story
      )
      if (sharedIncompleteStories) {
        setSharedStory(sharedIncompleteStories[0])
      }
    }
  }, [stories])

  useEffect(() => {
    if (storyBlueCards?.length > 0) {
      setPrevBlueCards(storyBlueCards[0])
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
      }
    }
  }, [incompleteStories])

  useEffect(() => {
    if (!userPending) {
      setRecmdList(fillList())
    }
  }, [
    userRanking,
    storiesCovered,
    storiesToReview,
    latestIncompleteStory,
    sharedStory,
    prevBlueCards,
  ])

  const closeModal = () => {
    setOpen(false)
  }

  const updatePreferences = () => {
    dispatch(updateEnableRecmd(!enable_recmd))
  }

  if (pending || storyCardsPending || recmdList.length < 1) {
    return null
  }

  if (open) {
    return (
      <Draggable cancel=".interactable">
        <div className={bigScreen ? "draggable-encouragement" : "draggable-encouragement-mobile"}>
          <div style={{ margin: '.75em' }}>
            <div className="col-flex" style={{ marginTop: '.75em' }}>
              {welcomeBack ? (
                <div className="flex">
                  <div>
                    <div
                      style={{
                        marginTop: '.25em',
                        marginBottom: '.75em',
                        fontWeight: 500,
                        fontSize: '1.4rem',
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
                    style={{
                      maxWidth: bigScreen ? '25%' : '25%',
                      maxHeight: bigScreen ? '25%' : '20%',
                      marginBottom: '.5em',
                      marginLeft: 'auto',
                    }}
                  />
                  <Icon
                    className="interactable"
                    style={{
                      cursor: 'pointer',
                      marginBottom: '.25em',
                    }}
                    size="large"
                    name="window minimize"
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
                    name="window minimize"
                    onClick={closeModal}
                  />
                </div>
              )}
              {recmdList.map((recommendation, index) => index < upperBound && recommendation)}
              {recmdList.length > upperBound && (
                <Button
                  className="interactable"
                  onClick={() => setUpperBound(upperBound + 10)}
                  styles={{ marginTop: '0.5em' }}
                >
                  <FormattedMessage id="show-more-recommendations" />
                </Button>
              )}
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
                trigger={<Icon className="interactable" style={{ marginLeft: '0.5em' }} name="info circle" color="grey" />}
              />
            </div>
          </div>
        </div>
      </Draggable>
    )
  }

  return null
}

export default DefaultActivityModal
