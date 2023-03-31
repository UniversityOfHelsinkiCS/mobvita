import React, { useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import useWindowDimensions from 'Utilities/windowDimensions'
import { getStoriesBlueFlashcards } from 'Utilities/redux/flashcardReducer'
import { learningLanguageSelector, dictionaryLanguageSelector } from 'Utilities/common'
import { openEncouragement, openFCEncouragement } from 'Utilities/redux/encouragementsReducer'
import ReportButton from 'Components/ReportButton'
import FlashcardsPracticeEncouragement from 'Components/Encouragements/FlashcardsPracticeEncouragement'
import FlashcardMenu from './FlashcardMenu'
import FlashcardCreation from './FlashcardCreation'
import FloatMenu from './FloatMenu'
import Practice from './Practice'
import FlashcardList from './FlashcardList'
import Recommender from 'Components/NewEncouragements/Recommender'

const Flashcards = () => {
  const { open, fcOpen } = useSelector(({ encouragement }) => encouragement)
  const { storyBlueCards } = useSelector(({ flashcards }) => flashcards)
  const history = useHistory()
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const { width } = useWindowDimensions()
  const { mode } = useParams()
  const dispatch = useDispatch()

  const blueCardsTest = history.location.pathname.includes('test')

  const content = () => {
    switch (mode) {
      case 'new':
        return <FlashcardCreation />
      case 'list':
        return <FlashcardList />
      case 'article':
        return <Practice mode="article" open={fcOpen} />
      case 'quick':
        return <Practice mode="quick" open={fcOpen} />
      default:
        return <Practice mode="fillin" open={fcOpen} />
    }
  }

  // Change this to true when developing new encouragement!
  // REMEMBER TO SWITCH BACK TO FALSE BEFORE PUSHING!!!
  const TESTING_NEW_ENCOURAGEMENT = false

  return (
    <div className="cont-tall cont pb-nm flex-col auto pt-xl space-between">
      <div className="flex">
        {!blueCardsTest && (
          <div>
            {!TESTING_NEW_ENCOURAGEMENT && (
              <FlashcardsPracticeEncouragement
                open={open}
                prevBlueCards={storyBlueCards}
              />)
            }
            {TESTING_NEW_ENCOURAGEMENT &&
              (<Recommender />)}
          </div>
        )}
        {width < 940 ? <FloatMenu /> : <FlashcardMenu />}
        {content()}
      </div>
    </div>
  )
}

export default Flashcards
