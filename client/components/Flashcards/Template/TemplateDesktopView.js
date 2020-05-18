import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import TemplateWord from './TemplateWord'
import TemplateHints from './TemplateHints'
import TemplateTranslations from './TemplateTranslations'
import TemplateActions from './TemplateActions'

const TemplateDesktopView = props => (
  <div className="component-container flex">
    <div className="flashcard">
      <TemplateWord {...props} />
      <TemplateHints {...props} />
    </div>
    <div className="flashcard margin-left-3">
      <TemplateTranslations bigScreen {...props} />
      <TemplateActions {...props} />
    </div>
  </div>
)

export default TemplateDesktopView
