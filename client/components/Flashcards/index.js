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

  if (width < 940) {
    return (
      <div className="flashcard-view" style={{ marginBottom: '-5em' }}>
        {content()}
        <FloatMenu />
        <ReportButton style={{ paddingRight: '.5em', alignSelf: 'flex-end' }} />
      </div>
    )
  }

  return (
    <div className="flashcard-view" style={{ marginBottom: '-5em' }}>
      <div style={{ display: 'flex', alignSelf: 'center', width: '100%', maxWidth: '1024px' }}>
        <FlashcardMenu />
        {content()}
      </div>
      <ReportButton style={{ alignSelf: 'flex-end' }} />
    </div>
  )
}

export default Flashcards
