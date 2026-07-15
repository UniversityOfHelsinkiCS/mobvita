import React from 'react'
import AppButton from 'Components/AppButton'
import { FormattedMessage } from 'react-intl'

const TemplateActions = ({ handleSave, handleClear, editing = false }) => (
  <div className="mb-lg auto-top gap-col-sm flex">
    <AppButton
      onClick={handleClear}
      style={{ flexBasis: '50%' }}
      className="flashcard-template-button-clear"
    >
      <FormattedMessage id={editing ? 'Cancel' : 'Clear'} />
    </AppButton>
    <AppButton
      onClick={handleSave}
      style={{ flexBasis: '50%' }}
      className="flashcard-template-button-save"
    >
      <FormattedMessage id="Save" />
    </AppButton>
  </div>
)

export default TemplateActions
