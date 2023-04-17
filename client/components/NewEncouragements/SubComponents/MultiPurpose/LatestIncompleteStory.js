import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { images, backgroundColors, showAllEncouragements } from "Utilities/common"
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

const LatestIncompleteStory = () => {
  const userData = useSelector(state => state.user.data.user)
  const { enable_recmd } = userData
  const { incomplete: incompleteStories } = useSelector(({ incomplete }) => ({
    incomplete: incomplete.data,
  }))
  const [latestIncompleteStory, setLatestIncompleteStory] = useState(null)

  useEffect(() => {
    //console.log(`incomplete stories: ${incompleteStories}`)
    if (incompleteStories?.length > 0) {
      const listOfLatest = incompleteStories.filter(
        story => story.last_snippet_id !== story.num_snippets - 1
      )

      if (listOfLatest.length > 0) {
        setLatestIncompleteStory(listOfLatest[listOfLatest.length - 1])
      } else {
        setLatestIncompleteStory(null)
      }
    } else {
      setLatestIncompleteStory(null)
    }
  }, [incompleteStories])

  return (
    <div>
      {(latestIncompleteStory && enable_recmd) || showAllEncouragements? (
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{ alignItems: 'center', backgroundColor: backgroundColors[0] }}
          >
            <img
              src={images.practice}
              alt="weight"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedMessage id="continue-last-story-left-in-the-middle" />
              <br />
              <ul style={{ paddingLeft: 0 }}>
                <li style={{ marginTop: '0.5rem', listStylePosition: 'inside' }}>
                  <Link
                    className="interactable"
                    to={`/stories/${latestIncompleteStory?._id}/practice`}
                  >
                    <i>{latestIncompleteStory?.title}</i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default LatestIncompleteStory
