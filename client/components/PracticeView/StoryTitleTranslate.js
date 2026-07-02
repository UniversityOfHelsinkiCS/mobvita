import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import {
  learningLanguageSelector,
  dictionaryLanguageSelector,
  learningLanguageLocaleCodes,
} from 'Utilities/common'
import {
  getContextTranslation,
  setContextTranslationVisible,
} from 'Utilities/redux/contextTranslationReducer'
import { setHelperSidebarOpen, setHelperSidebarTab } from 'Utilities/redux/helperSidebarReducer'

// Small translate icon shown next to the story title. Context-translates the title (same ctxTranslate
// call as the "Translate Sentence" action-menu item) and shows it in the CombinedChatbot's
// context-translation bubble. Used in both PracticeView and ReadViews.
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
        learningLanguageLocaleCodes[dictionaryLanguage]
      )
    )
    dispatch(setContextTranslationVisible(true))
    dispatch(setHelperSidebarOpen(true))
    // Ensure a tab that renders the context bubble is active.
    if (helperActiveTab !== 'exercise' && helperActiveTab !== 'translation') {
      dispatch(setHelperSidebarTab('translation'))
    }
  }

  return (
    <Icon
      name="language"
      data-cy="story-title-translate"
      role="button"
      onClick={handleClick}
      style={{
        cursor: 'pointer',
        marginLeft: '0.4em',
        // Fixed size + line-height:1 so the glyph isn't blown up by the title font-size and
        // isn't pushed to the corner by the title's inherited line-height.
        fontSize: '1.4rem',
        lineHeight: 1,
        height: '1em',
        width: 'auto',
        color: '#17a2b8',
        verticalAlign: 'baseline',
        alignSelf: 'baseline',
        marginBottom: '10px',
      }}
    />
  )
}

export default StoryTitleTranslate
