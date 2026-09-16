// eslint-disable-next-line no-unused-vars
import React from 'react'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'

/**
 * FlashcardStoryInfoText — which deck the user is practising, as a bare line of text with no
 * surface of its own, so the caller decides where it sits. The flashcards assistant renders it in
 * a hint ChatBubble; it used to be a floating white card beside the deck (and an ⓘ tooltip on
 * narrow screens), which is why the card/icon wrappers are gone.
 */
export const FlashcardStoryInfoText = ({ title, type, numOfRewardableWords }) => {
  if (!title) return null

  const truncatedTitle = title.length > 50 ? `${title.slice(0, 50)}...` : title

  return type === 'test' ? (
    <FormattedHTMLMessage
      id="story-blue-cards"
      values={{ nWords: numOfRewardableWords, story: truncatedTitle }}
    />
  ) : (
    <FormattedHTMLMessage id="story-flashcards" values={{ story: truncatedTitle }} />
  )
}

export default FlashcardStoryInfoText
