import React from 'react'
import { useParams } from 'react-router-dom'
import useWindowDimensions from 'Utilities/windowDimensions'
import ReportButton from 'Components/ReportButton'
import FlashcardMenu from './FlashcardMenu'
import FlashcardCreation from './FlashcardCreation'
import FloatMenu from './FloatMenu'
import Practice from './Practice'
import FlashcardList from './FlashcardList'

const Flashcards = () => {
  const { width } = useWindowDimensions()
  const { mode } = useParams()

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

  return (
    <div className="cont-tall cont pb-nm flex-col auto space-between">
      <div className="flex">
        {width < 940 ? <FloatMenu /> : <FlashcardMenu />}
        {content()}
      </div>
      <ReportButton extraClass="align-self-end mr-sm" />
    </div>
  )
}

export default Flashcards
