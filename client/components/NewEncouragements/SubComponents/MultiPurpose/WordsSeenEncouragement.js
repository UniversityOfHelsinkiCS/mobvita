import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React from 'react'
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router'
import { images, backgroundColors, showAllEncouragements } from "Utilities/common"
import { useSelector } from 'react-redux'

// Tells how many words were seen and links to the flashcards review.
const WordsSeenEncouragement = () => {
  const userData = useSelector(state => state.user.data.user)
  const { enable_recmd } = useSelector(({ user }) => user.data.user)

  const vocabularySeen = userData.vocabulary_seen

  return (
    <div>
      {(vocabularySeen > 0 && enable_recmd) || showAllEncouragements ?
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{ alignItems: 'center', backgroundColor: backgroundColors[2] }}
          >
            <img
              src={images.flashcardsColored}
              alt="flashcards"
              style={{ width: '8%', flexShrink: 0, marginRight: '1em' }}
            />
            <div>
              <FormattedHTMLMessage
                id="words-seen-encouragement"
                values={{ vocabulary_seen: vocabularySeen }}
              />
              &nbsp;
              <Link className="interactable" to="/flashcards">
                <FormattedMessage id="flashcards-review" />
              </Link>
              ?
            </div>
          </div>
        </div>
        : null}
    </div >
  )
}

export default WordsSeenEncouragement