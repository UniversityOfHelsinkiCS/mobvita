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
  incompleteStories,
  loading,
}) => {
  const { id: storyId } = useParams()
  const [upperBound, setUpperBound] = useState(3)
  const [recmdList, setRecmdList] = useState([])
  const { newVocabulary } = useSelector(({ newVocabulary }) => newVocabulary)
  const { user_rank } = useSelector(({ leaderboard }) => leaderboard.data)
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
    if (newVocabulary > 0) {
      initList = initList.concat(
        <div className="pt-lg">
          <FormattedHTMLMessage
            id="story-completed-to-blue-flashcards"
            values={{ nWords: newVocabulary }}
          />
          &nbsp;
          <Link to={`/flashcards/fillin/test/${storyId}`}>
            <FormattedMessage id="go-to-blue-flashcards" />
          </Link>
        </div>
      )
    }
    if (latestIncompleteStory && enable_recmd) {
      initList = initList.concat(
        <div>
          <div className="pt-lg">
            <FormattedMessage id="continue-last-story-left-in-the-middle" />
          </div>
          <Link to={`/stories/${latestIncompleteStory._id}/practice`}>
            {latestIncompleteStory.title}
          </Link>
        </div>
      )
    }
    if (enable_recmd) {
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
    }

    if (newVocabulary > 0 && enable_recmd) {
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
  }, [userRanking, newVocabulary, latestIncompleteStory])

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

  const closeModal = () => {
    dispatch(clearNewVocabulary())
    setOpen(false)
  }

  const updatePreferences = () => {
    dispatch(updateEnableRecmd(!enable_recmd))
  }

  if (loading) {
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
        <div className="encouragement" style={{ padding: '1.5rem', color: '#000000' }}>
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
