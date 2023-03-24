import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FormattedHTMLMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { images, backgroundColors } from 'Utilities/common'

const SharedIncompleteStoryInGroup = () => {
  const [sharedStory, setSharedStory] = useState(null)
  const stories = useSelector(({ stories }) => stories.data)

  useEffect(() => {
    if (stories) {
      const sharedIncompleteStories = stories.find(
        story => story.shared && !story.has_read && story.control_story
      )
      if (sharedIncompleteStories) {
        setSharedStory(sharedIncompleteStories)
      } else {
        setSharedStory(null)
      }
    }
  }, [stories])

  return (
    <div>
      {sharedStory === null ?
        null :
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{ alignItems: 'center', backgroundColor: backgroundColors[2] }}
          >
            <img
              src={images.exclamationMark}
              alt="exclamation mark"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedHTMLMessage id="controlled-story-reminder" />
              <ul style={{ paddingLeft: 0 }}>
                <li style={{ listStylePosition: 'inside' }}>
                  <Link
                    className="interactable"
                    to={`/stories/${sharedStory._id}/controlled-practice`}
                  >
                    <i>{sharedStory.title}</i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      }
    </div>
  )
}

export default SharedIncompleteStoryInGroup