import React, { useState, useEffect } from 'react'
import { Modal, Popup, Icon } from 'semantic-ui-react'
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl'
import { updateEnableRecmd } from 'Utilities/redux/userReducer'
import { getStoriesBlueFlashcards, getBlueFlashcards } from 'Utilities/redux/flashcardReducer'
import { Link, useParams } from 'react-router-dom'
import { images, learningLanguageSelector, dictionaryLanguageSelector } from 'Utilities/common'
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

  const fillList = () => {
    let initList = []
    if (userRanking) {
      initList = initList.concat(
        <div className="pt-md">
          <div className="flex space-between" style={{ alignItems: 'center' }}>
            <div>
              <FormattedHTMLMessage
                id="leaderboard-ranking-encouragement"
                values={{ userRanking }}
              />
              &nbsp;
              <Link to="/leaderboard">
                <FormattedMessage id="leaderboard-link-encouragement" />
              </Link>
              !
              <br />
              <FormattedMessage id="practice-makes-perfect" />
            </div>
            <img
              src={images.encTrophy}
              alt="encouraging trophy"
              style={{ maxWidth: '8%', maxHeight: '8%', marginLeft: '.5em' }}
            />
          </div>
          <hr />
        </div>
      )
    }

    if (creditableWordsNum > 0) {
      initList = initList.concat(
        <div className="pt-md">
          <div className="flex space-between" style={{ alignItems: 'center' }}>
            <div>
              <FormattedHTMLMessage
                id="story-completed-to-blue-flashcards"
                values={{ nWords: creditableWordsNum }}
              />
              &nbsp;
              <Link to={`/flashcards/fillin/test/${storyId}`}>
                <FormattedMessage id="go-to-blue-flashcards" />
              </Link>
            </div>
            <img
              src={images.flashcards}
              alt="flashcard batch"
              style={{ maxWidth: '8%', maxHeight: '8%', marginLeft: '.5em' }}
            />
          </div>
          <hr />
        </div>
      )
    }

    if (prevBlueCards) {
      initList = initList.concat(
        <div className="pt-md">
          <div className="flex space-between" style={{ alignItems: 'center' }}>
            <div>
              <FormattedHTMLMessage
                id="previous-stories-blue-cards"
                values={{
                  nWords: prevBlueCards.num_of_rewardable_words,
                  story: prevBlueCards.title,
                }}
              />
              &nbsp;
              <Link to={`/flashcards/fillin/test/${prevBlueCards.story_id}`}>
                <FormattedMessage id="flashcards-review" />
              </Link>
            </div>
            <img
              src={images.flashcards}
              alt="flashcard batch"
              style={{ maxWidth: '8%', maxHeight: '8%', marginLeft: '.5em' }}
            />
          </div>
          <hr />
        </div>
      )
    }

    if (latestIncompleteStory && enable_recmd) {
      initList = initList.concat(
        <div className="pt-md">
          <div className="flex space-between" style={{ alignItems: 'center' }}>
            <div>
              <FormattedMessage id="continue-last-story-left-in-the-middle" />
              <br />
              <Link to={`/stories/${latestIncompleteStory._id}/practice`}>
                {latestIncompleteStory.title}
              </Link>
            </div>
            <img
              src={images.practice}
              alt="weight"
              style={{ maxWidth: '8%', maxHeight: '8%', marginLeft: '.5em' }}
            />
          </div>
          <hr />
        </div>
      )
    }
    if (vocabularySeen > 0 && enable_recmd) {
      initList = initList.concat(
        <div className="pt-md">
          <div className="flex space-between" style={{ alignItems: 'center' }}>
            <div>
              <FormattedHTMLMessage
                id="words-seen-encouragement"
                values={{ vocabulary_seen: vocabularySeen }}
              />
              &nbsp;
              <Link to="/flashcards">
                <FormattedMessage id="flashcards-review" />
              </Link>
              ?
            </div>
            <img
              src={images.flashcards}
              alt="flashcards"
              style={{ maxWidth: '8%', maxHeight: '8%', marginLeft: '.5em' }}
            />
          </div>
          <hr />
        </div>
      )
    }

    if (newVocabulary > 0 && enable_recmd) {
      initList = initList.concat(
        <div className="pt-md">
          <div className="flex space-between" style={{ alignItems: 'center' }}>
            <FormattedHTMLMessage
              id="words-interacted-encouragement"
              values={{ nWords: newVocabulary }}
            />
            &nbsp;
            <Link to="/profile/progress">
              <FormattedMessage id="review-progress" />
            </Link>
            ?
          </div>
          <img
            src={images.barChart}
            alt="bar chart"
            style={{ maxWidth: '8%', maxHeight: '8%', marginLeft: '.5em' }}
          />
          <hr />
        </div>
      )
    }

    initList = initList.concat(
      <div className="pt-md">
        <div className="flex space-between" style={{ alignItems: 'center' }}>
          <div>
            <FormattedMessage id="enc-grammar-progress-1" />
            &nbsp;
            <Link to="/profile/progress/grammar">
              <FormattedMessage id="enc-grammar-progress-2" />
            </Link>
            ?
          </div>
          <img
            src={images.beeHive}
            alt="beehive"
            style={{ maxWidth: '8%', maxHeight: '8%', marginLeft: '.5em' }}
          />
        </div>
        <hr />
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
    if (storyBlueCards) {
      const filteredBlueCards = storyBlueCards.filter(story => story.story_id !== storyId)

      if (filteredBlueCards.length > 0) {
        setPrevBlueCards(filteredBlueCards[filteredBlueCards.length - 1])
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

  return (
    <Modal
      basic
      open={open}
      size="small"
      centered={false}
      dimmer="blurring"
      closeIcon={{ style: { top: '2.5rem', right: '2.5rem' }, color: 'black', name: 'close' }}
      onClose={closeModal}
    >
      <Modal.Content>
        <div className="encouragement" style={{ padding: '1.5rem' }}>
          <div>
            <div
              className="header-4"
              style={{
                marginBottom: '1rem',
                fontWeight: 500,
              }}
            >
              <FormattedMessage
                id={
                  notFirst ? 'story-completed-encouragement' : 'first-story-covered-encouragement'
                }
              />
            </div>
            {storiesCovered > 0 && (
              <div>
                {intl.formatMessage(
                  { id: 'stories-covered-encouragement' },
                  { stories: storiesCovered }
                )}
              </div>
            )}
            <hr />
            {recmdList.map((recommendation, index) => index < upperBound && recommendation)}
            {recmdList.length > upperBound && (
              <Button
                onClick={() => setUpperBound(upperBound + 10)}
                styles={{ marginTop: '0.5em' }}
              >
                <FormattedMessage id="show-more-recommendations" />
              </Button>
            )}
          </div>
          <div className="encouragement-picture pt-sm">
            <img
              src={images.fireworks}
              alt="encouraging fireworks"
              style={{ maxWidth: '25%', maxHeight: '25%' }}
            />
          </div>
          <div className="flex pt-lg">
            <Form.Group>
              <Form.Check
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
              content={intl.formatMessage({ id: 'disable-recmd-tooltip' })}
              trigger={<Icon style={{ marginLeft: '0.5em' }} name="info circle" color="grey" />}
            />
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default ExercisesEncouragementModal
