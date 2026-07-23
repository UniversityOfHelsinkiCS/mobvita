import React, { createContext, useContext, useState } from 'react'
import Popover from '@mui/material/Popover'
import { styled } from '@mui/material/styles'
import { colors } from 'Assets/mui_theme/designTokens'
import { MenuRow } from './menuRow'

/**
 * AppMenu / AppMenuItem — design-system dropdown menu (MUI `Popover`, not semantic-ui `Dropdown`).
 *
 * AppMenu owns the trigger + open/anchor state and renders the styled cream panel (square top,
 * rounded bottom) from the 2026 design. AppMenuItem is a styled row (icon + label, tan hover pill)
 * that auto-closes the menu on click and can render as a link (`component="a"` / `as="a"`) or wrap
 * a modal trigger.
 *
 * Usage:
 *   <AppMenu trigger={<img src={burger} />} closeIcon={<img src={x} />}>
 *     <AppMenuItem as="a" href="…" icon={<img src={ic} />}>Help</AppMenuItem>
 *     <SomeModal trigger={<AppMenuItem icon={<img src={ic} />}>Contact</AppMenuItem>} />
 *   </AppMenu>
 */
const AppMenuCloseContext = createContext(null)

const StyledPopover = styled(Popover, {
  shouldForwardProp: prop => prop !== 'radius' && prop !== 'menuMinWidth',
})(({ radius, menuMinWidth }) => ({
  '& .MuiPopover-paper': {
    backgroundColor: colors.card,
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18)',
    padding: '10px 15px',
    overflow: 'visible',
    borderRadius: radius,
    minWidth: menuMinWidth,
  },
}))

const CloseButton = styled('button')({
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  padding: '4px 16px 14px',
  display: 'inline-flex',
  alignItems: 'center',
  '& img, & svg': { display: 'block', width: 22, height: 22 },
})

// AppMenuItem = the shared MenuRow + auto-close-on-click behavior. forwardRef so consumers that
// need the DOM node (e.g. a semantic-ui `Modal` trigger) can attach a ref rather than findDOMNode.
export const AppMenuItem = React.forwardRef(({ onClick, ...rest }, ref) => {
  const close = useContext(AppMenuCloseContext)

  const handleClick = e => {
    if (onClick) onClick(e)
    // Defer the close: closing unmounts this row synchronously, which would cancel an anchor item's
    // default navigation (and a modal trigger's open) before the browser acts on it.
    if (close) window.setTimeout(close, 0)
  }

  return <MenuRow ref={ref} onClick={handleClick} {...rest} />
})

AppMenuItem.displayName = 'AppMenuItem'

const AppMenu = ({
  trigger,
  closeIcon,
  children,
  minWidth = 320,
  borderRadius = '0 0 30px 30px',
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left' },
  ...popoverProps
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const close = () => {
    // Drop focus before the Popover hides — otherwise MUI applies aria-hidden to the panel while a
    // descendant (the close button / clicked row) still holds focus, which the browser blocks.
    const active = document.activeElement
    if (active && typeof active.blur === 'function') active.blur()
    setAnchorEl(null)
  }

  return (
    <>
      {React.cloneElement(trigger, { onClick: e => setAnchorEl(e.currentTarget) })}
      <AppMenuCloseContext.Provider value={close}>
        <StyledPopover
          open={open}
          anchorEl={anchorEl}
          onClose={close}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
          radius={borderRadius}
          menuMinWidth={minWidth}
          {...popoverProps}
        >
          {closeIcon && (
            <CloseButton type="button" onClick={close} aria-label="close menu">
              {closeIcon}
            </CloseButton>
          )}
          {children}
        </StyledPopover>
      </AppMenuCloseContext.Provider>
    </>
  )
}

export default AppMenu
