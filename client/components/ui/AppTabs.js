import React from 'react'
import { styled } from '@mui/material/styles'
import CustomTooltip from 'Components/CustomTooltip'
import { colors, font } from 'Assets/mui_theme/designTokens'

/**
 * AppTabs — the 2026 segmented tab bar: a cream rounded container of pill segments. The active
 * segment gets the sage-green fill; inactive segments are transparent with a tan hover. Each tab is
 * `{ value, label, icon?, badge? }`; pass `badge` (a number/string) to show the orange count pill.
 *
 * Controlled: `value` + `onChange(value)`. Set `fullWidth` to stretch the bar and split the segments
 * evenly across it.
 *
 * Variants:
 *   - default : no outline — use on the page background where the cream bar reads on its own.
 *   - inner   : pass `bordered` for a 1px green outline around the whole bar, so it stays legible
 *               when nested inside another cream surface (a card or modal — e.g. Flashcards, the
 *               learning-settings modal).
 */
const BADGE_ORANGE = '#FF7A45'

const TabsBar = styled('div', {
  shouldForwardProp: prop => prop !== 'fullWidth' && prop !== 'bordered',
})(({ fullWidth, bordered }) => ({
  display: fullWidth ? 'flex' : 'inline-flex',
  width: fullWidth ? '100%' : 'auto',
  alignItems: 'center',
  gap: 4,
  padding: 6,
  boxSizing: 'border-box',
  backgroundColor: colors.card,
  borderRadius: 999,
  // Optional 1px outline (same green as the active tab) so the whole bar reads on a cream surface.
  border: bordered ? `1px solid ${colors.green}` : '1px solid transparent',
}))

const Tab = styled('button', {
  shouldForwardProp: prop => prop !== 'active' && prop !== 'fullWidth',
})(({ active, fullWidth }) => ({
  flex: fullWidth ? 1 : 'none',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  padding: '10px 22px',
  border: 'none',
  borderRadius: 999,
  cursor: 'pointer',
  fontFamily: font.family,
  fontSize: 16,
  fontWeight: 600,
  color: colors.ink,
  whiteSpace: 'nowrap',
  backgroundColor: active ? colors.green : 'transparent',
  transition: 'background-color 0.15s ease',
  '&:hover': { backgroundColor: active ? colors.greenHover : '#ECE3BE' },
  '& svg, & img': { width: 20, height: 20, flexShrink: 0 },
}))

const Badge = styled('span')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 22,
  height: 22,
  padding: '0 6px',
  boxSizing: 'border-box',
  borderRadius: 999,
  backgroundColor: BADGE_ORANGE,
  color: '#FFFFFF',
  fontSize: 13,
  fontWeight: 700,
  lineHeight: 1,
})

const AppTabs = ({ tabs = [], value, onChange, fullWidth = false, bordered = false }) => (
  <TabsBar fullWidth={fullWidth} bordered={bordered} role="tablist">
    {tabs.map(tab => {
      const tabButton = (
        <Tab
          type="button"
          role="tab"
          aria-selected={tab.value === value}
          active={tab.value === value}
          fullWidth={fullWidth}
          onClick={() => onChange(tab.value)}
        >
          {tab.icon}
          <span>{tab.label}</span>
          {tab.badge != null && <Badge>{tab.badge}</Badge>}
        </Tab>
      )

      // `tooltip` is an i18n key id (rendered via CustomTooltip's keyId, so it supports HTML).
      return tab.tooltip ? (
        <CustomTooltip key={tab.value} keyId={tab.tooltip} placement="top">
          {tabButton}
        </CustomTooltip>
      ) : (
        <React.Fragment key={tab.value}>{tabButton}</React.Fragment>
      )
    })}
  </TabsBar>
)

export default AppTabs
