import React from 'react'
import { styled } from '@mui/material/styles'
import { colors, font } from 'Assets/mui_theme/designTokens'

/**
 * Shared row styling for the design-system menu surfaces (AppMenu dropdown, AppSidebar drawer).
 * Both render an identical row — icon + label, tan hover/selected pill — so they stay consistent.
 */
export const rowStyles = ({ selected }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '11px 20px',
  fontFamily: font.family,
  fontWeight: 500,
  fontSize: 16,
  color: colors.ink,
  borderRadius: 999,
  cursor: 'pointer',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  backgroundColor: selected ? colors.green : 'transparent',
  // Link rows render as <a>; override global anchor styles (blue, underline, :visited).
  '&:visited, &:focus, &:active': { color: colors.ink, textDecoration: 'none' },
  '&:hover': {
    backgroundColor: selected ? colors.green : colors.menuHover,
    color: colors.ink,
    textDecoration: 'none',
  },
})

const forwardOptions = { shouldForwardProp: prop => prop !== 'selected' }
// Render a real <a> for link rows and a <div> otherwise. (The `as` prop with a custom
// shouldForwardProp doesn't reliably switch the tag in MUI 9, leaving links as un-navigable divs.)
const MenuRowDiv = styled('div', forwardOptions)(rowStyles)
const MenuRowLink = styled('a', forwardOptions)(rowStyles)

/**
 * MenuRow — presentational row shared by AppMenu and AppSidebar. Renders <a> when `href` is set,
 * else <div>. forwardRef so a consumer (e.g. a semantic-ui Modal trigger) can attach a ref.
 */
export const MenuRow = React.forwardRef(
  ({ icon, children, href, selected = false, className = '', ...rest }, ref) => {
    const Row = href ? MenuRowLink : MenuRowDiv
    // Stable classes (in addition to the emotion styles) so a specific menu can re-skin its rows —
    // e.g. the library sort dropdown scopes selected/hover colours via `.app-menu-row(-selected)`.
    const rowClassName = ['app-menu-row', selected && 'app-menu-row-selected', className]
      .filter(Boolean)
      .join(' ')
    return (
      <Row ref={ref} href={href} selected={selected} className={rowClassName} {...rest}>
        {icon && <span style={{ display: 'inline-flex', flexShrink: 0 }}>{icon}</span>}
        <span>{children}</span>
      </Row>
    )
  },
)

MenuRow.displayName = 'MenuRow'
