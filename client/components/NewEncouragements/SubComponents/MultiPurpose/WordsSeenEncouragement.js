import React from 'react'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import { images, backgroundColors, showAllEncouragements } from "Utilities/common"
import { useSelector } from 'react-redux'

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
              src={images.flashcards}
              alt="flashcards"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
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