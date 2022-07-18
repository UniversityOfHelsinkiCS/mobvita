import React, { useEffect, useState } from 'react'
import { Modal, Popup, Icon } from 'semantic-ui-react'
import { useIntl, FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import { images } from 'Utilities/common'
import { useDispatch, useSelector } from 'react-redux'
import { updateEnableRecmd } from 'Utilities/redux/userReducer'
import { getIncompleteStories } from 'Utilities/redux/incompleteStoriesReducer'
import { getLeaderboards } from 'Utilities/redux/leaderboardReducer'
import { Form, Button } from 'react-bootstrap'

const WelcomeBackEncouragementModal = ({
  open,
  setOpen,
  username,
  storiesCovered,
  incompleteStories,
  pending,
  learningLanguage,
  enable_recmd,
}) => {
  const intl = useIntl()
  const [latestIncompleteStory, setLatestIncompleteStory] = useState(null)
  const [storiesToReview, setStoriesToReview] = useState([])
  const [upperBound, setUpperBound] = useState(3)
  const [recmdList, setRecmdList] = useState([])
  const { user_rank } = useSelector(({ leaderboard }) => leaderboard.data)
  const stories = useSelector(({ stories }) => stories.data)
  const [userRanking, setUserRanking] = useState(null)
  const [sharedStory, setSharedStory] = useState(null)
  const { pending: userPending } = useSelector(({ user }) => user)
  const dispatch = useDispatch()

  const fillList = () => {
    let initList = []
    if (latestIncompleteStory) {
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
    if (storiesToReview.length > 0) {
      initList = initList.concat(
        <div>
          <div className="pt-lg">
            <FormattedMessage id="review-recent-stories" />
          </div>
          <ul>
            {storiesToReview.map(story => (
              <li style={{ marginTop: '0.5rem' }}>
                <Link to={`/stories/${story._id}/review`}>{story.title}</Link>
              </li>
            ))}
          </ul>
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
    if (!userPending && enable_recmd) {
      setRecmdList(fillList())
    }
  }, [userRanking, storiesCovered, storiesToReview, latestIncompleteStory, sharedStory])

  const closeModal = () => {
    setOpen(false)
  }

  const updatePreferences = () => {
    dispatch(updateEnableRecmd(!enable_recmd))
  }

  if (pending) {
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
        <div className="encouragement" style={{ padding: '1.5rem', color: '#000000' }}>
          <div>
            <div className="col-flex">
              <div
                className="header-2"
                style={{
                  marginBottom: '1.5rem',
                  fontWeight: 500,
                }}
              >
                {intl.formatMessage({ id: 'welcome-back-encouragement' }, { username })}
              </div>
              {storiesCovered > 0 && (
                <div>
                  {intl.formatMessage(
                    { id: 'stories-covered-encouragement' },
                    { stories: storiesCovered }
                  )}
                </div>
              )}
              {userRanking && (
                <div className="pt-lg">
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
                  </div>
                  <div>
                    <FormattedMessage id="practice-makes-perfect" />
                  </div>
                </div>
              )}
              {sharedStory && (
                <div>
                  <div className="pt-lg">
                    <div>
                      <FormattedHTMLMessage id="controlled-story-reminder" />
                      <br />
                      <Link to={`/stories/${sharedStory._id}/controlled-practice`}>
                        {sharedStory.title}
                      </Link>
                    </div>
                  </div>
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
                src={images.balloons}
                alt="encouraging balloons"
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
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default WelcomeBackEncouragementModal
