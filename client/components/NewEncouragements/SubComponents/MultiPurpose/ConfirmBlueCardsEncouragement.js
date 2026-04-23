import { backgroundColors,
  dictionaryLanguageSelector,
  images,
  showAllEncouragements
} from "Utilities/common"
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStoriesBlueFlashcards } from 'Utilities/redux/flashcardReducer'
import { closeEncouragement, closeFCEncouragement } from "Utilities/redux/encouragementsReducer"
import { useNavigate } from "react-router-dom"

const ConfirmBlueCardsEncouragement = () => {
  const { storyBlueCards } = useSelector(({ flashcards }) => flashcards)
  const userData = useSelector(state => state.user.data.user)
  const learningLanguage = userData ? userData.last_used_language : null
  const [prevBlueCards, setPrevBlueCards] = useState(null)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
    if (storyBlueCards?.length > 0) {
      setPrevBlueCards(storyBlueCards[0])
    } else {
      setPrevBlueCards(null)
    }
  }, [storyBlueCards])

  const handleClick = () =>{
    dispatch(closeFCEncouragement())
    dispatch(closeEncouragement())
    navigate(`/flashcards/fillin/test/${prevBlueCards.story_id}`)
  }

  if (!prevBlueCards && !showAllEncouragements) {
    return null
  }

  return (
    <div>
      {prevBlueCards?.num_of_rewardable_words >= 5 ? (
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{ alignItems: 'center', backgroundColor: backgroundColors[0] }}
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
                  nWords: prevBlueCards?.num_of_rewardable_words,
                  story: prevBlueCards?.title }}
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
    </div >
  )
}
export default ConfirmBlueCardsEncouragement
