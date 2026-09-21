import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import useWindowDimensions from 'Utilities/windowDimensions'
import FlashcardMenu from './FlashcardMenu'
import FlashcardCreation from './FlashcardCreation'
import FloatMenu from './FloatMenu'
import Practice from './Practice'
import FlashcardList from './FlashcardList'
import AppTabs from 'Components/ui/AppTabs'
import { FormattedMessage } from 'react-intl'
import { images, ACCESS, useHasAccess } from 'Utilities/common'
import { colors } from 'Assets/mui_theme/designTokens'
import SettingButton from 'Components/SettingsButton'
import FlashcardsChatbot from 'Components/ChatBot/FlashcardsChatbot'
import HelperSidebar from 'Components/PracticeView/HelperSidebar'

import './Flashcards.scss'

const Flashcards = () => {
  const [hasAnsweredBlueCards, setHasAnsweredBlueCards] = useState(false)
  const [showBlueCardsTestEncouragement, setShowBlueCardsTestEncouragement] = useState(false)
  const [hasHandledBlueCardsPrompt, setHasHandledBlueCardsPrompt] = useState(false)
  const encouragementTimeoutRef = useRef(null)

  const navigate = useNavigate()
  const canUseAssistant = useHasAccess(ACCESS.HIGH)
  const location = useLocation()

  const { width } = useWindowDimensions()
  const { mode, type, storyId } = useParams()

  const isSidebarOpen = useSelector(state => state.helperSidebar?.isOpen ?? false)

  const { fcOpen } = useSelector(({ encouragement }) => encouragement)
  const { storyBlueCards } = useSelector(({ flashcards }) => flashcards)

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

  const tabIcon = src => <img src={src} alt="" style={{ width: 20, height: 20 }} />
  const flashcardTabs = [
    {
      value: 'fillin',
      label: <FormattedMessage id="Practice flashcards" />,
      icon: tabIcon(images.cardsIcon),
    },
    {
      value: 'list',
      label: <FormattedMessage id="Flashcard list" />,
      icon: tabIcon(images.dotpoints01),
    },
    { value: 'new', label: <FormattedMessage id="Add flashcard" />, icon: tabIcon(images.plusOutline) },
  ]

  const handleTabChange = value => {
    if (value === 'new') navigate('/flashcards/new')
    else pushWithOptionalContext(value)
  }

  return (
    <div className="cont-tall flex-col space-between align-center">
      {/* Match ReadViews: stretch the row, center the content block, and let the main card fill it. */}
      <div className="flex mb-nm" style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
        <div className={`cont pb-nm flex-col ${isSidebarOpen ? 'sidebar-pushed' : ''}`} style={{ flex: 1 }}>
          <div data-cy="library-controls" style={{ margin: '0 0 1.7em 0' }}>
            <AppTabs tabs={flashcardTabs} value={activeTab} onChange={handleTabChange} fullWidth />
          </div>

          <div className="flashcard-body" style={{ backgroundColor: colors.card, borderRadius: 30 }}>
            {/* First item: a row with the practice-mode menu (Translate/Quick) + the settings gear.
                On the "All cards" list page the gear moves into the pagination header row instead
                (see FlashcardList), so the top bar is skipped there. */}
            {width >= 840 && mode !== 'list' && (
              <div className="flashcard-top-bar">
                <div className="flashcard-top-bar-menu">
                  {mode !== 'new' && <FlashcardMenu />}
                </div>
                <SettingButton style={{ position: 'static', margin: 0 }} />
              </div>
            )}
            {width < 840 ? <FloatMenu /> : null}

            <div className="flashcard-main-row">
              <div className="flashcard-main">{content()}</div>
              <div className="flashcard-arrow-button" id="flashcard-arrow-slot" />
            </div>
          </div>

        </div>
      </div>

      {canUseAssistant && (
        <HelperSidebar>
          {/* The blue-cards prompt is raised by the assistant rather than a modal, but its timing
              still lives here — this is where the practice view reports back. */}
          <FlashcardsChatbot
            showBlueCardsPrompt={showBlueCardsTestEncouragement}
            onDismissBlueCardsPrompt={handleBlueCardsPromptVisibility}
          />
        </HelperSidebar>
      )}
    </div>
  )
}

export default Flashcards
