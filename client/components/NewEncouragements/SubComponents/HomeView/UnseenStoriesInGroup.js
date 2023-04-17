import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { images, backgroundColors, showAllEncouragements } from "Utilities/common"


const UnseenStoriesInGroup = () => {
  const [unseenInGroup, setUnseenInGroup] = useState(null)
  const stories = useSelector(({ stories }) => stories.data)

  useEffect(() => {
    if (stories) {
      const unseenStoriesInGroup = stories.find(
        story => story.shared && !story.has_read && story.groups?.length > 0 && !story.control_story
      )
      if (unseenStoriesInGroup) {
        setUnseenInGroup(unseenStoriesInGroup)
      } else {
        setUnseenInGroup(null)
      }
    }
  }, [stories])

  return (
    <div>
      {unseenInGroup === null && !showAllEncouragements ?
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
              <FormattedHTMLMessage id="new-group-story-encouragement" />
              &nbsp;
              <Link className="interactable" to="/library/group">
                <FormattedMessage id="go-to-group-library-link" />
              </Link>
            </div>
          </div>
        </div>
      }
    </div>
  )
}


export default UnseenStoriesInGroup