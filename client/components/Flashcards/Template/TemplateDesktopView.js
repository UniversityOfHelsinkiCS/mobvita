import React from 'react'
import TemplateWord from './TemplateWord'
import TemplateHints from './TemplateHints'
import TemplateTranslations from './TemplateTranslations'
import TemplateActions from './TemplateActions'

// Two-card "Add flashcard" layout: lavender word/hints card on the left, cream translations card
// on the right (2026 design). Card colours/rounding live in Flashcards.scss.
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
