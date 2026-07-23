import React from 'react'
import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { colors, font, shape } from 'Assets/mui_theme/designTokens'

/**
 * AppButton — the app's standard button, styled to the 2026 design system ("Button M IconText").
 *
 * Design variants (use these in new code):
 *   tan              - solid sage-green fill, ink text
 *   contrast         - solid ink fill, cream text
 *   contrast-outline - transparent, ink border/text; hover fills green
 *   tan-outline      - pale-green fill, green border; hover fills green
 *   inverse          - for dark backgrounds: transparent, cream border/text; hover fills green
 *   danger           - solid red (not in the button sheet, kept for destructive actions)
 *   link             - text-only, underlined
 *
 * Legacy bootstrap variant names are aliased onto the above so the ~90 existing call sites re-skin
 * automatically (primary→tan, secondary/dark→contrast, outline*→contrast-outline, …).
 *
 * Props: variant, size ('sm' | 'lg' — else medium), block (full width), as (→ MUI `component`),
 * sx (wins over variant/size styles), plus type/onClick/disabled/className/data-cy/children.
 */

// Derived states not directly in designTokens.
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
    '&.Mui-disabled': { backgroundColor: DISABLED_BG, color: DISABLED_TEXT },
  },
  contrast: {
    backgroundColor: colors.ink,
    color: colors.card,
    border: '1px solid transparent',
    '&:hover': { backgroundColor: INK_HOVER },
    '&.Mui-disabled': { backgroundColor: DISABLED_BG, color: DISABLED_TEXT },
  },
  'contrast-outline': {
    backgroundColor: 'transparent',
    color: colors.ink,
    border: `1px solid ${colors.ink}`,
    '&:hover': { backgroundColor: colors.green, borderColor: colors.green, color: colors.ink },
    '&.Mui-disabled': { backgroundColor: 'transparent', color: DISABLED_TEXT, borderColor: DISABLED_BG },
  },
  'tan-outline': {
    backgroundColor: TAN_OUTLINE_BG,
    color: colors.ink,
    border: `1px solid ${colors.green}`,
    '&:hover': { backgroundColor: colors.green, borderColor: colors.green, color: colors.ink },
    '&.Mui-disabled': { backgroundColor: 'transparent', color: DISABLED_TEXT, borderColor: DISABLED_BG },
  },
  inverse: {
    backgroundColor: 'transparent',
    color: colors.card,
    border: `1px solid ${colors.card}`,
    '&:hover': { backgroundColor: colors.green, borderColor: colors.green, color: colors.ink },
    '&.Mui-disabled': { backgroundColor: 'transparent', color: INVERSE_DISABLED, borderColor: INVERSE_DISABLED },
  },
  danger: {
    backgroundColor: colors.error,
    color: '#fff',
    border: '1px solid transparent',
    '&:hover': { backgroundColor: '#B83A3A' },
    '&.Mui-disabled': { backgroundColor: DISABLED_BG, color: DISABLED_TEXT },
  },
  link: {
    backgroundColor: 'transparent',
    color: colors.ink,
    border: '1px solid transparent',
    padding: 0,
    minWidth: 0,
    textDecoration: 'underline',
    '&:hover': { backgroundColor: 'transparent', textDecoration: 'none' },
  },
}

const ALIASES = {
  primary: 'tan',
  success: 'tan',
  secondary: 'contrast',
  dark: 'contrast',
  outline: 'contrast-outline',
  'outline-primary': 'contrast-outline',
  'outline-secondary': 'contrast-outline',
  'outline-danger': 'danger',
  error: 'danger',
}

// Sizes per the Figma "Button M" (medium) and "Button Small" sheets; large is derived.
const SIZE_STYLES = {
  small: { padding: '5px 16px', fontSize: 14 },
  medium: { padding: '9px 26px', fontSize: font.button },
  large: { padding: '12px 34px', fontSize: 18 },
}
const SIZE_KEYS = { sm: 'small', lg: 'large' }

const resolveVariant = variant =>
  VARIANT_STYLES[variant] ? variant : ALIASES[variant] || 'tan'

const StyledButton = styled(Button)({
  textTransform: 'none',
  borderRadius: shape.buttonRadius,
  fontFamily: font.family,
  fontWeight: 600,
  lineHeight: 1.2,
  boxShadow: 'none',
  gap: 8,
  transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
  '&:hover': { boxShadow: 'none' },
  '& img, & > svg': { width: 20, height: 20 },
  '& > svg': { color: 'currentColor' },
  // Legacy: some call sites drop a semantic-ui <Icon> (<i class="icon">) straight inside the button.
  // Pin its layout so the glyph renders inline with the label instead of clipped/boxed.
  '& > i.icon': {
    fontFamily: 'Icons',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    height: 'auto',
    margin: 0,
    lineHeight: 1,
    verticalAlign: 'middle',
    background: 'none',
  },
  '& > i.icon::before': { fontFamily: 'Icons', background: 'none' },
})

const AppButton = ({ variant = 'primary', size, block = false, as, sx, children, ...rest }) => {
  const variantSx = VARIANT_STYLES[resolveVariant(variant)]
  const sizeSx = SIZE_STYLES[SIZE_KEYS[size] || 'medium']
  const userSx = Array.isArray(sx) ? sx : [sx]

  return (
    <StyledButton
      variant="text"
      disableElevation
      size="medium"
      fullWidth={block}
      component={as}
      sx={[sizeSx, variantSx, ...userSx]}
      {...rest}
    >
      {children}
    </StyledButton>
  )
}

export default AppButton
