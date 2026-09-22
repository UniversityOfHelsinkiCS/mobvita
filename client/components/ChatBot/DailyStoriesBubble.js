// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { FormattedMessage, useIntl } from 'react-intl'
import ChatBubble from 'Components/ui/ChatBubble'
import Spinner from 'Components/Spinner'
import { dailyStoriesKey, requestDailyStories } from 'Utilities/redux/dialoguesReducer'

// The prompt the assistant-api agent answers with a daily-story list. Localised, so it matches the
// burger-menu request the user can send by hand.
const DAILY_STORIES_PROMPT_ID = 'chatbot-message-suggestion-daily-stories'

// The agent links each story as a full {FRONTEND_URL}/stories/cached?cached_id=… URL. In-app those
// are just a route (see UploadCachedStory), so follow them without a page reload.
const CACHED_STORY_PATH = '/stories/cached'

const LIST_ITEM = /^\s{0,3}(?:[-*+]\s+|\d+[.)]\s+)/
// A lead-in the bubble's own heading already says, e.g. "Here are some daily stories:".
const LEAD_IN = /daily stor/i

// The agent opens with its own "Here are some daily stories:" line, which the heading above the
// list already says. Drop it: everything before the first list item, or a bare lead-in sentence
// when the reply carries no list at all.
const stripLeadIn = markdown => {
  const lines = (markdown ?? '').split('\n')
  const firstItem = lines.findIndex(line => LIST_ITEM.test(line))

  if (firstItem > 0) {
    const leadIn = lines.slice(0, firstItem).filter(line => line.trim())
    // Only a short preamble is a lead-in; anything longer is content worth keeping.
    if (leadIn.length && leadIn.length <= 2 && leadIn.some(line => LEAD_IN.test(line))) {
      return lines.slice(firstItem).join('\n')
    }
    return markdown
  }

  if (firstItem === -1 && LEAD_IN.test(lines[0] ?? '') && lines[0].trim().endsWith(':')) {
    return lines.slice(1).join('\n')
  }

  return markdown
}

/**
 * DailyStoriesBubble — the library assistant's opening offer: one bubble holding the agent's
 * clickable list of daily stories. Clicking one lands on /stories/cached, which imports the story
 * and opens its preview.
 *
 * The list comes from the assistant endpoint rather than `metadata.available_cached_stories`, which
 * is empty for most languages.
 */
const DailyStoriesBubble = ({ scope }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const intl = useIntl()
  const [dismissed, setDismissed] = useState(false)
  const requested = useRef(false)

  const offer = useSelector(({ dialogues }) =>
    dialogues.items.find(item => item.type === 'daily-stories' && item.scope === scope),
  )
  const pending = useSelector(({ dialogues }) => !!dialogues.pending[dailyStoriesKey(scope)])

  // Asked once per session: the reply lives in the dialogues store, so coming back to the library
  // shows the same list instead of costing another agent call.
  useEffect(() => {
    if (offer || pending || requested.current) return
    requested.current = true
    dispatch(requestDailyStories(intl.formatMessage({ id: DAILY_STORIES_PROMPT_ID }), scope))
  }, [])

  const handleLinkClick = (event, href) => {
    if (!href?.includes(CACHED_STORY_PATH)) return
    event.preventDefault()
    const { pathname, search } = new URL(href, window.location.origin)
    navigate(`${pathname}${search}`)
  }

  if (dismissed || (!offer && !pending)) return null

  return (
    <ChatBubble variant="bot" onRemove={() => setDismissed(true)}>
      <p style={{ marginTop: 0 }}>
        <FormattedMessage id="daily-stories-assistant-heading" />
      </p>
      {offer ? (
        <ReactMarkdown
          components={{
            a: ({ href, children }) => (
              <a href={href} onClick={event => handleLinkClick(event, href)}>
                {children}
              </a>
            ),
          }}
        >
          {stripLeadIn(offer.text)}
        </ReactMarkdown>
      ) : (
        <Spinner inline />
      )}
    </ChatBubble>
  )
}

export default DailyStoriesBubble
