import React from 'react'
import TemplateWord from './TemplateWord'
import TemplateHints from './TemplateHints'
import TemplateTranslations from './TemplateTranslations'
import TemplateActions from './TemplateActions'

const TemplateDesktopView = props => (
  <div className="flex">
    <div className="flashcard">
      <TemplateWord {...props} />
      <TemplateHints {...props} />
    </div>
    <div className="flashcard ml-lg" style={{ marginLeft: '1em' }}>
      <TemplateTranslations bigScreen {...props} />
      <TemplateActions {...props} />
    </div>
  </div>
)

export default TemplateDesktopView
