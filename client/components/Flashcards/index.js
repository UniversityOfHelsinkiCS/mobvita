import React from 'react'
import useWindowDimensions from 'Utilities/windowDimensions'
import { hiddenFeatures } from 'Utilities/common'
import FlashcardMenu from './FlashcardMenu'
import FlashcardCreation from './FlashcardCreation'
import FloatMenu from './FloatMenu'
import Practice from './Practice'

const Flashcards = ({ location }) => {
  const smallScreen = useWindowDimensions().width < 940

  const content = () => {
    switch (location.pathname) {
      case '/flashcards/new':
        return <FlashcardCreation />
      case '/flashcards/article':
        return hiddenFeatures ? <Practice mode="article" /> : <Practice mode="fillin" />
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
