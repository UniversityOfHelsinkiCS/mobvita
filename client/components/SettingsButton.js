import React from 'react'
import { Icon, Button, Popup } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import SelectLanguage from './Flashcards/SelectLanguage'

const SettingButton = ({ popupPosition = 'bottom right', ...buttonProps }) => {
  const { style, ...restButtonProps } = buttonProps

  return (
    <Popup
      on="click"
      position={popupPosition}
      trigger={
        <Button
          icon
          aria-label="Settings"
          className="flashcard-settings-trigger"
          {...restButtonProps}
          style={style}
        >
          <Icon name="cog" fitted size="big" />
        </Button>
      }
      content={
        <div className="flashcard-settings-menu">
          <span className="flashcard-settings-menu__label">
            <FormattedMessage id="translation-target-language" />
          </span>
          <SelectLanguage />
        </div>
      }
    />
  )
}

export default SettingButton
