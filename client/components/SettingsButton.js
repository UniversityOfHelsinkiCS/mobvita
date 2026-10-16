// eslint-disable-next-line no-unused-vars
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import AppButton, { roundIconButtonSx } from './AppButton'
import AppMenu, { AppMenuItem } from './ui/AppMenu'
import AppIcon from './ui/AppIcon'
import {
  images,
  learningLanguageSelector,
  dictionaryLanguageSelector,
  translatableLanguages,
} from 'Utilities/common'
import { updateDictionaryLanguage } from 'Utilities/redux/userReducer'
import { colors, font } from 'Assets/mui_theme/designTokens'

/**
 * SettingButton — the flashcards translation-language picker. The round gear button opens a small
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

// Gear button + translation-language dropdown; `onSelect` replaces the default language update.
const SettingButton = ({
  style,
  className = 'flashcard-settings-trigger',
  dataCy = 'flashcards-dictionary-language',
  onSelect,
}) => {
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

  // A round 36px AppButton: the outline and the hover fill come from the `tan-outline` variant, so
  // the icon inside is the single-tone DS gear rather than an asset that draws its own ring.
  const gear = (
    <AppButton
      type="button"
      aria-label="Settings"
      variant="tan-outline"
      size="sm"
      // MUI's touch ripple reads as a grey disc washing over a button this small and round, so the
      // click leaves the green hover fill as its only feedback.
      disableRipple
      className={className}
      sx={roundIconButtonSx}
      style={style}
    >
      <AppIcon src={images.settings02} size={24} style={{ display: 'block' }} />
    </AppButton>
  )

  return (
    // inline-flex, not the default block: a block wrapper's line box is taller than the 32px icon,
    // which left the gear off the centre line of whatever it sits beside.
    <div
      data-cy={dataCy}
      style={{ display: 'inline-flex', alignItems: 'center', flexShrink: 0 }}
    >
      <AppMenu trigger={gear} minWidth={220}>
        <div style={headingStyle}>
          <FormattedMessage id="translate-into" defaultMessage="Translate into" />
        </div>
        {options.map(option => (
          <AppMenuItem
            key={option.value}
            selected={String(option.value) === String(dictionaryLanguage)}
            onClick={() =>
              onSelect ? onSelect(option.value) : dispatch(updateDictionaryLanguage(option.value))
            }
          >
            {option.label}
          </AppMenuItem>
        ))}
      </AppMenu>
    </div>
  )
}

export default SettingButton
