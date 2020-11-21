import React from 'react'
import TemplateWord from './TemplateWord'
import TemplateHints from './TemplateHints'
import TemplateTranslations from './TemplateTranslations'
import TemplateActions from './TemplateActions'

const TemplateDesktopView = props => (
  <div className="cont flex">
    <div className="flashcard">
      <TemplateWord {...props} />
      <TemplateHints {...props} />
    </div>
    <div className="flashcard ml-lg">
      <TemplateTranslations bigScreen {...props} />
      <TemplateActions {...props} />
    </div>
  </div>
)

export default TemplateDesktopView
