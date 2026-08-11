import React from 'react'
import TemplateWord from './TemplateWord'
import TemplateHints from './TemplateHints'
import TemplateTranslations from './TemplateTranslations'
import TemplateActions from './TemplateActions'

const TemplateMobileView = props => (
  <div
    className="flashcard flashcard-mobile-template"
    style={{ backgroundColor: '#F6EFCF', color: '#2D2C2A', borderRadius: '30px' }}
  >
    <TemplateWord {...props} />
    <TemplateHints {...props} />
    <TemplateTranslations {...props} />
    <TemplateActions {...props} />
  </div>
)

export default TemplateMobileView
