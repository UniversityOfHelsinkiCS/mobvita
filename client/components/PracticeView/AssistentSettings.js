import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl, FormattedMessage } from 'react-intl'
import AppMenu from 'Components/ui/AppMenu'
import AppSelect from 'Components/ui/AppSelect'
import { updateDictionaryLanguage } from 'Utilities/redux/userReducer'
import { getTranslationAction } from 'Utilities/redux/translationReducer'
import { useLearningLanguage, translatableLanguages, images } from 'Utilities/common'
import { colors, font } from 'Assets/mui_theme/designTokens'

/**
 * AssistentSettings — the assistant's settings gear (Circle-settings icon). Clicking it opens the
 * design-system settings menu (AppMenu). For now the menu holds a single item — the dictionary
 * language selection (AppSelect, which opens its own list) — but it's structured so more settings
 * rows can be added later without changing the entry point.
 */
const AssistentSettings = ({ className = '' }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const learningLanguage = useLearningLanguage()

  const translationLanguageCode = useSelector(
    ({ user }) => user?.data?.user?.last_trans_language || 'English'
  )
  const translation = useSelector(({ translation }) => translation.data)

  const dictionaryOptions = translatableLanguages[learningLanguage]
    ? translatableLanguages[learningLanguage].map(element => ({
        value: element,
        label: intl.formatMessage({ id: element }),
      }))
    : []

  const handleDropdownChange = value => {
    if (translation) {
      const lemmas = translation?.map(t => t?.lemma).join('+')
      if (lemmas !== '') {
        dispatch(getTranslationAction({ learningLanguage, dictionaryLanguage: value, wordLemmas: lemmas }))
      }
    }
    dispatch(updateDictionaryLanguage(value))
  }

  const gear = (
    <img
      src={images.circleSettings}
      alt="settings"
      data-cy="ai-assistant-settings-popup"
      className={className}
      style={{ width: 28, height: 28, cursor: 'pointer', display: 'block' }}
    />
  )

  return (
    <AppMenu
      trigger={gear}
      minWidth={240}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      {/* Settings item: dictionary language. Add more items below as needed. */}
      <div style={{ padding: '2px 6px 6px' }}>
        <div
          style={{
            fontFamily: font.family,
            fontSize: 13,
            fontWeight: 600,
            color: colors.muted,
            marginBottom: 8,
          }}
        >
          <FormattedMessage id="select-dictionary-language" />
        </div>
        <AppSelect
          variant="tan-outline"
          value={translationLanguageCode}
          onChange={handleDropdownChange}
          options={dictionaryOptions}
          disabled={dictionaryOptions.length <= 1}
          minWidth={210}
        />
      </div>
    </AppMenu>
  )
}

export default AssistentSettings
