import React, { useState, useEffect } from 'react'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Link, useParams } from 'react-router-dom'
import { images, backgroundColors } from 'Utilities/common'
import { useSelector, useDispatch } from 'react-redux'
import { dictionaryLanguageSelector } from 'Utilities/common'
import { getBlueFlashcards } from 'Utilities/redux/flashcardReducer'

const StoryCompletedToBluecardsExerciseEncouragement = () => {
  const [prevBlueCards, setPrevBlueCards] = useState(null)
  const userData = useSelector(state => state.user.data.user)
  const { creditableWordsNum, storyBlueCards } = useSelector(({ flashcards }) => flashcards)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const learningLanguage = userData ? userData.last_used_language : null
  const dispatch = useDispatch()
  const { id: storyId } = useParams()

  useEffect(() => {
    dispatch(getBlueFlashcards(learningLanguage, dictionaryLanguage, storyId))
  }, [])

  useEffect(() => {
    if (storyBlueCards?.length > 0) {
      const filteredBlueCards = storyBlueCards.filter(story => story.story_id !== storyId)
      if (filteredBlueCards?.length > 0) {
        setPrevBlueCards(filteredBlueCards[0])
      }
    }
  }, [storyBlueCards])

  return (
    <div>
      {creditableWordsNum >= 5 ? (
        <div className="pt-md">
          <div
            className="flex enc-message-body"
            style={{ alignItems: 'center', backgroundColor: backgroundColors[2] }}
          >
            <img
              src={images.flashcards}
              alt="flashcard batch"
              style={{ maxWidth: '8%', maxHeight: '8%', marginRight: '1em' }}
            />
            <div>
              <FormattedHTMLMessage
                id="story-completed-to-blue-flashcards"
                values={{ nWords: creditableWordsNum }}
              />
              &nbsp;
              <Link className="interactable" to={`/flashcards/fillin/test/${storyId}`}>
                <FormattedMessage id="go-to-blue-flashcards" />
              </Link>
            </div>
          </div>
        </div>
      )
        : prevBlueCards?.num_of_rewardable_words >= 5 ? (
          <div className="pt-md">
            <div
              className="flex enc-message-body"
              style={{ alignItems: 'center', backgroundColor: backgroundColors[1] }}
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
                <Link
                  className="interactable"
                  to={`/flashcards/fillin/test/${prevBlueCards.story_id}`}
                >
                  <FormattedMessage id="flashcards-review" />
                </Link>
              </div>
            </div>
          </div>
        ) : null}
    </div>
  )
}

export default StoryCompletedToBluecardsExerciseEncouragement