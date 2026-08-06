import React from 'react'
import { useIntl } from 'react-intl'
import { images } from 'Utilities/common'
import { colors, font } from 'Assets/mui_theme/designTokens'

/**
 * ServerIssuesToast — the 2026 design-system rendering of the "server-issues" network-problem
 * notice. A cream card with a globe icon and the network message in Geologica ink text. Shown in
 * the bottom-left corner (see Toaster.js `position: 'bottom-left'`).
 */
const ServerIssuesToast = () => {
  const intl = useIntl()
  const message = intl.formatMessage({ id: 'server-issues' })

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '2px' }}>
      <img
        src={images.globe04}
        alt="network"
        style={{ width: 24, height: 24, flexShrink: 0, marginTop: 2 }}
      />
      <div
        style={{
          fontFamily: font.family,
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
}

export default ServerIssuesToast
