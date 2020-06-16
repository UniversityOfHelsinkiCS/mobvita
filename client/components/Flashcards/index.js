import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import useWindowDimensions from 'Utilities/windowDimensions'
import { useLearningLanguage, useDictionaryLanguage, hiddenFeatures } from 'Utilities/common'
import { getFlashcards } from 'Utilities/redux/flashcardReducer'
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
    dispatch(getFlashcards(learningLanguage, dictionaryLanguage, storyId))
  }, [storyId, mode])

  const content = () => {
    switch (mode) {
      case 'new':
        return <FlashcardCreation />
      case 'list':
        return hiddenFeatures ? <FlashcardList /> : <Practice mode="fillin" />
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
