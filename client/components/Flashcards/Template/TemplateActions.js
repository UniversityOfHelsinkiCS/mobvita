import React from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const TemplateActions = ({ handleSave, handleClear, editing = false }) => (
  <div className="mb-lg auto-top gap-col-sm flex">
    <Button
      onClick={handleClear}
      style={{ flexBasis: '50%' }}
      className="flashcard-template-button-clear"
    >
      <FormattedMessage id={editing ? 'Cancel' : 'Clear'} />
    </Button>
    <Button
      onClick={handleSave}
      style={{ flexBasis: '50%' }}
      className="flashcard-template-button-save"
    >
      <FormattedMessage id="Save" />
    </Button>
  </div>
)

export default TemplateActions
