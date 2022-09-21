import React, { useState, useEffect } from 'react'
import { Popup, Icon } from 'semantic-ui-react'
import Draggable from 'react-draggable'
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import { updateEnableRecmd } from 'Utilities/redux/userReducer'
import { getStoriesBlueFlashcards, getBlueFlashcards } from 'Utilities/redux/flashcardReducer'
import { Link, useParams } from 'react-router-dom'
import {
  images,
  learningLanguageSelector,
  dictionaryLanguageSelector,
  backgroundColors,
} from 'Utilities/common'
import { clearNewVocabulary } from 'Utilities/redux/newVocabularyReducer'
import { getLeaderboards } from 'Utilities/redux/leaderboardReducer'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Button } from 'react-bootstrap'

const ExercisesEncouragementModal = ({
  open,
  setOpen,
  enable_recmd,
  storiesCovered,
  vocabularySeen,
  incompleteStories,
  loading,
}) => {
  const { id: storyId } = useParams()
  const { width } = useWindowDimensions()
  const [upperBound, setUpperBound] = useState(3)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const [recmdList, setRecmdList] = useState([])
  const { newVocabulary } = useSelector(({ newVocabulary }) => newVocabulary)
  const { user_rank } = useSelector(({ leaderboard }) => leaderboard.data)
  const {
    storyBlueCards,
    storyCardsPending,
    creditableWordsNum,
    pending: cardsPending,
  } = useSelector(({ flashcards }) => flashcards)
  const [prevBlueCards, setPrevBlueCards] = useState(null)
  const [latestIncompleteStory, setLatestIncompleteStory] = useState(null)
  const [userRanking, setUserRanking] = useState(null)
  const intl = useIntl()
  const { pending } = useSelector(({ user }) => user)
  const dispatch = useDispatch()
  const notFirst = storiesCovered > 1
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
            <div
              className="enc-message-body"
              style={{ backgroundColor: backgroundColors[initList.length % 3] }}
            >
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

    if (creditableWordsNum >= 5) {
      initList = initList.concat(
        <div className="pt-md">
          <div className="flex" style={{ alignItems: 'center' }}>
            <img
              src={images.flashcards}
              alt="flashcard batch"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div
              className="enc-message-body"
              style={{ backgroundColor: backgroundColors[initList.length % 3] }}
            >
              <FormattedHTMLMessage
                id="story-completed-to-blue-flashcards"
                values={{ nWords: creditableWordsNum }}
              />
              &nbsp;
              <Link className="interactable" to={`/flashcards/fillin/test/${storyId}`}>
                <FormattedMessage id="go-to-blue-flashcards" />
              </Link>
            </div>
          </div>
        </div>
      )
    } else if (prevBlueCards?.num_of_rewardable_words >= 5) {
      initList = initList.concat(
        <div className="pt-md">
          <div className="flex" style={{ alignItems: 'center' }}>
            <img
              src={images.flashcards}
              alt="flashcard batch"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div
              className="enc-message-body"
              style={{ backgroundColor: backgroundColors[initList.length % 3] }}
            >
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

    if (latestIncompleteStory && enable_recmd) {
      initList = initList.concat(
        <div className="pt-md">
          <div className="flex" style={{ alignItems: 'center' }}>
            <img
              src={images.practice}
              alt="weight"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div
              className="enc-message-body"
              style={{ backgroundColor: backgroundColors[initList.length % 3] }}
            >
              <FormattedMessage id="continue-last-story-left-in-the-middle" />
              <br />
              <li>
                <Link className="interactable" to={`/stories/${latestIncompleteStory._id}/practice`}>
                  {latestIncompleteStory.title}
                </Link>
              </li>
            </div>
          </div>
        </div>
      )
    }
    if (vocabularySeen > 0 && enable_recmd) {
      initList = initList.concat(
        <div className="pt-md">
          <div className="flex" style={{ alignItems: 'center' }}>
            <img
              src={images.flashcards}
              alt="flashcards"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div
              className="enc-message-body"
              style={{ backgroundColor: backgroundColors[initList.length % 3] }}
            >
              <FormattedHTMLMessage
                id="words-seen-encouragement"
                values={{ vocabulary_seen: vocabularySeen }}
              />
              &nbsp;
              <Link className="interactable" to="/flashcards">
                <FormattedMessage id="flashcards-review" />
              </Link>
              ?
            </div>
          </div>
        </div>
      )
    }

    if (newVocabulary > 0 && enable_recmd) {
      initList = initList.concat(
        <div className="pt-md">
          <div className="flex" style={{ alignItems: 'center' }}>
            <img
              src={images.barChart}
              alt="bar chart"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div
              className="enc-message-body"
              style={{ backgroundColor: backgroundColors[initList.length % 3] }}
            >
              <FormattedHTMLMessage
                id="words-interacted-encouragement"
                values={{ nWords: newVocabulary }}
              />
              &nbsp;
              <Link className="interactable" to="/profile/progress">
                <FormattedMessage id="review-progress" />
              </Link>
              ?
            </div>
          </div>
        </div>
      )
    }

    initList = initList.concat(
      <div className="pt-md">
        <div className="flex" style={{ alignItems: 'center' }}>
          <img
            src={images.beeHive}
            alt="beehive"
            style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
          />
          <div
            className="enc-message-body"
            style={{ backgroundColor: backgroundColors[initList.length % 3] }}
          >
            <FormattedMessage id="enc-grammar-progress-1" />
            &nbsp;
            <Link className="interactable" to="/profile/progress/grammar">
              <FormattedMessage id="enc-grammar-progress-2" />
            </Link>
            ?
          </div>
        </div>
      </div>
    )

    return initList
  }

  useEffect(() => {
    dispatch(getBlueFlashcards(learningLanguage, dictionaryLanguage, storyId))
    dispatch(getLeaderboards())
    dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
  }, [])

  useEffect(() => {
    if (user_rank < 100) {
      setUserRanking(user_rank + 1)
    }
  }, [user_rank])

  useEffect(() => {
    setRecmdList(fillList())
  }, [userRanking, newVocabulary, latestIncompleteStory, prevBlueCards, creditableWordsNum])

  useEffect(() => {
    if (incompleteStories.length > 0) {
      const listOfLatest = incompleteStories.filter(
        story => story.last_snippet_id !== story.num_snippets - 1
      )

      if (listOfLatest.length > 0) {
        setLatestIncompleteStory(listOfLatest[listOfLatest.length - 1])
      }
    }
  }, [incompleteStories])

  useEffect(() => {
    if (storyBlueCards?.length > 0) {
      const filteredBlueCards = storyBlueCards.filter(story => story.story_id !== storyId)
      if (filteredBlueCards?.length > 0) {
        setPrevBlueCards(filteredBlueCards[0])
      }
    }
  }, [storyBlueCards])

  const closeModal = () => {
    dispatch(clearNewVocabulary())
    setOpen(false)
  }

  const updatePreferences = () => {
    dispatch(updateEnableRecmd(!enable_recmd))
  }

  if (loading || storyCardsPending || cardsPending) {
    return null
  }

  if (open) {
    return (
      <Draggable cancel=".interactable">
        <div
          className={bigScreen ? 'draggable-ex-encouragement' : 'draggable-ex-encouragement-mobile'}
        >
          <div>
            <div className="flex">
              <div>
                <div
                  style={{
                    marginBottom: '.75em',
                    fontWeight: 500,
                    fontSize: '1.4rem',
                  }}
                >
                  <FormattedMessage
                    id={
                      notFirst
                        ? 'story-completed-encouragement'
                        : 'first-story-covered-encouragement'
                    }
                  />
                </div>
                {storiesCovered > 1 && (
                  <div style={{ marginBottom: '.5em' }}>
                    {intl.formatMessage(
                      { id: 'stories-covered-encouragement' },
                      { stories: storiesCovered }
                    )}
                  </div>
                )}
              </div>
              <img
                src={images.fireworks}
                alt="encouraging fireworks"
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
          <div className="flex pt-lg" style={{ margin: '.75em' }}>
            <Form.Group>
              <Form.Check
                className="interactable"
                style={{ marginTop: '0.15em' }}
                type="checkbox"
                inline
                onChange={updatePreferences}
                checked={!enable_recmd}
                disabled={pending}
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
      </Draggable>
    )
  }

  return null
}

export default ExercisesEncouragementModal
