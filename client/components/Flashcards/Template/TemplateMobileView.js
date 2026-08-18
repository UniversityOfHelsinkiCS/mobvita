import React from 'react'
import TemplateWord from './TemplateWord'
import TemplateHints from './TemplateHints'
import TemplateTranslations from './TemplateTranslations'
import TemplateActions from './TemplateActions'

const TemplateMobileView = props => (
  <div className="flashcard flashcard-template-card flashcard-template-card--mobile">
    <TemplateWord {...props} />
    <TemplateHints {...props} />
    <TemplateTranslations {...props} />
    <TemplateActions {...props} />
  </div>
)

export default TemplateMobileView
