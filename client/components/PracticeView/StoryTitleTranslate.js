import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  images,
  learningLanguageSelector,
  dictionaryLanguageSelector,
  learningLanguageLocaleCodes,
} from 'Utilities/common'
import { colors } from 'Assets/mui_theme/designTokens'
import CustomTooltip from 'Components/CustomTooltip'
import {
  getContextTranslation,
  setContextTranslationVisible,
} from 'Utilities/redux/contextTranslationReducer'
import { setHelperSidebarOpen, setHelperSidebarTab } from 'Utilities/redux/helperSidebarReducer'

// Small translate icon shown next to the story title. Context-translates the title (same
// ctxTranslate call as the "Translate Sentence" action-menu item) and shows it in the
// CombinedChatbot's context-translation bubble. Used in both PracticeView and ReadViews.
// `size` in px pins the button; left unset it scales with the title's font size.
const StoryTitleTranslate = ({ title, size }) => {
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
        'title',
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
    // Same tooltip treatment as the speaker and the settings gear it sits with: the design-system
    // bubble, shown when the user has tooltips on.
    <CustomTooltip keyId="story-title-translate-explain" placement="top">
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
          width: size ? `${size}px` : '1em',
          height: size ? `${size}px` : '1em',
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
          style={{
            width: size ? `${Math.round(size * 0.55)}px` : '0.65em',
            height: size ? `${Math.round(size * 0.55)}px` : '0.65em',
            display: 'block',
          }}
        />
      </button>
    </CustomTooltip>
  )
}

export default StoryTitleTranslate
