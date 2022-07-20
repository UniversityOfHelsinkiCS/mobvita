import React from 'react'
import TemplateWord from './TemplateWord'
import TemplateHints from './TemplateHints'
import TemplateTranslations from './TemplateTranslations'
import TemplateActions from './TemplateActions'

const TemplateDesktopView = props => (
  <div className="flex">
    <div className="flashcard" style={{ backgroundColor: '#FFEFD5', color: '#000000' }}>
      <TemplateWord {...props} />
      <TemplateHints {...props} />
    </div>
    <div
      className="flashcard ml-lg"
      style={{ marginLeft: '1em', backgroundColor: '#FFEFD5', color: '#000000' }}
    >
      <TemplateTranslations bigScreen {...props} />
      <TemplateActions {...props} />
    </div>
  </div>
)

export default TemplateDesktopView
