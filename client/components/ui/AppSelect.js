import React from 'react'
import { styled } from '@mui/material/styles'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AppMenu, { AppMenuItem } from './AppMenu'
import { colors, font } from 'Assets/mui_theme/designTokens'

/**
 * AppSelect — design-system select/dropdown. The trigger is a pill styled with the same variants as
 * AppButton (tan / contrast / contrast-outline / tan-outline / inverse); the option list opens in the
 * cream AppMenu popover with AppMenuItem rows (the selected row is highlighted).
 *
 * Controlled: `value` + `onChange(value)`, `options` = [{ value, label }].
 * Pass a custom `trigger` element (e.g. an icon button) to open the same list from something other
 * than the default pill.
 */
const DISABLED_BG = '#E4E1D3'
const DISABLED_TEXT = '#B7B4A8'
const INK_HOVER = '#4A4844'
const TAN_OUTLINE_BG = '#E9F1EC'
const INVERSE_DISABLED = '#6B6862'

const VARIANT_STYLES = {
  tan: {
    backgroundColor: colors.green,
    color: colors.ink,
    border: '1px solid transparent',
    '&:hover': { backgroundColor: colors.greenHover },
    '&:disabled': { backgroundColor: DISABLED_BG, color: DISABLED_TEXT, cursor: 'default' },
  },
  contrast: {
    backgroundColor: colors.ink,
    color: colors.card,
    border: '1px solid transparent',
    '&:hover': { backgroundColor: INK_HOVER },
    '&:disabled': { backgroundColor: DISABLED_BG, color: DISABLED_TEXT, cursor: 'default' },
  },
  'contrast-outline': {
    backgroundColor: 'transparent',
    color: colors.ink,
    border: `1px solid ${colors.ink}`,
    '&:hover': { backgroundColor: colors.green, borderColor: colors.green },
    '&:disabled': { backgroundColor: 'transparent', color: DISABLED_TEXT, borderColor: DISABLED_BG, cursor: 'default' },
  },
  'tan-outline': {
    backgroundColor: TAN_OUTLINE_BG,
    color: colors.ink,
    border: `1px solid ${colors.green}`,
    '&:hover': { backgroundColor: colors.green, borderColor: colors.green },
    '&:disabled': { backgroundColor: 'transparent', color: DISABLED_TEXT, borderColor: DISABLED_BG, cursor: 'default' },
  },
  inverse: {
    backgroundColor: 'transparent',
    color: colors.card,
    border: `1px solid ${colors.card}`,
    '&:hover': { backgroundColor: colors.green, borderColor: colors.green, color: colors.ink },
    '&:disabled': { backgroundColor: 'transparent', color: INVERSE_DISABLED, borderColor: INVERSE_DISABLED, cursor: 'default' },
  },
}

const Trigger = styled('button', { shouldForwardProp: prop => prop !== 'variant' })(({ variant }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  width: '100%',
  padding: '9px 18px',
  borderRadius: 999,
  fontFamily: font.family,
  fontWeight: 600,
  fontSize: 16,
  textAlign: 'left',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
  '& .app-select-chevron': { fontSize: 20, flexShrink: 0 },
  ...(VARIANT_STYLES[variant] || VARIANT_STYLES.tan),
}))

const AppSelect = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select Option',
  variant = 'tan',
  disabled = false,
  minWidth = 200,
  trigger,
  ...menuProps
}) => {
  const selected = options.find(o => String(o.value) === String(value))

  const triggerEl = trigger || (
    <Trigger type="button" variant={variant} disabled={disabled} style={{ minWidth }}>
      <span>{selected ? selected.label : placeholder}</span>
      <KeyboardArrowDownIcon className="app-select-chevron" />
    </Trigger>
  )

  // Disabled (default pill): render the trigger alone, no menu.
  if (disabled && !trigger) return triggerEl

  return (
    <AppMenu minWidth={minWidth} trigger={triggerEl} {...menuProps}>
      {options.map(option => (
        <AppMenuItem
          key={option.value}
          selected={String(option.value) === String(value)}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </AppMenuItem>
      ))}
    </AppMenu>
  )
}

export default AppSelect
