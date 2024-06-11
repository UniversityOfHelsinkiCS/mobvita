import { backgroundColors, images, showAllEncouragements } from "Utilities/common"
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useHistory } from "react-router"
import { closeEncouragement, closeFCEncouragement } from "Utilities/redux/encouragementsReducer"

const PreviousStoriesBlueFlashcards = () => {
  const flashcards = useSelector(({ flashcards }) => flashcards)
  const { storyId } = useParams()
  const [prevStoriesBlueCards, setPrevStoriesBlueCards] = useState(null)
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    const filteredBlueCards = flashcards.storyBlueCards?.find(
      story => story.story_id !== storyId && story.num_of_rewardable_words >= 5
    )

    if (filteredBlueCards) {
      setPrevStoriesBlueCards(filteredBlueCards)
    }
  }, [flashcards.storyBlueCards])

  const handleClick = () =>{
    dispatch(closeFCEncouragement())
    dispatch(closeEncouragement())
    history.push(`/flashcards/fillin/test/${prevStoriesBlueCards.story_id}`)
  }

  return (
    <div>
      {prevStoriesBlueCards || showAllEncouragements ? (
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{
              alignItems: 'center',
              backgroundColor: backgroundColors[2],
            }}
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
                  nWords: prevStoriesBlueCards?.num_of_rewardable_words,
                  story: prevStoriesBlueCards?.title,
                }}
              />
              &nbsp;
              <Button
                className="interactable"
                onClick={() => handleClick()}
              >
                <FormattedMessage id="flashcards-review" />
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default PreviousStoriesBlueFlashcards
