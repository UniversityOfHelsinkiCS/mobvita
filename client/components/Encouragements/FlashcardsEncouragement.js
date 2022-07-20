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
}) => {
  const history = useHistory()
  const intl = useIntl()
  const dispatch = useDispatch()
  const [upperBound, setUpperBound] = useState(3)
  const [recmdList, setRecmdList] = useState([])
  const blueFlashcards = history.location.pathname.includes('fillin')
  const { pending } = useSelector(({ user }) => user)

  const fillList = () => {
    let initList = []

    if (blueFlashcards) {
      if (correctAnswers === deckSize) {
        initList = initList.concat(
          <div className="pt-lg">
            <FormattedHTMLMessage id="all-correct-flashcards" />
            &nbsp;
            <Link to="/profile/progress">
              <FormattedMessage id="review-progress" />
            </Link>
            ?
          </div>
        )
        if (prevBlueCards.length > 0) {
          initList = initList.concat(
            <div>
              <div className="pt-lg">
                <FormattedHTMLMessage id="previous-stories-blue-cards" />
              </div>
              <ul>
                {prevBlueCards.map(
                  (story, index) =>
                    index < 3 && (
                      <li style={{ marginTop: '0.5rem' }}>
                        <Link to={`/flashcards/fillin/test/${story.story_id}`}>{story.title}</Link>
                      </li>
                    )
                )}
              </ul>
            </div>
          )
        }
      } else {
        initList = initList.concat(
          <div className="pt-lg">
            <FormattedHTMLMessage id="some-incorrect-flashcards" />
            &nbsp;
            <Link onClick={() => handleNewDeck()}>
              <FormattedMessage id="flashcards-try-again" />
            </Link>
            ?
          </div>
        )
      }

      initList = initList.concat(
        <div className="pt-lg">
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
      )
    } else {
      if (correctAnswers > 0) {
        initList = initList.concat(
          <div className="pt-lg">
            <FormattedHTMLMessage id="mastering-new-words" values={{ nWords: correctAnswers }} />
          </div>
        )
      }
      if (latestStories.length > 0) {
        initList = initList.concat(
          <div>
            <div className="pt-lg">
              <FormattedMessage id="list-of-recent-stories" />
            </div>
            <ul>
              {latestStories.map(story => (
                <li style={{ marginTop: '0.5rem' }}>
                  <Link to={`/stories/${story._id}/practice`}>{story.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )
      }
      initList = initList.concat(
        <div>
          <div className="pt-lg">
            <div style={{ color: '#000000' }}>
              <FormattedMessage id="go-back-to-library" />
              &nbsp;
              <Link to="/library">
                <FormattedMessage id="go-back-to-library-2" />
              </Link>
            </div>
          </div>
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
  }, [])

  const updatePreferences = () => {
    dispatch(updateEnableRecmd(!enable_recmd))
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
        <div className="encouragement" style={{ padding: '1.5rem', color: '#000000' }}>
          {recmdList.map((recommendation, index) => index < upperBound && recommendation)}
          {recmdList.length > upperBound && (
            <Button onClick={() => setUpperBound(upperBound + 10)} styles={{ marginTop: '0.5em' }}>
              <FormattedMessage id="show-more-recommendations" />
            </Button>
          )}
          {!blueFlashcards && (
            <div className="pt-lg">
              <FormattedMessage id="well-done-click-next-card-to-play-another-set-of-cards" />
              <div style={{ marginTop: '0.5em' }}>
                <Button variant="primary" onClick={() => handleNewDeck()}>
                  <FormattedMessage id="next-card" />
                </Button>
              </div>
            </div>
          )}
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

export default FlashcardsEncouragement
