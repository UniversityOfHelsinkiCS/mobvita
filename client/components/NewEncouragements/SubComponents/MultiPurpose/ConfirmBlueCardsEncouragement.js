import { backgroundColors, dictionaryLanguageSelector, images } from 'Utilities/common'
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStoriesBlueFlashcards } from 'Utilities/redux/flashcardReducer'

const ConfirmBlueCardsEncouragement = () => {
  const { storyBlueCards } = useSelector(({ flashcards }) => flashcards)
  const userData = useSelector(state => state.user.data.user)
  const learningLanguage = userData ? userData.last_used_language : null
  const [prevBlueCards, setPrevBlueCards] = useState(null)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
    if (storyBlueCards?.length > 0) {
      setPrevBlueCards(storyBlueCards[0])
    } else {
      setPrevBlueCards(null)
    }
  }, [storyBlueCards])

  if (!prevBlueCards) {
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
                  nWords: prevBlueCards.num_of_rewardable_words,
                  story: prevBlueCards.title,
                }}
              />
              &nbsp;
              <Link className="interactable" to={`/flashcards/fillin/test/${prevBlueCards.story_id}`}>
                <FormattedMessage id="flashcards-review" />
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div >
  )
}
export default ConfirmBlueCardsEncouragement
