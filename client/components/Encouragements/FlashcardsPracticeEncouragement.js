import React from 'react'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import Draggable from 'react-draggable'
import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { images } from 'Utilities/common'

const FlashcardsPracticeEncouragement = ({ open, setOpen, prevBlueCards }) => {
  const closeModal = () => {
    setOpen(false)
  }

  if (!prevBlueCards || prevBlueCards.length < 1) {
    return null
  }

  if (open) {
    return (
      <Draggable cancel=".interactable">
        <div className="draggable-encouragement">
          <div style={{ margin: '.75em' }}>
            <div className="flex-reverse">
              <Icon
                className="interactable"
                style={{
                  cursor: 'pointer',
                  marginBottom: '.25em',
                }}
                size="large"
                name="window minimize"
                onClick={closeModal}
              />
            </div>
            <div className="flex" style={{ alignItems: 'center' }}>
              <img
                src={images.flashcards}
                alt="flashcard batch"
                style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
              />
              <div>
                <FormattedHTMLMessage
                  id="previous-stories-blue-cards"
                  values={{
                    nWords: prevBlueCards[0].num_of_rewardable_words,
                    story: prevBlueCards[0].title,
                  }}
                />
                &nbsp;
                <Link className="interactable" to={`/flashcards/fillin/test/${prevBlueCards[0].story_id}`}>
                  <FormattedMessage id="flashcards-review" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Draggable>
    )
  }

  return null
}

export default FlashcardsPracticeEncouragement
