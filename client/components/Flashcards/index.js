import React, { useState, useEffect } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FormattedHTMLMessage, useIntl } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import BlueCardsTestEncouragement from 'Components/Encouragements/BlueCardsTestEncouragement'
import FlashcardMenu from './FlashcardMenu'
import FlashcardCreation from './FlashcardCreation'
import FloatMenu from './FloatMenu'
import Practice from './Practice'
import FlashcardList from './FlashcardList'
import LibraryTabs from 'Components/LibraryTabs'

const Flashcards = () => {
  const [hasAnsweredBlueCards, setHasAnsweredBlueCards] = useState(false)
  const [showBlueCardsTestEncouragement, setShowBlueCardsTestEncouragement] = useState(false)
  const [activeTab, setActiveTab] = useState('practice')

  const intl = useIntl()

  const history = useHistory()
  const { width } = useWindowDimensions()
  const { mode, type, storyId } = useParams()

  const { fcOpen } = useSelector(({ encouragement }) => encouragement)
  const { num_of_rewardable_words: numOfRewardableWords, title } =
    (type === 'test' &&
      useSelector(({ flashcards }) =>
        flashcards.storyBlueCards?.find(story => story.story_id === storyId)
      )) ||
    useSelector(({ stories }) => stories.data?.find(story => story._id === storyId)) ||
    {}
  const { storyBlueCards } = useSelector(({ flashcards }) => flashcards)

  const inBlueCardsTest = history.location.pathname.includes('test')

  useEffect(() => {
    if (
      !hasAnsweredBlueCards &&
      !inBlueCardsTest &&
      type !== 'test' &&
      storyBlueCards?.length > 0
    ) {
      setTimeout(() => {
        setShowBlueCardsTestEncouragement(true)
      }, 2000)
    }
  }, [storyBlueCards])

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
        return (
          <Practice mode="fillin" open={fcOpen} setHasAnsweredBlueCards={setHasAnsweredBlueCards} />
        )
    }
  }

  const TAB_PRACTICE = intl.formatMessage({ id: 'practice-flashcards' })
  const TAB_ADD = intl.formatMessage({ id: 'add-new-flashcard' })
  const TAB_ALL = intl.formatMessage({ id: 'Flashcard list' })

  const tabValues = {
    [TAB_PRACTICE]: activeTab === 'practice',
    [TAB_ADD]: activeTab === 'add',
    [TAB_ALL]: activeTab === 'all',
  }

  const handleTabChange = (tabKey) => {
    if (tabKey === TAB_PRACTICE) setActiveTab('practice')
    if (tabKey === TAB_ADD) setActiveTab('add')
    if (tabKey === TAB_ALL) setActiveTab('all')
  }

  return (
    <div className="cont-tall cont pb-nm flex-col auto pt-xl">
       <div data-cy="library-controls" className="library-control">
        <LibraryTabs
          values={tabValues}
          onClick={handleTabChange}
        />
       </div>

      {(title && type === 'test' && (
        <h5 className="blue-flashcard-intro flex pb-nm" style={{ marginBottom: '2em' }}>
          <FormattedHTMLMessage
            id="story-blue-cards"
            values={{
              nWords: numOfRewardableWords,
              story: title,
            }}
          />
        </h5>
      )) ||
        (title && (
          <h5 className="flex pb-nm" style={{ marginBottom: '2em' }}>
            <FormattedHTMLMessage
              id="story-flashcards"
              values={{
                story: title,
              }}
            />
          </h5>
        ))}

      <div className="flex">
        {showBlueCardsTestEncouragement && (
          <div
            className={width > 700 ? 'draggable-encouragement' : 'draggable-encouragement-mobile'}
          >
            <div className="col-flex">
              <BlueCardsTestEncouragement setShow={setShowBlueCardsTestEncouragement} />
            </div>
          </div>
        )}
        {width < 940 ? <FloatMenu /> : <FlashcardMenu />}
        {content()}
      </div>
    </div>
  )
}

export default Flashcards
