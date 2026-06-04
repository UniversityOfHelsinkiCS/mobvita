import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import { dictionaryLanguageSelector, images, showAllEncouragements } from 'Utilities/common'
import { FormattedMessage } from 'react-intl';
import { Button } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStoriesBlueFlashcards } from 'Utilities/redux/flashcardReducer'
import { useNavigate, useLocation } from 'react-router-dom'

import './Encouragements.css'

const BlueCardsTestEncouragement = ({ setShow, storyId, storyTitle, blueCardCount }) => {
  const [prevBlueCards, setPrevBlueCards] = useState(null)

  const { storyBlueCards } = useSelector(({ flashcards }) => flashcards)
  const userData = useSelector(state => state.user.data.user)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const inStoryPractice = location.pathname.includes('stories')
  const learningLanguage = userData ? userData.last_used_language : null
  const resolvedStoryId = storyId ?? prevBlueCards?.story_id
  const resolvedStoryTitle = storyTitle ?? prevBlueCards?.title
  const resolvedBlueCardCount = blueCardCount ?? prevBlueCards?.num_of_rewardable_words

  useEffect(() => {
    if (storyId) return

    if (!storyBlueCards) {
      dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
      return
    }
    if (storyBlueCards.length > 0) {
      setPrevBlueCards(storyBlueCards[0])
    } else {
      navigate('/home')
    }
  }, [storyBlueCards])

  const startTest = () => {
    setShow(false)
    if (resolvedStoryId) {
      navigate(`/flashcards/fillin/test/${resolvedStoryId}`)
    }
  }

  const secondaryTestButton = () => {
    setShow(false)
    if (inStoryPractice) {
      navigate('/home')
    }
  }

  if (!resolvedStoryId && !prevBlueCards && !showAllEncouragements) {
    return null
  }

  return (
    <div className="encouragement-container">
      <div className="encouragement-message-container">
        <img src={images.flashcards} alt="flashcard batch" />
        <h2>
          <FormattedMessage
            id="blue-cards-test-encouragement-title"
            values={{ nWords: resolvedBlueCardCount }}
          />
        </h2>
        <h5>
          <FormattedHTMLMessage id="blue-cards-test-encouragement-message" />{': '}
          <span style={{ fontStyle: 'italic' }}>{resolvedStoryTitle}</span>
        </h5>
      </div>
      <div className="encouragement-button-group">
        <Button variant="primary" type="button" onClick={startTest}>
          <FormattedMessage id="start-test" />
        </Button>
        <Button variant="secondary" type="button" onClick={secondaryTestButton}>
          <FormattedMessage
            id={inStoryPractice ? 'home' : 'blue-cards-test-encouragement-dismiss-button'}
          />
        </Button>
      </div>
    </div>
  )
}

export default BlueCardsTestEncouragement
