import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import AppButton from 'Components/AppButton'

import './Encouragements.css'

// How many unfinished stories the bubble names; the rest are counted.
const MAX_LISTED = 3

// Teacher-controlled stories are split out into ControlledStoriesEncouragement, so everything
// reaching this bubble takes the ordinary practice route.
const practicePath = story => `/stories/${story._id}/practice`

// Chat-layout reminder of the group's unfinished stories, drawn inside an assistant recommendation
// bubble (which owns the icon and the dismiss X).
const GroupStoriesEncouragement = ({ stories, groupName }) => {
  const navigate = useNavigate()
  const savedLibrary = useSelector(({ user }) => user.data?.user?.last_selected_library)
  // Library tabs don't change the URL, so the open tab comes from the saved selection.
  const inGroupLibrary = useLocation().pathname.startsWith('/library') && savedLibrary === 'group'
  const listed = stories.slice(0, MAX_LISTED)
  const notListed = stories.length - listed.length

  return (
    <>
      <strong className="encouragement-chat-title">
        <FormattedMessage id="group-stories-recommendation-title" />
      </strong>
      <p className="encouragement-chat-message">
        <FormattedMessage
          id="group-stories-recommendation-message"
          values={{ count: stories.length, group: groupName }}
        />
      </p>
      <ul data-cy="group-stories-list">
        {listed.map(story => (
          <li key={story._id}>
            <Link to={practicePath(story)}>{story.title}</Link>
          </li>
        ))}
      </ul>      
      {!inGroupLibrary && (
        <AppButton
          variant="contrast"
          size="sm"
          type="button"
          onClick={() => navigate('/library/group')}
          style={{ marginTop: 10 }}
        >
          <FormattedMessage id="group-stories-recommendation-open" />
        </AppButton>
      )}
    </>
  )
}

export default GroupStoriesEncouragement
