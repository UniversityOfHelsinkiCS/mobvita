import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

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
import { setHelperSidebarOpen } from 'Utilities/redux/helperSidebarReducer'
import { TERMINOLOGY, TERMINOLOGY_DEFAULT_MODE, TERMINOLOGY_EXCLUDED_MODES } from './terminology'

import './Flashcards.scss'

// Matches the HelperSidebar.scss breakpoint where the sidebar turns into a bottom sheet.
const SIDEBAR_SHEET_MAX_WIDTH = 768

// The card-practice modes. `undefined` is /flashcards with no mode, which renders fillin.
const PRACTICE_MODES = ['fillin', 'learn', 'match', 'quick', 'article']

// Flashcards page: practice / list / new tabs, scoped to a story, terminology or blue-cards test.
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
  const { storyBlueCards, deckCompleted } = useSelector(({ flashcards }) => flashcards)
  const dispatch = useDispatch()

  // Below the sheet breakpoint the sidebar is a bottom sheet over the card, so it is never raised
  // automatically — only by the learner.
  const canRaiseAssistant = canUseAssistant && width > SIDEBAR_SHEET_MAX_WIDTH

  // The assistant is where flashcard help lives, so entering the page raises it. Keyed on access
  // rather than mount: `canUseAssistant` is false until the user loads, and re-collapsing it by
  // hand must not reopen it (which an isSidebarOpen dependency would do).
  useEffect(() => {
    if (canRaiseAssistant) dispatch(setHelperSidebarOpen(true))
  }, [canRaiseAssistant])

  // A finished deck raises it again — the "Deck completed!" prompt and the next-deck button are
  // both in the assistant, so a collapsed sidebar would hide the only way on.
  useEffect(() => {
    if (deckCompleted && canRaiseAssistant) dispatch(setHelperSidebarOpen(true))
  }, [deckCompleted])

  const inBlueCardsTest = location.pathname.includes('test')
  const inTerminology = type === TERMINOLOGY
  const terminologyModeExcluded = inTerminology && TERMINOLOGY_EXCLUDED_MODES.includes(mode)

  // A terminology deck has no translate cards, so its fill-in URL falls through to matching.
  useEffect(() => {
    if (terminologyModeExcluded) {
      navigate(`/flashcards/${TERMINOLOGY_DEFAULT_MODE}/${TERMINOLOGY}/${storyId}`, {
        replace: true,
      })
    }
  }, [terminologyModeExcluded, storyId])

  // Reset prompt state only when user moves to creation/list views.
  useEffect(() => {
    if (mode === 'new' || mode === 'list') {
      setHasHandledBlueCardsPrompt(false)
      setShowBlueCardsTestEncouragement(false)
    }
  }, [mode])

  // Offers the blue-cards test after a short delay; never inside the test or a terminology deck.
  useEffect(() => {
    const promptBlocked =
      inBlueCardsTest ||
      type === 'test' ||
      inTerminology ||
      !(!mode || PRACTICE_MODES.includes(mode))
    if (promptBlocked) {
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

  // The view for the current mode; nothing while an excluded terminology mode redirects.
  const content = () => {
    if (terminologyModeExcluded) return null
    switch (mode) {
      case 'new':
        return <FlashcardCreation />
      case 'list':
        return <FlashcardList />
      case 'article':
        return <Practice mode="article" open={fcOpen} />
      case 'quick':
        return <Practice mode="quick" open={fcOpen} />
      case 'learn':
        return <Practice mode="learn" open={fcOpen} />
      case 'match':
        return <Practice mode="match" open={fcOpen} />
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

  // "Practice" opens fill-in, or matching inside a terminology deck.
  const handleTabChange = value => {
    if (value === 'new') navigate('/flashcards/new')
    else if (value === 'fillin' && inTerminology) pushWithOptionalContext(TERMINOLOGY_DEFAULT_MODE)
    else pushWithOptionalContext(value)
  }

  return (
    <div className="cont-tall flex-col space-between align-center">
      <div className="flex mb-nm" style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
        <div className={`cont pb-nm flex-col ${isSidebarOpen ? 'sidebar-pushed' : ''}`} style={{ flex: 1 }}>
          <div data-cy="library-controls" style={{ margin: '0 0 1.7em 0' }}>
            <AppTabs tabs={flashcardTabs} value={activeTab} onChange={handleTabChange} fullWidth />
          </div>

          <div className="flashcard-body" style={{ backgroundColor: colors.card, borderRadius: 30 }}>
            {width >= 840 && mode !== 'list' && (
              <div className="flashcard-top-bar">
                <div className="flashcard-top-bar-menu">
                  {mode !== 'new' && !inBlueCardsTest && <FlashcardMenu />}
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
