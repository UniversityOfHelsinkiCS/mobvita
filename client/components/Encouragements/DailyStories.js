import React, { useEffect } from 'react'
import Draggable from 'react-draggable'
import { useDispatch, useSelector } from 'react-redux'
import { uploadCachedStory, getAllStories } from 'Utilities/redux/storiesReducer'
import { Icon } from 'semantic-ui-react'
import { learningLanguageSelector } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'

const DailyStories = ({ cachedStories, bigScreen, open, setOpen }) => {
  const dispatch = useDispatch()
  const { uploaded } = useSelector(({ stories }) => stories)
  const learningLanguage = useSelector(learningLanguageSelector)

  const truncateStoryTitle = title => {
    if (title.length > 40) {
      return `${title.slice(0, 40)}...`
    }

    return title
  }

  useEffect(() => {
    if (uploaded) {
      dispatch(
        getAllStories(learningLanguage, {
          sort_by: 'date',
          order: -1,
        })
      )
    }
  }, [uploaded])

  if (open) {
    return (
      <Draggable cancel=".interactable">
        <div
          className={bigScreen ? 'draggable-encouragement' : 'draggable-encouragement-mobile'}
          style={{ zIndex: 104 }}
        >
          <div className="flex space-between" style={{ paddingBottom: '1rem' }}>
            <div style={{ fontSize: '1.25rem', paddingBottom: '.5rem' }}>
              <FormattedMessage id="daily-stories" />
            </div>
            <Icon
              className="interactable"
              style={{
                cursor: 'pointer',
                marginBottom: '.25em',
              }}
              size="large"
              name="close"
              onClick={() => setOpen(false)}
            />
          </div>
          <ul>
            {cachedStories.map(
              (story, index) =>
                index < 3 && (
                  <li style={{ marginBottom: '1em' }}>
                    {truncateStoryTitle(story.title)}
                    <ul>
                      <li>
                        <FormattedMessage id="daily-story-web-1" />
                        &nbsp;
                        <a
                          href={story.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: '1rem', fontWeight: '300' }}
                        >
                          <FormattedMessage id="daily-story-web-2" />
                        </a>
                      </li>
                      <li>
                        <Button
                          variant="primary"
                          onClick={() => dispatch(uploadCachedStory(story._id))}
                        >
                          <FormattedMessage id="upload-daily-story" />
                        </Button>
                      </li>
                    </ul>
                  </li>
                )
            )}
          </ul>
        </div>
      </Draggable>
    )
  }

  return null
}

export default DailyStories
