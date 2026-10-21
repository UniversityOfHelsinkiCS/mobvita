// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import ChatBubble from 'Components/ui/ChatBubble'
import ChatSpinner from 'Components/ui/ChatSpinner'
import { dailyStoriesKey, requestDailyStories } from 'Utilities/redux/dialoguesReducer'
import { useLearningLanguage } from 'Utilities/common'

// How many cached stories the bubble asks for.
const DAILY_STORIES_SIZE = 5

// The import link for a cached story (see UploadCachedStory): adds it to the private library and
// opens its preview. An in-app route, so it is followed without a page reload.
const importPath = id => `/stories/cached?cached_id=${encodeURIComponent(id)}`

// The id the import link takes. `_id` is what the earlier cached-story list (metadata's
// `available_cached_stories`) used; the others are fallbacks in case the list endpoint names it so.
const cachedStoryId = story => story?._id ?? story?.cached_id ?? story?.id

/**
 * DailyStoriesBubble — the library assistant's opening offer: one bubble listing the recent cached
 * stories (GET /stories/cached). Clicking a title imports the story and opens its preview.
 *
 * The list comes from the stories API, not the AI agent: it no longer depends on how the agent
 * words its reply (and no agent call is spent on it). No stories, no bubble.
 */
const DailyStoriesBubble = ({ scope }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const learningLanguage = useLearningLanguage()
  const [dismissed, setDismissed] = useState(false)
  // The language last asked for, so each language is requested once.
  const requestedLanguage = useRef(null)

  // Newest offer for this view in the current learning language.
  const offer = useSelector(({ dialogues }) =>
    [...dialogues.items]
      .reverse()
      .find(
        item =>
          item.type === 'daily-stories' && item.scope === scope && item.language === learningLanguage,
      ),
  )
  const pending = useSelector(({ dialogues }) => !!dialogues.pending[dailyStoriesKey(scope)])

  // Asked once per session and language: the list lives in the dialogues store, so coming back to
  // the library shows the same offer; switching the learning language asks for that language's list.
  useEffect(() => {
    if (!learningLanguage || offer || pending) return
    if (requestedLanguage.current === learningLanguage) return
    requestedLanguage.current = learningLanguage
    dispatch(requestDailyStories(scope, learningLanguage, DAILY_STORIES_SIZE))
  }, [learningLanguage, offer, pending])

  const stories = (offer?.stories || []).filter(story => cachedStoryId(story) && story.title)

  if (dismissed) return null
  if (!pending && !stories.length) return null

  const handleStoryClick = (event, id) => {
    event.preventDefault()
    navigate(importPath(id))
  }

  return (
    <ChatBubble variant="bot" onRemove={() => setDismissed(true)} data-cy="daily-stories-bubble">
      <p>
        <FormattedMessage id="daily-stories-assistant-heading" />:
      </p>
      {pending ? (
        <ChatSpinner padding="8px 0 0" />
      ) : (
        <ul style={{ marginTop: 10, paddingLeft: '1.2em' }}>
          {stories.map(story => {
            const id = cachedStoryId(story)
            return (
              <li key={id} style={{ marginBottom: '0.4em' }}>
                <a
                  href={importPath(id)}
                  onClick={event => handleStoryClick(event, id)}
                  data-cy="daily-stories-item"
                >
                  {story.title}
                </a>
              </li>
            )
          })}
        </ul>
      )}
    </ChatBubble>
  )
}

export default DailyStoriesBubble
