import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import useWindowDimensions from 'Utilities/windowDimensions'
import { useLearningLanguage, useDictionaryLanguage } from 'Utilities/common'
import { getFlashcards, getAllFlashcards } from 'Utilities/redux/flashcardReducer'
import FlashcardMenu from './FlashcardMenu'
import FlashcardCreation from './FlashcardCreation'
import FloatMenu from './FloatMenu'
import Practice from './Practice'
import FlashcardList from './FlashcardList'

const Flashcards = () => {
  const smallScreen = useWindowDimensions().width < 940
  const { mode, storyId } = useParams()
  const dispatch = useDispatch()

  const learningLanguage = useLearningLanguage()
  const dictionaryLanguage = useDictionaryLanguage()

  useEffect(() => {
    if (mode === 'list') dispatch(getAllFlashcards(learningLanguage, dictionaryLanguage, storyId))
    else dispatch(getFlashcards(learningLanguage, dictionaryLanguage, storyId))
  }, [storyId, mode])

  const content = () => {
    switch (mode) {
      case 'new':
        return <FlashcardCreation />
      case 'list':
        return <FlashcardList />
      case 'article':
        return <Practice mode="article" />
      case 'quick':
        return <Practice mode="quick" />
      default:
        return <Practice mode="fillin" />
    }
  }

  if (smallScreen) {
    return (
      <div className="component-container">
        {content()}
        <FloatMenu />
      </div>
    )
  }

  return (
    <div className="component-container flex">
      <FlashcardMenu />
      {content()}
    </div>
  )
}

export default Flashcards
