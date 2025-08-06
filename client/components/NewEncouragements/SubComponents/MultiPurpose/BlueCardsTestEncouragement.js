import { dictionaryLanguageSelector, images, showAllEncouragements } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getStoriesBlueFlashcards } from 'Utilities/redux/flashcardReducer'
import { useHistory } from 'react-router'

import './PracticeCompletedEncouragement/PracticeCompletedStyles.css'

const BlueCardsTestEncouragement = ({ setShow }) => {
  const { storyBlueCards } = useSelector(({ flashcards }) => flashcards)
  const userData = useSelector(state => state.user.data.user)
  const learningLanguage = userData ? userData.last_used_language : null
  const [prevBlueCards, setPrevBlueCards] = useState(null)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const dispatch = useDispatch()
  const history = useHistory()

  const bigScreen = useWindowDimensions().width > 700

  useEffect(() => {
    dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
    if (storyBlueCards?.length > 0) {
      setPrevBlueCards(storyBlueCards[0])
    } else {
      setPrevBlueCards(null)
    }
  }, [])

  const startTest = () => {
    setShow(false)
    history.push(`/flashcards/fillin/test/${prevBlueCards.story_id}`)
  }

  if (!prevBlueCards && !showAllEncouragements) {
    return null
  }

  return (
    <div className={bigScreen ? 'draggable-encouragement' : 'draggable-encouragement-mobile'}>
      <div className="col-flex">
        <div className="practice-completed-container">
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
          <div className="practice-completed-button-group">
            <Button variant="primary" type="button" onClick={startTest}>
              <FormattedMessage id="start-test" />
            </Button>
            <Button variant="secondary" type="button" onClick={() => setShow(false)}>
              <FormattedMessage id="blue-cards-test-encouragement-dismiss-button" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlueCardsTestEncouragement
