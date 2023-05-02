import React from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import useWindowDimensions from 'Utilities/windowDimensions'
import FlashcardMenu from './FlashcardMenu'
import FlashcardCreation from './FlashcardCreation'
import FloatMenu from './FloatMenu'
import Practice from './Practice'
import FlashcardList from './FlashcardList'

const Flashcards = () => {
  const { fcOpen } = useSelector(({ encouragement }) => encouragement)
  const history = useHistory()
  const { width } = useWindowDimensions()
  const { mode } = useParams()

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
        {width < 940 ? <FloatMenu /> : <FlashcardMenu />}
        {content()}
      </div>
    </div>
  )
}

export default Flashcards
