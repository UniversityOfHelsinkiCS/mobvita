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

  useEffect(() => {
    dispatch(getStoriesBlueFlashcards(learningLanguage, dictionaryLanguage))
    dispatch(openEncouragement)
    dispatch(openFCEncouragement)
  }, [])

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

  return (
    <div className="cont-tall cont pb-nm flex-col auto pt-xl space-between">
      <div className="flex">
        {!blueCardsTest && (
          <FlashcardsPracticeEncouragement
            open={open}
            prevBlueCards={storyBlueCards}
          />
        )}
        {width < 940 ? <FloatMenu /> : <FlashcardMenu />}
        {content()}
      </div>
    </div>
  )
}

export default Flashcards
