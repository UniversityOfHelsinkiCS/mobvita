import React from 'react'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { showIcon, closeEncouragement } from 'Utilities/redux/encouragementsReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import Draggable from 'react-draggable'
import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { images } from 'Utilities/common'

const FlashcardsPracticeEncouragement = ({ open, prevBlueCards }) => {
  const dispatch = useDispatch()
  const { width } = useWindowDimensions()
  const closeModal = () => {
    dispatch(showIcon())
    dispatch(closeEncouragement())
  }

  if (!prevBlueCards || prevBlueCards.length < 1 || prevBlueCards[0].num_of_rewardable_words < 1) {
    return null
  }
  console.log('pi ', open)

  if (open) {
    return (
      <Draggable cancel=".interactable">
        <div className={width > 700 ? 'draggable-encouragement' : 'draggable-encouragement-mobile'}>
          <div>
            <div className="flex-reverse">
              <Icon
                className="interactable"
                style={{
                  cursor: 'pointer',
                  marginBottom: '.25em',
                }}
                size="large"
                name="close"
                onClick={closeModal}
              />
            </div>
            <div
              className="flex enc-message-body"
              style={{ alignItems: 'center', backgroundColor: 'lightyellow' }}
            >
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
                <Link
                  className="interactable"
                  to={`/flashcards/fillin/test/${prevBlueCards[0].story_id}`}
                >
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
