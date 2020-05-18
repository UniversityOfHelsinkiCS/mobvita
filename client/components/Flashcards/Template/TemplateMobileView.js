import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import TemplateWord from './TemplateWord'
import TemplateHints from './TemplateHints'
import TemplateTranslations from './TemplateTranslations'

const TemplateMobileView = ({ handleSave, ...props }) => (
  <div className="flashcard flashcard-mobile-template">
    <TemplateWord {...props} />
    <TemplateHints {...props} />
    <TemplateTranslations {...props} />
    <Button
      variant="outline-success"
      className="flashcard-button margin-bottom-3 auto-top"
      onClick={handleSave}
    >
      <FormattedMessage id="submit-flashcard" />
    </Button>
  </div>
)

export default TemplateMobileView
