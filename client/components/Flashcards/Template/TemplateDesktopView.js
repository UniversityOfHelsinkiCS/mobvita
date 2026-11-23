import React from 'react'
import TemplateWord from './TemplateWord'
import TemplateHints from './TemplateHints'
import TemplateTranslations from './TemplateTranslations'
import TemplateActions from './TemplateActions'

const TemplateDesktopView = props => (
  <div className="flashcard-template">
    <div className="flashcard flashcard-template-card flashcard-template-card--word">
      <TemplateWord {...props} />
      <TemplateHints {...props} />
    </div>
    <div className="flashcard flashcard-template-card flashcard-template-card--translations">
      <TemplateTranslations bigScreen {...props} />
      <TemplateActions {...props} />
    </div>
  </div>
)

export default TemplateDesktopView
