import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import TemplateWord from './TemplateWord'
import TemplateHints from './TemplateHints'
import TemplateTranslations from './TemplateTranslations'

const TemplateDesktopView = ({ handleSave, ...props }) => (
  <div className="component-container flex">
    <div className="flashcard">
      <TemplateWord {...props} />
      <TemplateHints {...props} />
    </div>
    <div className="flashcard margin-left-3">
      <TemplateTranslations {...props} />
      <Button
        variant="outline-success"
        className="flashcard-button margin-bottom-3 auto-top"
        onClick={handleSave}
      >
        <FormattedMessage id="submit-flashcard" />
      </Button>
    </div>
  </div>
)

export default TemplateDesktopView
