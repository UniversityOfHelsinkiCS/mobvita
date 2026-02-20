import React from 'react'
import { Icon, Button, Popup } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import SelectLanguage from './Flashcards/SelectLanguage'

const SettingButton = ({ popupPosition = 'bottom right', ...buttonProps }) => {
  const { style, ...restButtonProps } = buttonProps

  return (
    <Popup
      className="flashcard-settings-dropdown"
      on="click"
      position={popupPosition}
      trigger={
        <Button
          icon
          aria-label="Settings"
          {...restButtonProps}
          style={{
            padding: 0,
            backgroundColor: 'transparent',
            minWidth: 0,
            minHeight: 0,
            lineHeight: 1,
						alignSelf: 'flex-start',
						marginRight: '16px',
            ...style,
          }}
        >
          <Icon name="cog" fitted size="big" />
        </Button>
      }
      content={
        <div className="flashcard-settings-menu">
          <div className="flashcard-settings-menu__row">
            <div className="flashcard-settings-menu__label">
              <FormattedMessage id="translation-target-language" />
            </div>
            <SelectLanguage />
          </div>
        </div>
      }
    />
  )
}

export default SettingButton
