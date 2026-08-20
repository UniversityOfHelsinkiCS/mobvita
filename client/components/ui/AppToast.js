import React from 'react'
import { colors } from 'Assets/mui_theme/designTokens'

/**
 * AppToast — the 2026 design-system toast content: an optional icon beside the message, rendered inside
 * the cream toast card (the card itself comes from `.Toastify__toast` in custom.scss — every toast gets
 * it). Use with react-toastify: `toast(<AppToast message="…" icon={images.folder} />)`.
 */
const AppToast = ({ message, icon, iconAlt = '' }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '2px' }}>
    {icon && (
      <img src={icon} alt={iconAlt} style={{ width: 24, height: 24, flexShrink: 0, marginTop: 2 }} />
    )}
    <div
      style={{
        fontSize: 14,
        fontWeight: 500,
        lineHeight: 1.4,
        color: colors.ink,
        whiteSpace: 'pre-line',
      }}
    >
      {message}
    </div>
  </div>
)

export default AppToast
