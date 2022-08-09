import React from 'react'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import { Modal } from 'semantic-ui-react'
import { images } from 'Utilities/common'

const FlashcardsPracticeEncouragement = ({ open, setOpen, prevBlueCards }) => {
  const closeModal = () => {
    setOpen(false)
  }

  if (!prevBlueCards) {
    return null
  }

  return (
    <Modal
      basic
      open={open}
      size="tiny"
      centered={false}
      dimmer="blurring"
      closeIcon={{ style: { top: '2.5rem', right: '2.5rem' }, color: 'black', name: 'close' }}
      onClose={closeModal}
    >
      <Modal.Content>
        <div className="encouragement" style={{ padding: '1.5rem' }}>
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
                  nWords: prevBlueCards.num_of_rewardable_words,
                  story: prevBlueCards.title,
                }}
              />
              &nbsp;
              <Link to={`/flashcards/fillin/test/${prevBlueCards.story_id}`}>
                <FormattedMessage id="flashcards-review" />
              </Link>
            </div>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default FlashcardsPracticeEncouragement
