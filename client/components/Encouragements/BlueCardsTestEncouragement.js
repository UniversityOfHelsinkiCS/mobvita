import { dictionaryLanguageSelector, images, showAllEncouragements } from 'Utilities/common'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStoriesBlueFlashcards } from 'Utilities/redux/flashcardReducer'
import { useHistory } from 'react-router'

import './Encouragements.css'

const BlueCardsTestEncouragement = ({ setShow }) => {
  const [prevBlueCards, setPrevBlueCards] = useState(null)

  const { storyBlueCards } = useSelector(({ flashcards }) => flashcards)
  const userData = useSelector(state => state.user.data.user)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)

  const dispatch = useDispatch()
  const history = useHistory()

  const inStoryPractice = history.location.pathname.includes('stories')
  const learningLanguage = userData ? userData.last_used_language : null

  useEffect(() => {
    if (!storyBlueCards) {
      dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
      return
    }
    if (storyBlueCards.length > 0) {
      setPrevBlueCards(storyBlueCards[0])
    } else {
      history.push('/home')
    }
  }, [storyBlueCards])

  const startTest = () => {
    setShow(false)
    history.push(`/flashcards/fillin/test/${prevBlueCards.story_id}`)
  }

  const handleSecondaryButtonClick = () => {
    setShow(false)

    if (inStoryPractice) {
      history.push('/home')
    }
  }

  if (!prevBlueCards && !showAllEncouragements) {
    return null
  }

  return (
    <div className="encouragement-container">
      <div className="encouragement-message-container">
        <img src={images.flashcards} alt="flashcard batch" />
        <h2>
          <FormattedMessage
            id="blue-cards-test-encouragement-title"
            values={{ nWords: prevBlueCards?.num_of_rewardable_words }}
          />
        </h2>
        <h5>
          <FormattedMessage id="blue-cards-test-encouragement-message" />{' '}
          <span style={{ fontStyle: 'italic' }}>{prevBlueCards?.title}</span>
        </h5>
      </div>
      <div className="encouragement-button-group">
        <Button variant="primary" type="button" onClick={startTest}>
          <FormattedMessage id="start-test" />
        </Button>
        <Button variant="secondary" type="button" onClick={handleSecondaryButtonClick}>
          <FormattedMessage
            id={inStoryPractice ? 'home' : 'blue-cards-test-encouragement-dismiss-button'}
          />
        </Button>
      </div>
    </div>
  )
}

export default BlueCardsTestEncouragement
