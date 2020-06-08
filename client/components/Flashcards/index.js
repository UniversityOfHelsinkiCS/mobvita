import React from 'react'
import { useParams } from 'react-router-dom'
import useWindowDimensions from 'Utilities/windowDimensions'
import FlashcardMenu from './FlashcardMenu'
import FlashcardCreation from './FlashcardCreation'
import FloatMenu from './FloatMenu'
import Practice from './Practice'

const Flashcards = () => {
  const smallScreen = useWindowDimensions().width < 940

  const { mode } = useParams()

  const content = () => {
    switch (mode) {
      case 'new':
        return <FlashcardCreation />
      case 'article':
        return <Practice mode="article" />
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
