import React, { useEffect, useState } from 'react'
import { Modal } from 'semantic-ui-react'
import { useIntl, FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { Link, useHistory } from 'react-router-dom'
import { images } from 'Utilities/common'
import { useDispatch } from 'react-redux'
import { getStories, getAllStories } from 'Utilities/redux/storiesReducer'
import { enableFetcher } from 'Utilities/redux/disableStoryFetcherReducer'

const WelcomeBackEncouragementModal = ({
  open,
  setOpen,
  username,
  storiesCovered,
  stories,
  pending,
  learningLanguage,
}) => {
  const intl = useIntl()
  const [latestIncompleteStory, setLatestIncompleteStory] = useState(null)
  const [storyRoute, setStoryRoute] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    dispatch(
      getStories(learningLanguage, {
        sort_by: 'access',
      })
    )
  }, [])

  useEffect(() => {
    if (!pending && stories?.length > 0) {
      setLatestIncompleteStory(stories[stories.length - 1])
      setStoryRoute(`/stories/${stories[stories.length - 1]._id}/practice`)
    }
  }, [pending])

  const closeModal = () => {
    setOpen(false)
    dispatch(
      getAllStories(learningLanguage, {
        sort_by: 'date',
        order: -1,
      })
    )
    dispatch(enableFetcher())
  }

  const continueWithStory = () => {
    closeModal()
    history.replace(storyRoute)
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
          <div className="row-flex">
            <div className="col-flex">
              <div
                className="header-2"
                style={{
                  marginBottom: '1.5rem',
                  fontWeight: 500,
                  color: '#000000',
                }}
              >
                {intl.formatMessage({ id: 'welcome-back-encouragement' }, { username })}
              </div>
              <div className="bold" style={{ color: '#000000', marginBottom: '0.5rem' }}>
                {intl.formatMessage(
                  { id: 'stories-covered-encouragement' },
                  { stories: storiesCovered }
                )}
              </div>
              {latestIncompleteStory && (
                <div>
                  <div>
                    <div className="bold" style={{ color: '#000000', marginTop: '0.5rem' }}>
                      <FormattedHTMLMessage
                        id="would-you-like-to-continue-story"
                        values={{ story: latestIncompleteStory.title }}
                      />
                    </div>
                    <div className="row-flex">
                      <Link onClick={continueWithStory}>
                        <div className="bold approve">
                          <FormattedMessage id="yes" />
                        </div>
                      </Link>
                      <Link onClick={closeModal}>
                        <div className="bold decline">
                          <FormattedMessage id="no" />
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <img
              src={images.balloons}
              alt="encouraging balloons"
              style={{ maxWidth: '25%', maxHeight: '25%' }}
            />
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default WelcomeBackEncouragementModal
