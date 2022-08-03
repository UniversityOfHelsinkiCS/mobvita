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
            <FormattedHTMLMessage
              id="good-job-blue-flashcards"
              values={{ nWords: creditableWordsNum }}
            />
            <hr />
          </div>
        )
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
      } else {
        initList = initList.concat(
          <div className="pt-md">
            <FormattedHTMLMessage id="some-incorrect-flashcards" />
            &nbsp;
            <Link onClick={() => handleNewDeck()}>
              <FormattedMessage id="flashcards-try-again" />
            </Link>
            ?
            <hr />
          </div>
        )
      }

      initList = initList.concat(
        <div className="pt-md">
          <FormattedHTMLMessage
            id="words-seen-encouragement"
            values={{ vocabulary_seen: vocabularySeen }}
          />
          &nbsp;
          <Link to="/flashcards">
            <FormattedMessage id="flashcards-review" />
          </Link>
          ?
          <hr />
        </div>
      )

      initList = initList.concat(
        <div className="pt-md">
          <FormattedMessage id="Would you like to review" />
          &nbsp;
          <Link to="/profile/progress/flashcards">
            <FormattedMessage id="review-progress" />
          </Link>
          ?
          <hr />
        </div>
      )
    } else {
      if (correctAnswers > 0) {
        initList = initList.concat(
          <div className="pt-md" style={{ fontSize: '18px' }}>
            <FormattedHTMLMessage id="mastering-new-words" values={{ nWords: correctAnswers }} />
            <hr />
          </div>
        )
      } else {
        initList = initList.concat(
          <div className="pt-md" style={{ fontSize: '18px' }}>
            <FormattedHTMLMessage id="well-done-click-next-card-to-play-another-set-of-cards-1" />
            <hr />
          </div>
        )
      }
      initList = initList.concat(
        <div className="pt-md" style={{ marginTop: '0.5em' }}>
          <FormattedHTMLMessage id="well-done-click-next-card-to-play-another-set-of-cards-2" />
          &nbsp;
          <Button variant="primary" onClick={() => handleNewDeck()}>
            <FormattedMessage id="next-card" />
          </Button>
          <hr />
        </div>
      )
      if (latestStories.length > 0) {
        initList = initList.concat(
          <div>
            <div className="pt-md">
              <FormattedMessage id="list-of-recent-stories" />
            </div>
            <ul>
              {latestStories.map(story => (
                <li style={{ marginTop: '0.5rem' }}>
                  <Link to={`/stories/${story._id}/practice`}>{story.title}</Link>
                </li>
              ))}
            </ul>
            <hr />
          </div>
        )
      }
      initList = initList.concat(
        <div className="pt-md">
          <div style={{ color: '#000000' }}>
            <FormattedMessage id="go-back-to-library" />
            &nbsp;
            <Link to="/library">
              <FormattedMessage id="go-back-to-library-2" />
            </Link>
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
          {((correctAnswers === deckSize && blueFlashcards) ||
            (!blueFlashcards && correctAnswers)) > 0 ? (
            <div className="encouragement-picture pt-sm">
                <img
                src={images.encTrophy}
                alt="encouraging trophy"
                style={{ maxWidth: '25%', maxHeight: '25%' }}
              />
              </div>
          ) : (
            <div className="encouragement-picture pt-sm">
              <img
                src={images.fireworks}
                alt="encouraging fireworks"
                style={{ maxWidth: '25%', maxHeight: '25%' }}
              />
            </div>
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
