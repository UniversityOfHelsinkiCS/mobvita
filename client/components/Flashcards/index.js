import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import BlueCardsTestEncouragement from 'Components/NewEncouragements/SubComponents/MultiPurpose/BlueCardsTestEncouragement'
import FlashcardMenu from './FlashcardMenu'
import FlashcardCreation from './FlashcardCreation'
import FloatMenu from './FloatMenu'
import Practice from './Practice'
import FlashcardList from './FlashcardList'

const Flashcards = () => {
  const [showBlueCardsTestEncouragement, setShowBlueCardsTestEncouragement] = useState(true)

  const { fcOpen } = useSelector(({ encouragement }) => encouragement)
  const history = useHistory()
  const { width } = useWindowDimensions()
  const { mode, type, storyId } = useParams()
  const {num_of_rewardable_words, title} = type === 'test' && useSelector(({ flashcards }) => 
    flashcards.storyBlueCards?.find(story => story.story_id === storyId)) || useSelector(({ stories }) => 
    stories.data?.find(story => story._id === storyId)) || {}
  const { storyBlueCards } = useSelector(({ flashcards }) => flashcards)

  useEffect(() => {
    if (storyBlueCards && storyBlueCards?.length > 0) {
      setShowBlueCardsTestEncouragement(true)
    }
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
    <div className="cont-tall cont pb-nm flex-col auto pt-xl">
      {
        title && type==='test' && (
          <h5 className="blue-flashcard-intro flex pb-nm" style={{marginBottom: '2em'}}>
            <FormattedHTMLMessage
                id="story-blue-cards"
                values={{
                  nWords: num_of_rewardable_words,
                  story: title,
                }}
            /></h5>
          
        ) || title && (
        <h5 className="flex pb-nm" style={{marginBottom: '2em'}}>
          <FormattedHTMLMessage
          id="story-flashcards"
          values={{
            story: title,
          }}
        /></h5>
        )
      }
      
      <div className="flex">
        {showBlueCardsTestEncouragement && (
          <BlueCardsTestEncouragement setShow={setShowBlueCardsTestEncouragement} />
        )}
        {width < 940 ? <FloatMenu /> : <FlashcardMenu />}
        {content()}
      </div>
    </div>
  )
}

export default Flashcards
