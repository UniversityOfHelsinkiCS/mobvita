import React from 'react'
import TemplateWord from './TemplateWord'
import TemplateHints from './TemplateHints'
import TemplateTranslations from './TemplateTranslations'
import TemplateActions from './TemplateActions'

// Two-card "Add flashcard" layout: lavender word/hints card on the left, cream translations card on
// the right (2026 design — see the reference mockup). Ink text, generous 30px rounding.
const LEFT_CARD_BG = '#DAD9EF'
const RIGHT_CARD_BG = '#F6EFCF'
const INK = '#2D2C2A'

const TemplateDesktopView = props => (
  <div className="flex">
    <div
      className="flashcard"
      style={{ backgroundColor: LEFT_CARD_BG, color: INK, borderRadius: '30px' }}
    >
      <TemplateWord {...props} />
      <TemplateHints {...props} />
    </div>
    <div
      className="flashcard ml-lg"
      style={{
        marginLeft: '1em',
        backgroundColor: RIGHT_CARD_BG,
        color: INK,
        borderRadius: '30px',
        border: `8px solid ${LEFT_CARD_BG}`,
      }}
    >
      <TemplateTranslations bigScreen {...props} />
      <TemplateActions {...props} />
    </div>
  </div>
)

export default TemplateDesktopView
