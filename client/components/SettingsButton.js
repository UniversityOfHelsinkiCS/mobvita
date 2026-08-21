// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import AppMenu, { AppMenuItem } from './ui/AppMenu'
import {
  images,
  learningLanguageSelector,
  dictionaryLanguageSelector,
  translatableLanguages,
} from 'Utilities/common'
import { updateDictionaryLanguage } from 'Utilities/redux/userReducer'
import { colors, font } from 'Assets/mui_theme/designTokens'

/**
 * SettingButton — the flashcards translation-language picker. The circleSettings gear opens a small
 * settings dropdown that shows a "Translate into" heading followed by the language list, instead of
 * dropping straight into the bare options. Selecting a language updates the dictionary language and
 * closes the menu (AppMenuItem defers its own close, so the dispatch always registers first).
 */
const headingStyle = {
  padding: '2px 12px 10px',
  fontFamily: font.family,
  fontWeight: 600,
  fontSize: 13,
  color: colors.muted,
  whiteSpace: 'nowrap',
}

const SettingButton = ({ style }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)

  const options = translatableLanguages[learningLanguage]
    ? translatableLanguages[learningLanguage].map(element => ({
        value: element,
        label: intl.formatMessage({ id: element }),
      }))
    : []

  const gear = (
    <button
      type="button"
      aria-label="Settings"
      className="flashcard-settings-trigger"
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, ...style }}
    >
      <img
        src={images.circleSettings}
        alt="settings"
        style={{ width: 32, height: 32, display: 'block' }}
      />
    </button>
  )

  return (
    <div data-cy="flashcards-dictionary-language">
      <AppMenu trigger={gear} minWidth={220}>
        <div style={headingStyle}>
          <FormattedMessage id="translate-into" defaultMessage="Translate into" />
        </div>
        {options.map(option => (
          <AppMenuItem
            key={option.value}
            selected={String(option.value) === String(dictionaryLanguage)}
            onClick={() => dispatch(updateDictionaryLanguage(option.value))}
          >
            {option.label}
          </AppMenuItem>
        ))}
      </AppMenu>
    </div>
  )
}

export default SettingButton
