import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  images,
  learningLanguageSelector,
  dictionaryLanguageSelector,
  learningLanguageLocaleCodes,
} from 'Utilities/common'
import { colors } from 'Assets/mui_theme/designTokens'
import {
  getContextTranslation,
  setContextTranslationVisible,
} from 'Utilities/redux/contextTranslationReducer'
import { setHelperSidebarOpen, setHelperSidebarTab } from 'Utilities/redux/helperSidebarReducer'

// Small translate icon shown next to the story title. Context-translates the title (same
// ctxTranslate call as the "Translate Sentence" action-menu item) and shows it in the
// CombinedChatbot's context-translation bubble. Used in both PracticeView and ReadViews.
const StoryTitleTranslate = ({ title }) => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const helperActiveTab = useSelector(state => state.helperSidebar?.activeTab)

  if (!title) return null

  const handleClick = () => {
    dispatch(
      getContextTranslation(
        title,
        learningLanguageLocaleCodes[learningLanguage],
        learningLanguageLocaleCodes[dictionaryLanguage],
      ),
    )
    dispatch(setContextTranslationVisible(true))
    dispatch(setHelperSidebarOpen(true))
    // Ensure a tab that renders the context bubble is active.
    if (helperActiveTab !== 'exercise' && helperActiveTab !== 'translation') {
      dispatch(setHelperSidebarTab('translation'))
    }
  }

  return (
    <button
      type="button"
      data-cy="story-title-translate"
      aria-label="translate title"
      onClick={handleClick}
      style={{
        // Circular sage-green icon button beside the title (2026 design).
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: '1em',
        height: '1em',
        marginLeft: '0.5em',
        padding: 0,
        border: 'none',
        borderRadius: '50%',
        backgroundColor: colors.green,
        cursor: 'pointer',
        alignSelf: 'center',
      }}
    >
      <img
        src={images.translate}
        alt=""
        style={{ width: '0.65em', height: '0.65em', display: 'block' }}
      />
    </button>
  )
}

export default StoryTitleTranslate
