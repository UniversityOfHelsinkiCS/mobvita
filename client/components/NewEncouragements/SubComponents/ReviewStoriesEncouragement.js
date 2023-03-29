import { backgroundColors, images } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const ReviewStoriesEncouragement = () => {
  const [storiesToReview, setStoriesToReview] = useState([])
  const { incomplete: incompleteStories } = useSelector(({ incomplete }) => ({
    incomplete: incomplete.data,
  }))
  useEffect(() => {
    if (incompleteStories?.length > 0) {
      // checks for stories that are complete using incompletes data
      const readyToReview = incompleteStories.filter(
        story => story.last_snippet_id === story.num_snippets - 1
      )
      const previousStories = []
      // takes the latest 3
      for (let i = readyToReview.length - 1; i >= 0 && i >= readyToReview.length - 3; i--) {
        previousStories.push(readyToReview[i])
      }

      setStoriesToReview(previousStories)
    }
  }, [incompleteStories])

  return (
    <div>
      {storiesToReview === [] ? null : (
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{ alignItems: 'center', backgroundColor: backgroundColors[1] }}
          >
            <img
              src={images.magnifyingGlass}
              alt="magnifying glass"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedMessage id="review-recent-stories" />
              <ul style={{ paddingLeft: 0 }}>
                {storiesToReview.map(story => (
                  <li key={story.id} style={{ marginTop: '0.5rem', listStylePosition: 'inside' }}>
                    <Link className="interactable" to={`/stories/${story._id}/review`}>
                      <i>{story.title}</i>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default ReviewStoriesEncouragement
