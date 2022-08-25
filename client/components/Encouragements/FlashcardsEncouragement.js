import React, { useEffect, useState } from 'react'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { Modal, Popup, Icon } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { updateEnableRecmd } from 'Utilities/redux/userReducer'
import { Link, useHistory } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { images } from 'Utilities/common'

const FlashcardsEncouragement = ({
  open,
  setOpen,
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
  const history = useHistory()
  const intl = useIntl()
  const dispatch = useDispatch()
  const [upperBound, setUpperBound] = useState(3)
  const [recmdList, setRecmdList] = useState([])
  const blueFlashcards = history.location.pathname.includes('fillin')
  const { pending } = useSelector(({ user }) => user)
  const { creditableWordsNum } = useSelector(({ flashcards }) => flashcards)

  const fillList = () => {
    let initList = []

    if (blueFlashcards) {
      if (correctAnswers === deckSize && creditableWordsNum) {
        initList = initList.concat(
          <div className="pt-md">
            <div className="flex" style={{ alignItems: 'center' }}>
              <div
                className="header-2"
                style={{
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
                style={{ maxWidth: '25%', maxHeight: '25%', marginLeft: 'auto' }}
              />
            </div>
            <hr />
          </div>
        )
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
                  <Link to={`/flashcards/fillin/test/${prevBlueCards.story_id}`}>
                    <FormattedMessage id="flashcards-review" />
                  </Link>
                </div>
              </div>
              <hr />
            </div>
          )
        }
      } else {
        initList = initList.concat(
          <div className="pt-md">
            <div className="flex" style={{ alignItems: 'center' }}>
              <div
                className="header-2"
                style={{
                  marginBottom: '1em',
                  fontWeight: 500,
                }}
              >
                <FormattedHTMLMessage id="some-incorrect-flashcards" />
                &nbsp;
                <Link onClick={() => handleNewDeck()}>
                  <FormattedMessage id="flashcards-try-again" />
                </Link>
                ?
              </div>
              <img
                src={images.fireworks}
                alt="encouraging fireworks"
                style={{ maxWidth: '25%', maxHeight: '25%', marginLeft: 'auto' }}
              />
            </div>
            <hr />
          </div>
        )
      }

      initList = initList.concat(
        <div className="pt-md">
          <div className="flex" style={{ alignItems: 'center' }}>
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
              <Link to="/flashcards">
                <FormattedMessage id="flashcards-review" />
              </Link>
              ?
            </div>
          </div>
          <hr />
        </div>
      )

      initList = initList.concat(
        <div className="pt-md">
          <div className="flex" style={{ alignItems: 'center' }}>
            <img
              src={images.barChart}
              alt="bar chart"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedMessage id="go-to-flashcards-progress" />
              &nbsp;
              <Link to="/profile/progress/flashcards">
                <FormattedMessage id="review-progress" />
              </Link>
              ?
            </div>
          </div>
          <hr />
        </div>
      )
    } else {
      if (correctAnswers > 0) {
        initList = initList.concat(
          <div className="pt-md">
            <div className="flex" style={{ alignItems: 'center' }}>
              <div
                className="header-2"
                style={{
                  marginBottom: '1em',
                  fontWeight: 500,
                }}
              >
                <FormattedHTMLMessage id="mastering-new-words" values={{ nWords: correctAnswers }} />
              </div>
              <img
                src={images.encTrophy}
                alt="encouraging trophy"
                style={{ maxWidth: '25%', maxHeight: '25%', marginLeft: 'auto' }}
              />
            </div>
            <hr />
          </div>
        )
      } else {
        initList = initList.concat(
          <div className="pt-md">
            <div className="flex" style={{ alignItems: 'center' }}>
              <div
                className="header-2"
                style={{
                  marginBottom: '1em',
                  fontWeight: 500,
                }}
              >
                <FormattedHTMLMessage id="well-done-click-next-card-to-play-another-set-of-cards-1" />
              </div>
              <img
                src={images.fireworks}
                alt="encouraging fireworks"
                style={{ maxWidth: '25%', maxHeight: '25%', marginLeft: 'auto' }}
              />
            </div>
            <hr />
          </div>
        )
      }
      initList = initList.concat(
        <div className="pt-md">
          <div className="flex" style={{ alignItems: 'center' }}>
            <img
              src={images.flashcards}
              alt="bar chart"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedHTMLMessage id="well-done-click-next-card-to-play-another-set-of-cards-2" />
              &nbsp;
              <Button variant="primary" onClick={() => handleNewDeck()}>
                <FormattedMessage id="next-card" />
              </Button>
            </div>
          </div>
          <hr />
        </div>
      )
      if (latestStories.length > 0) {
        initList = initList.concat(
          <div className="pt-md">
            <div className="flex" style={{ alignItems: 'center' }}>
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
                      <Link to={`/stories/${story._id}/practice`}>{story.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <hr />
          </div>
        )
      }
      initList = initList.concat(
        <div className="pt-md">
          <div className="flex" style={{ alignItems: 'center' }}>
            <img
              src={images.practice}
              alt="dumbbell"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedMessage id="go-back-to-library" />
              &nbsp;
              <Link to="/library">
                <FormattedMessage id="go-back-to-library-2" />
              </Link>
            </div>
          </div>
          <hr />
        </div>
      )
    }

    return initList
  }

  const closeModal = () => {
    setOpen(false)
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

  return (
    <Modal
      basic
      open={open}
      size="tiny"
      centered={false}
      dimmer="blurring"
      closeIcon={{ style: { top: '2.5rem', right: '2.5rem' }, color: 'black', name: 'close' }}
      onClose={closeModal}
    >
      <Modal.Content>
        <div className="encouragement" style={{ padding: '1.5rem' }}>
          {recmdList.map((recommendation, index) => index < upperBound && recommendation)}
          {recmdList.length > upperBound && (
            <Button onClick={() => setUpperBound(upperBound + 10)} styles={{ marginTop: '0.5em' }}>
              <FormattedMessage id="show-more-recommendations" />
            </Button>
          )}
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

export default FlashcardsEncouragement
