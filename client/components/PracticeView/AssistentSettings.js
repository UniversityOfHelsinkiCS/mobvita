import React, { useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useIntl, FormattedMessage } from 'react-intl'
import AppMenu, { AppMenuCloseContext } from 'Components/ui/AppMenu'
import { updateDictionaryLanguage } from 'Utilities/redux/userReducer'
import { getTranslationAction } from 'Utilities/redux/translationReducer'
import { useLearningLanguage, translatableLanguages, images } from 'Utilities/common'
import { colors, font } from 'Assets/mui_theme/designTokens'

// Native <select> (not AppSelect) so Cypress `.select()` in dictionary_spec.js works. Rendered
// inside AppMenu, so it consumes the menu's close context and dismisses the popover after a pick —
// otherwise the (invisible) Popover backdrop lingers over the dictionary content.
const DictionaryLanguageSelect = ({ value, options, disabled, onChange }) => {
  const closeMenu = useContext(AppMenuCloseContext)

  return (
    <select
      data-cy="dictionary-dropdown"
      value={value}
      disabled={disabled}
      onChange={e => {
        onChange(e.target.value)
        if (closeMenu) closeMenu()
      }}
      style={{
        width: '100%',
        fontSize: font.input,
        color: colors.ink,
        backgroundColor: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: 999,
        padding: '7px 14px',
        cursor: disabled ? 'default' : 'pointer',
      }}
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

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
      style={{ width: 36, height: 36, cursor: 'pointer', display: 'block' }}
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
            fontSize: 13,
            fontWeight: 600,
            color: colors.muted,
            marginBottom: 8,
          }}
        >
          <FormattedMessage id="select-dictionary-language" />
        </div>
        <DictionaryLanguageSelect
          value={translationLanguageCode}
          options={dictionaryOptions}
          disabled={dictionaryOptions.length <= 1}
          onChange={handleDropdownChange}
        />
      </div>
    </AppMenu>
  )
}

export default AssistentSettings
