import React from 'react'
import { styled } from '@mui/material/styles'
import CustomTooltip from 'Components/CustomTooltip'
import { colors } from 'Assets/mui_theme/designTokens'

/**
 * AppTabs — the 2026 segmented tab bar: a cream rounded container of pill segments. The active
 * segment gets the sage-green fill; inactive segments are transparent with a tan hover. Each tab is
 * `{ value, label, icon?, badge? }`; pass `badge` (a number/string) to show the orange count pill.
 *
 * Controlled: `value` + `onChange(value)`. Set `fullWidth` to stretch the bar and split the segments
 * evenly across it.
 *
 * `size` ('xs' | 'sm' | 'md' | 'lg', default 'md') scales the whole bar — segment padding, label
 * size, icon and badge — the same shorthand AppButton uses. Reach for 'sm' when a `fullWidth` bar
 * carries long labels (e.g. the group-analytics summary tabs), 'xs' when it also has to fit a
 * narrow column or sidebar, and 'lg' for a primary page-level switch.
 *
 * Long labels never wrap, so a `fullWidth` bar grows past its container rather than clipping them.
 * Put it in an `overflow-x: auto` wrapper to scroll that case.
 *
 * Variants:
 *   - default : no outline — use on the page background where the cream bar reads on its own.
 *   - inner   : pass `bordered` for a 1px green outline around the whole bar, so it stays legible
 *               when nested inside another cream surface (a card or modal — e.g. Flashcards, the
 *               learning-settings modal).
 */
const BADGE_ORANGE = '#FF7A45'

// 'md' holds the original values, so bars that don't set `size` are unchanged.
const SIZES = {
  tiny: { barGap: 2, barPad: 3, pad: '4px 10px', fontSize: 12, gap: 6, icon: 14, badge: 16, badgeFont: 10 },
  small: { barGap: 3, barPad: 4, pad: '6px 14px', fontSize: 14, gap: 8, icon: 16, badge: 18, badgeFont: 11 },
  medium: { barGap: 4, barPad: 6, pad: '10px 22px', fontSize: 16, gap: 10, icon: 20, badge: 22, badgeFont: 13 },
  large: { barGap: 6, barPad: 8, pad: '14px 30px', fontSize: 18, gap: 12, icon: 24, badge: 26, badgeFont: 15 },
}
const SIZE_KEYS = { xs: 'tiny', sm: 'small', md: 'medium', lg: 'large' }
const resolveSize = size => SIZES[SIZE_KEYS[size] || size] || SIZES.medium

const TabsBar = styled('div', {
  shouldForwardProp: prop => !['fullWidth', 'bordered', 'sizing'].includes(prop),
})(({ fullWidth, bordered, sizing }) => ({
  display: fullWidth ? 'flex' : 'inline-flex',
  // fullWidth keeps `width: 100%`. A content-derived width (max-content) breaks when the bar is a
  // flex item: `min-width: 100%` then resolves against a container whose own width depends on the
  // bar, and it collapses or overflows a clipping ancestor. `min-width: max-content` gets the same
  // result safely — normally 100%, but never narrower than the tabs, so the cream background still
  // covers every segment when they overflow.
  ...(fullWidth ? { width: '100%', minWidth: 'max-content' } : { width: 'auto' }),
  alignItems: 'center',
  gap: sizing.barGap,
  padding: sizing.barPad,
  boxSizing: 'border-box',
  backgroundColor: colors.card,
  borderRadius: 999,
  // Optional 1px outline (same green as the active tab) so the whole bar reads on a cream surface.
  border: bordered ? `1px solid ${colors.green}` : '1px solid transparent',
}))

const Tab = styled('button', {
  shouldForwardProp: prop => !['active', 'fullWidth', 'sizing'].includes(prop),
})(({ active, fullWidth, sizing }) => ({
  flex: fullWidth ? 1 : 'none',
  // `flex: 1` means flex-basis 0, so segments share the bar equally — but labels don't wrap, and a
  // long one (or a long translation) would otherwise spill outside its pill. The floor keeps the
  // equal split whenever the labels fit, and widens the bar when they don't.
  ...(fullWidth && { minWidth: 'fit-content' }),
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: sizing.gap,
  padding: sizing.pad,
  border: 'none',
  borderRadius: 999,
  cursor: 'pointer',
  fontSize: sizing.fontSize,
  fontWeight: 600,
  color: colors.ink,
  whiteSpace: 'nowrap',
  backgroundColor: active ? colors.green : 'transparent',
  transition: 'background-color 0.15s ease',
  '&:hover': { backgroundColor: active ? colors.greenHover : '#ECE3BE' },
  '& svg, & img': { width: sizing.icon, height: sizing.icon, flexShrink: 0 },
}))

const Badge = styled('span', {
  shouldForwardProp: prop => prop !== 'sizing',
})(({ sizing }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: sizing.badge,
  height: sizing.badge,
  padding: '0 6px',
  boxSizing: 'border-box',
  borderRadius: 999,
  backgroundColor: BADGE_ORANGE,
  color: '#FFFFFF',
  fontSize: sizing.badgeFont,
  fontWeight: 700,
  lineHeight: 1,
}))

const AppTabs = ({
  tabs = [],
  value,
  onChange,
  fullWidth = false,
  bordered = false,
  size = 'md',
}) => {
  const sizing = resolveSize(size)

  return (
    <TabsBar fullWidth={fullWidth} bordered={bordered} sizing={sizing} role="tablist">
      {tabs.map(tab => {
        const tabButton = (
          <Tab
            type="button"
            role="tab"
            aria-selected={tab.value === value}
            active={tab.value === value}
            data-cy={`tab-${tab.value}`}
            fullWidth={fullWidth}
            sizing={sizing}
            onClick={() => onChange(tab.value)}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge != null && <Badge sizing={sizing}>{tab.badge}</Badge>}
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
}

export default AppTabs
