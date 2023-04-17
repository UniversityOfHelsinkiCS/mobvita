import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import { images, backgroundColors, showAllEncouragements } from "Utilities/common"


const ListOfRecentStoriesFlashcardsEncouragement = () => {
  const [latestStories, setLatestStories] = useState([])
  const { incomplete, loading } = useSelector(({ incomplete }) => ({
    incomplete: incomplete.data,
    loading: incomplete.pending,
  }))

  useEffect(() => {
    if (incomplete.length > 0) {
      const latestIncompleteStories = incomplete.filter(
        story => story.last_snippet_id !== story.num_snippets - 1
      )
      const previousStories = []
      for (
        let i = latestIncompleteStories.length - 1;
        i >= 0 && i >= latestIncompleteStories.length - 3;
        i--
      ) {
        previousStories.push(latestIncompleteStories[i])
      }

      setLatestStories(previousStories)
    }
  }, [incomplete])

  return (
    <div>
      {latestStories.length > 0 || showAllEncouragements ? (
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{
              alignItems: 'center',
              backgroundColor: backgroundColors[0],
            }}
          >
            <img
              src={images.magnifyingGlass}
              alt="magnifying glass"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedMessage id="list-of-recent-stories" />
              <ul style={{ paddingLeft: 0 }}>
                {latestStories.map(story => (
                  <li style={{ marginTop: '0.5rem', listStylePosition: 'inside' }}>
                    <Link className="interactable" to={`/stories/${story._id}/practice`}>
                      <i>{story.title}</i>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default ListOfRecentStoriesFlashcardsEncouragement