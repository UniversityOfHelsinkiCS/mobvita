import React from 'react'
import { images } from 'Utilities/common'
import SelectLanguage from './Flashcards/SelectLanguage'

/**
 * SettingButton — the flashcards translation-language picker. The circleSettings gear is the trigger
 * that opens the language list (AppSelect) directly. We deliberately don't wrap it in a semantic-ui
 * Popup: that popup closes on outside mousedown, which unmounted the AppSelect's MUI portal before an
 * option's click could register (so the language never switched).
 */
const SettingButton = ({ style }) => {
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

  return <SelectLanguage trigger={gear} />
}

export default SettingButton
