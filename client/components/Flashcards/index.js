import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import useWindowDimensions from 'Utilities/windowDimensions'
import BlueCardsTestEncouragement from 'Components/Encouragements/BlueCardsTestEncouragement'
import FlashcardMenu from './FlashcardMenu'
import FlashcardCreation from './FlashcardCreation'
import FloatMenu from './FloatMenu'
import Practice from './Practice'
import FlashcardList from './FlashcardList'
import { FlashcardStoryInfo, FlashcardStoryInfoIcon } from './FlashcardStoryInfo'
import AppTabs from 'Components/ui/AppTabs'
import StyleOutlinedIcon from '@mui/icons-material/StyleOutlined'
import AddIcon from '@mui/icons-material/Add'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import { FormattedMessage } from 'react-intl'
import { colors } from 'Assets/mui_theme/designTokens'
import SettingButton from 'Components/SettingsButton'
import GeneralChatbot from 'Components/ChatBot/GeneralChatbot'
import HelperSidebar from 'Components/PracticeView/HelperSidebar'

const Flashcards = () => {
  const [hasAnsweredBlueCards, setHasAnsweredBlueCards] = useState(false)
  const [showBlueCardsTestEncouragement, setShowBlueCardsTestEncouragement] = useState(false)
  const [hasHandledBlueCardsPrompt, setHasHandledBlueCardsPrompt] = useState(false)
  const encouragementTimeoutRef = useRef(null)

  const navigate = useNavigate()
  const location = useLocation()

  const { width } = useWindowDimensions()
  const { mode, type, storyId } = useParams()

  const isSidebarOpen = useSelector(state => state.helperSidebar?.isOpen ?? false)

  const { fcOpen } = useSelector(({ encouragement }) => encouragement)
  const blueCardStory = useSelector(({ flashcards }) =>
    flashcards.storyBlueCards?.find(story => story.story_id === storyId)
  )
  const regularStory = useSelector(({ stories }) =>
    stories.data?.find(story => story._id === storyId)
  )
  const selectedStory = type === 'test' ? blueCardStory : regularStory
  const { num_of_rewardable_words: numOfRewardableWords, title } = selectedStory || {}
  const { storyBlueCards } = useSelector(({ flashcards }) => flashcards)
  const shouldShowStoryInfo =
    mode !== 'list' &&
    mode !== 'new' &&
    Boolean(storyId) &&
    (type === 'story' || type === 'test') &&
    Boolean(title)

  const inBlueCardsTest = location.pathname.includes('test')

  // Reset prompt state only when user moves to creation/list views.
  useEffect(() => {
    if (mode === 'new' || mode === 'list') {
      setHasHandledBlueCardsPrompt(false)
      setShowBlueCardsTestEncouragement(false)
    }
  }, [mode])

  useEffect(() => {
    if (inBlueCardsTest || type === 'test' || mode !== 'fillin') {
      if (encouragementTimeoutRef.current) {
        clearTimeout(encouragementTimeoutRef.current)
        encouragementTimeoutRef.current = null
      }
      setShowBlueCardsTestEncouragement(false)
      return
    }

    if (encouragementTimeoutRef.current) {
      clearTimeout(encouragementTimeoutRef.current)
      encouragementTimeoutRef.current = null
    }

    if (
      !hasHandledBlueCardsPrompt &&
      !hasAnsweredBlueCards &&
      !inBlueCardsTest &&
      type !== 'test' &&
      storyBlueCards?.length > 0
    ) {
      encouragementTimeoutRef.current = setTimeout(() => {
        setShowBlueCardsTestEncouragement(true)
      }, 2000)
    } else {
      setShowBlueCardsTestEncouragement(false)
    }

    return () => {
      if (encouragementTimeoutRef.current) {
        clearTimeout(encouragementTimeoutRef.current)
        encouragementTimeoutRef.current = null
      }
    }
  }, [storyBlueCards, hasAnsweredBlueCards, hasHandledBlueCardsPrompt, inBlueCardsTest, type, mode])

  const handleBlueCardsPromptVisibility = show => {
    setShowBlueCardsTestEncouragement(show)
    if (!show) {
      setHasHandledBlueCardsPrompt(true)
    }
  }

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

  const pushWithOptionalContext = nextMode => {
    if (type && storyId) {
      navigate(`/flashcards/${nextMode}/${type}/${storyId}`)
    } else {
      navigate(`/flashcards/${nextMode}`)
    }
  }

  const activeTab = mode === 'new' ? 'new' : mode === 'list' ? 'list' : 'fillin'

  const flashcardTabs = [
    {
      value: 'fillin',
      label: <FormattedMessage id="Practice flashcards" />,
      icon: <StyleOutlinedIcon />,
    },
    {
      value: 'list',
      label: <FormattedMessage id="Flashcard list" />,
      icon: <FormatListBulletedIcon />,
    },
    { value: 'new', label: <FormattedMessage id="Add flashcard" />, icon: <AddIcon /> },
  ]

  const handleTabChange = value => {
    if (value === 'new') navigate('/flashcards/new')
    else pushWithOptionalContext(value)
  }

  return (
    <div className={`cont-tall cont pb-nm flex-col auto ${isSidebarOpen ? 'sidebar-pushed' : ''}`}>
      <div data-cy="library-controls" style={{ margin: '1.5em 0 20px' }}>
        <AppTabs tabs={flashcardTabs} value={activeTab} onChange={handleTabChange} fullWidth />
      </div>

      <div
        className="flashcard-body"
        style={{ backgroundColor: colors.card, borderRadius: 30 }}
      >
        {mode !== 'list' && mode !== 'new' ? (
          width >= 840 ? (
            <div className="flashcard-side-column">
              {shouldShowStoryInfo ? (
                <FlashcardStoryInfo
                title={title}
                type={type}
                numOfRewardableWords={numOfRewardableWords}
                />
              ) : <div></div>}
              <FlashcardMenu />
            </div>
          ) : (
            <div className="flashcard-story-info-icon-slot">
              {shouldShowStoryInfo ? (
                <FlashcardStoryInfoIcon
                  title={title}
                  type={type}
                  numOfRewardableWords={numOfRewardableWords}
                />
              ) : null}
            </div>
          )
        ) : null}

        {showBlueCardsTestEncouragement && (
          <div
            className={width > 700 ? 'draggable-encouragement' : 'draggable-encouragement-mobile'}
          >
            <div className="col-flex">
              <BlueCardsTestEncouragement setShow={handleBlueCardsPromptVisibility} />
            </div>
          </div>
        )}

        {width < 840 ? <FloatMenu /> : null}

        <div className="flashcard-main">{content()}</div>

        <div className="flashcard-arrow-button" id="flashcard-arrow-slot" />

        <SettingButton />
      </div>

      <HelperSidebar>
        <GeneralChatbot />
      </HelperSidebar>
    </div>
  )
}

export default Flashcards
