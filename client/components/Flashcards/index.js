import React from 'react'
import { useHistory } from 'react-router-dom'
import useWindowDimensions from 'Utilities/windowDimensions'
import { hiddenFeatures } from 'Utilities/common'
import FlashcardMenu from './FlashcardMenu'
import Fillin from './Fillin'
import FlashcardCreation from './FlashcardCreation'
import FloatMenu from './FloatMenu'

const Flashcards = ({ location }) => {
  const smallScreen = useWindowDimensions().width < 800
  const history = useHistory()

  if (!hiddenFeatures) return <Fillin />

  const content = () => {
    switch (location.pathname) {
      case '/flashcards':
        if (!smallScreen) {
          history.push('/flashcards/all')
        }
        return <FlashcardMenu />
      case '/flashcards/all':
        return <Fillin />
      case '/flashcards/new':
        return <FlashcardCreation />
      default:
        return <Fillin />
    }
  }

  if (smallScreen) {
    return (
      <div>
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
