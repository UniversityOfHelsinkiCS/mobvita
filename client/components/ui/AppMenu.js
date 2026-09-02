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
export const AppMenuCloseContext = createContext(null)

const StyledPopover = styled(Popover, {
  shouldForwardProp: prop => prop !== 'radius' && prop !== 'menuMinWidth',
})(({ radius, menuMinWidth }) => ({
  // Sit above the app's other overlay layers (tooltips/dialogs) so the menu isn't hidden.
  zIndex: 3000,
  '& .MuiPopover-paper': {
    backgroundColor: colors.card,
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18)',
    padding: '10px 15px',
    // Scroll long lists (e.g. AppSelect language options) instead of overflowing off-screen.
    overflowY: 'auto',
    overflowX: 'hidden',
    maxHeight: 'min(60vh, 420px)',
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
// need the DOM node (e.g. a modal trigger) can attach a ref.
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
  onOpenChange,
  minWidth = 320,
  // When true the panel is sized to the trigger's width (e.g. a full-width trigger in a sidebar),
  // so the dropdown spans the same width as the control that opened it, ignoring `minWidth`.
  matchTriggerWidth = false,
  borderRadius = '30px',
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  transformOrigin = { vertical: 'top', horizontal: 'left' },
  ...popoverProps
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  // `onOpenChange` lets a consumer react to the menu opening/closing (e.g. keep a card highlighted
  // while its menu is open) — AppMenu still owns the anchor state itself.
  const openMenu = e => {
    setAnchorEl(e.currentTarget)
    if (onOpenChange) onOpenChange(true)
  }
  const close = () => {
    // Drop focus before the Popover hides — otherwise MUI applies aria-hidden to the panel while a
    // descendant (the close button / clicked row) still holds focus, which the browser blocks.
    const active = document.activeElement
    if (active && typeof active.blur === 'function') active.blur()
    setAnchorEl(null)
    if (onOpenChange) onOpenChange(false)
  }

  return (
    <>
      {/* Compose rather than replace: a custom trigger may carry its own onClick (e.g. the
          practice multiple-choice control dispatches "touched" when the learner opens it), and a
          bare `{ onClick: openMenu }` would silently drop it. */}
      {React.cloneElement(trigger, {
        onClick: e => {
          if (trigger.props.onClick) trigger.props.onClick(e)
          openMenu(e)
        },
      })}
      <AppMenuCloseContext.Provider value={close}>
        <StyledPopover
          open={open}
          anchorEl={anchorEl}
          onClose={close}
          anchorOrigin={anchorOrigin}
          transformOrigin={transformOrigin}
          radius={borderRadius}
          menuMinWidth={matchTriggerWidth ? 0 : minWidth}
          slotProps={
            matchTriggerWidth && anchorEl
              ? { paper: { style: { width: anchorEl.clientWidth } } }
              : undefined
          }
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
