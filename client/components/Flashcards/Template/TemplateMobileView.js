import React from 'react'
import TemplateWord from './TemplateWord'
import TemplateHints from './TemplateHints'
import TemplateTranslations from './TemplateTranslations'
import TemplateActions from './TemplateActions'

const TemplateMobileView = props => (
  <div className="flashcard flashcard-mobile-template">
    <TemplateWord {...props} />
    <TemplateHints {...props} />
    <TemplateTranslations {...props} />
    <TemplateActions {...props} />
  </div>
)

export default TemplateMobileView
