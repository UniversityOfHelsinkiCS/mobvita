import React from 'react'
import AppButton from 'Components/AppButton'
import { FormattedMessage } from 'react-intl'

const TemplateActions = ({ handleSave, handleClear, editing = false }) => (
  <div className="flashcard-template-actions">
    <AppButton onClick={handleClear} className="flashcard-template-action">
      <FormattedMessage id={editing ? 'Cancel' : 'Clear'} />
    </AppButton>
    <AppButton onClick={handleSave} className="flashcard-template-action">
      <FormattedMessage id="Save" />
    </AppButton>
  </div>
)

export default TemplateActions
