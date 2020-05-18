import React from 'react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const TemplateActions = ({ handleSave, handleClear, editing = false }) => (
  <div className="margin-bottom-3 auto-top gap-1 flex">
    <Button
      variant="outline-warning"
      className="flashcard-button"
      onClick={handleClear}
      style={{ flexBasis: '50%' }}
    >
      <FormattedMessage id={editing ? 'Cancel' : 'Clear'} />
    </Button>
    <Button
      variant="outline-success"
      className="flashcard-button"
      onClick={handleSave}
      style={{ flexBasis: '50%' }}
    >
      <FormattedMessage id="Save" />
    </Button>
  </div>
)

export default TemplateActions
