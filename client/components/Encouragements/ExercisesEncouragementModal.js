import React, { useState, useEffect } from 'react'
import { Modal, Popup, Icon } from 'semantic-ui-react'
import { FormattedHTMLMessage, FormattedMessage, useIntl } from 'react-intl'
import { updateEnableRecmd } from 'Utilities/redux/userReducer'
import { Link, useParams } from 'react-router-dom'
import { images } from 'Utilities/common'
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
}) => {
  const { id: storyId } = useParams()
  const [upperBound, setUpperBound] = useState(3)
  const [recmdList, setRecmdList] = useState([])
  const { newVocabulary } = useSelector(({ newVocabulary }) => newVocabulary)
  const { user_rank } = useSelector(({ leaderboard }) => leaderboard.data)
  const [userRanking, setUserRanking] = useState(null)
  const intl = useIntl()
  const { pending } = useSelector(({ user }) => user)
  const dispatch = useDispatch()
  const notFirst = storiesCovered > 1

  const fillList = () => {
    let initList = []
    if (userRanking) {
      initList = initList.concat(
        <div className="pt-lg">
          <div>
            <FormattedHTMLMessage id="leaderboard-ranking-encouragement" values={{ userRanking }} />
            &nbsp;
            <Link to="/leaderboard">
              <FormattedMessage id="leaderboard-link-encouragement" />
            </Link>
            !
          </div>
          <div>
            <FormattedMessage id="practice-makes-perfect" />
          </div>
        </div>
      )
    }
    initList = initList.concat(
      <div className="pt-lg">
        {intl.formatMessage({ id: 'stories-covered-encouragement' }, { stories: storiesCovered })}
      </div>
    )
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
    if (newVocabulary > 0) {
      initList = initList.concat(
        <div className="pt-lg">
          <FormattedHTMLMessage
            id="story-completed-to-blue-flashcards"
            values={{ nWords: newVocabulary }}
          />
          &nbsp;
          <Link to={`/flashcards/fillin/${storyId}`}>
            <FormattedMessage id="go-to-blue-flashcards" />
          </Link>
        </div>
      )
      initList = initList.concat(
        <div className="pt-lg">
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
      )
    }

    return initList
  }

  useEffect(() => {
    dispatch(getLeaderboards())
  }, [])

  useEffect(() => {
    if (user_rank < 100) {
      setUserRanking(user_rank + 1)
    }
  }, [user_rank])

  useEffect(() => {
    if (!pending) {
      setRecmdList(fillList())
    }
  }, [userRanking, newVocabulary])

  const closeModal = () => {
    dispatch(clearNewVocabulary())
    setOpen(false)
  }

  const updatePreferences = () => {
    dispatch(updateEnableRecmd(!enable_recmd))
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
        <div className="encouragement" style={{ padding: '1.5rem', color: '#000000' }}>
          {notFirst ? (
            <div>
              <div
                className="header-4"
                style={{
                  marginBottom: '1rem',
                  fontWeight: 500,
                }}
              >
                <FormattedMessage id="story-completed-encouragement" />
              </div>
              {recmdList.map((recommendation, index) => index < upperBound && recommendation)}
              {recmdList.length > upperBound && (
                <Button
                  onClick={() => setUpperBound(upperBound + 10)}
                  styles={{ marginTop: '0.5em' }}
                >
                  <FormattedMessage id="show-more-recommendations" />
                </Button>
              )}
              <div className="flex pt-lg">
                <Popup
                  content={intl.formatMessage({ id: 'disable-recmd-tooltip' })}
                  trigger={
                    <Icon style={{ marginRight: '0.5em' }} name="info circle" color="grey" />
                  }
                />
                <span style={{ color: '#708090' }}>
                  <FormattedMessage id="never-show-recommendations" />
                </span>
                <Form.Group>
                  <Form.Check
                    style={{ marginLeft: '.5em', marginTop: '.25em' }}
                    type="checkbox"
                    inline
                    onChange={updatePreferences}
                    checked={!enable_recmd}
                    disabled={pending}
                  />
                </Form.Group>
              </div>
            </div>
          ) : (
            <div
              className="header-4"
              style={{
                marginBottom: '1.5rem',
                fontWeight: 500,
              }}
            >
              <FormattedMessage id="first-story-covered-encouragement" />
            </div>
          )}
          <div className="encouragement-picture pt-sm">
            <img
              src={images.fireworks}
              alt="encouraging fireworks"
              style={{ maxWidth: '25%', maxHeight: '25%' }}
            />
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default ExercisesEncouragementModal
