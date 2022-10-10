import React, { useEffect, useState } from 'react'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { Popup, Icon } from 'semantic-ui-react'
import Draggable from 'react-draggable'
import useWindowDimensions from 'Utilities/windowDimensions'
import { useDispatch, useSelector } from 'react-redux'
import { updateEnableRecmd } from 'Utilities/redux/userReducer'
import { showFCIcon, closeFCEncouragement } from 'Utilities/redux/encouragementsReducer'
import { Link, useHistory } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { images, backgroundColors } from 'Utilities/common'

const FlashcardsEncouragement = ({
  open,
  correctAnswers,
  deckSize,
  enable_recmd,
  handleNewDeck,
  vocabularySeen,
  latestStories,
  prevBlueCards,
  loading,
  storyCardsPending,
  totalAnswers,
}) => {
  const { width } = useWindowDimensions()
  const history = useHistory()
  const intl = useIntl()
  const dispatch = useDispatch()
  const [recmdList, setRecmdList] = useState([])
  const blueFlashcards = history.location.pathname.includes('fillin')
  const { pending } = useSelector(({ user }) => user)
  const { creditableWordsNum } = useSelector(({ flashcards }) => flashcards)
  const bigScreen = width > 700

  const closeModal = () => {
    dispatch(showFCIcon())
    dispatch(closeFCEncouragement())
  }

  const fillList = () => {
    let initList = []

    if (blueFlashcards) {
      if (correctAnswers === deckSize && creditableWordsNum) {
        initList = initList.concat(
          <div>
            <div className="flex">
              <div
                style={{
                  fontSize: '1.4rem',
                  marginBottom: '1em',
                  fontWeight: 500,
                }}
              >
                <FormattedHTMLMessage
                  id="good-job-blue-flashcards"
                  values={{ nWords: creditableWordsNum }}
                />
              </div>
              <img
                src={images.encTrophy}
                alt="encouraging trophy"
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
          </div>
        )
        if (prevBlueCards?.num_of_rewardable_words >= 5) {
          initList = initList.concat(
            <div className="pt-md">
              <div
                className="flex enc-message-body"
                style={{
                  alignItems: 'center',
                  backgroundColor: backgroundColors[initList.length % 3],
                }}
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
      } else {
        initList = initList.concat(
          <div>
            <div className="flex">
              <div
                style={{
                  fontSize: '1.4rem',
                  marginBottom: '1em',
                  fontWeight: 500,
                }}
              >
                <FormattedHTMLMessage id="some-incorrect-flashcards" />
                &nbsp;
                <Link className="interactable" onClick={() => handleNewDeck()}>
                  <FormattedMessage id="flashcards-try-again" />
                </Link>
                ?
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
          </div>
        )
      }

      initList = initList.concat(
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{
              alignItems: 'center',
              backgroundColor: backgroundColors[initList.length % 3],
            }}
          >
            <img
              src={images.flashcards}
              alt="batch of flashcards"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
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

      initList = initList.concat(
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{
              alignItems: 'center',
              backgroundColor: backgroundColors[initList.length % 3],
            }}
          >
            <img
              src={images.barChart}
              alt="bar chart"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedMessage id="go-to-flashcards-progress" />
              &nbsp;
              <Link className="interactable" to="/profile/progress/flashcards">
                <FormattedMessage id="review-progress" />
              </Link>
              ?
            </div>
          </div>
        </div>
      )
    } else {
      if (correctAnswers > 0) {
        initList = initList.concat(
          <div>
            <div className="flex">
              <div
                style={{
                  fontSize: '1.4rem',
                  marginBottom: '1em',
                  fontWeight: 500,
                }}
              >
                <FormattedHTMLMessage
                  id="mastering-new-words"
                  values={{ nWords: correctAnswers }}
                />
              </div>
              <img
                src={images.encTrophy}
                alt="encouraging trophy"
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
          </div>
        )
      } else {
        initList = initList.concat(
          <div>
            <div className="flex">
              <div
                style={{
                  fontSize: '1.4rem',
                  marginBottom: '1em',
                  fontWeight: 500,
                }}
              >
                <FormattedHTMLMessage id="well-done-click-next-card-to-play-another-set-of-cards-1" />
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
          </div>
        )
      }
      initList = initList.concat(
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{
              alignItems: 'center',
              backgroundColor: backgroundColors[initList.length % 3],
            }}
          >
            <img
              src={images.flashcards}
              alt="bar chart"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedHTMLMessage id="well-done-click-next-card-to-play-another-set-of-cards-2" />
              &nbsp;
              <Button className="interactable" variant="primary" onClick={() => handleNewDeck()}>
                <FormattedMessage id="next-card" />
              </Button>
            </div>
          </div>
        </div>
      )
      if (latestStories.length > 0) {
        initList = initList.concat(
          <div className="pt-md">
            <div
              className="flex enc-message-body"
              style={{
                alignItems: 'center',
                backgroundColor: backgroundColors[initList.length % 3],
              }}
            >
              <img
                src={images.magnifyingGlass}
                alt="magnifying glass"
                style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
              />
              <div>
                <FormattedMessage id="list-of-recent-stories" />
                <ul>
                  {latestStories.map(story => (
                    <li style={{ marginTop: '0.5rem' }}>
                      <Link className="interactable" to={`/stories/${story._id}/practice`}>
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
      initList = initList.concat(
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{
              alignItems: 'center',
              backgroundColor: backgroundColors[initList.length % 3],
            }}
          >
            <img
              src={images.practice}
              alt="dumbbell"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedMessage id="go-back-to-library" />
              <br />
              <Link className="interactable" to="/library">
                <FormattedMessage id="go-back-to-library-2" />
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return initList
  }

  useEffect(() => {
    setRecmdList(fillList())
  }, [latestStories, prevBlueCards, vocabularySeen, correctAnswers])

  const updatePreferences = () => {
    dispatch(updateEnableRecmd(!enable_recmd))
  }

  if (pending || loading || storyCardsPending || totalAnswers < deckSize) {
    return null
  }

  if (open) {
    return (
      <Draggable cancel=".interactable">
        <div className={bigScreen ? 'draggable-encouragement' : 'draggable-encouragement-mobile'}>
          <div>
            <div className="interactable" style={{ overflow: 'auto', maxHeight: 300 }}>
              {recmdList.map(recommendation => recommendation)}
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
        </div>
      </Draggable>
    )
  }

  return null
}

export default FlashcardsEncouragement
