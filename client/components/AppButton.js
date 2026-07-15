import React from 'react'
import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'

/**
 * AppButton — the app's standard button (MUI `Button` inside a `styled` wrapper).
 *
 * It intentionally mirrors the react-bootstrap `Button` prop names we use across the app so
 * migrating is close to a drop-in: swap the import + tag name, keep the props. Internally the
 * bootstrap-style `variant` / `size` / `block` are mapped onto MUI.
 *
 * Props:
 *   variant  - 'primary' | 'secondary' | 'danger' | 'success' | 'link' | 'outline-primary' | 'outline'
 *   size     - 'sm' | 'lg'            (bootstrap sizes; anything else = default/medium)
 *   block    - full width
 *   as       - element/component to render as (e.g. Link); mapped to MUI `component`
 *   type / onClick / disabled / className / style / data-cy / children … pass straight through.
 */

// Map our bootstrap-style variants to MUI's (variant + color).
const VARIANTS = {
  primary: { variant: 'contained', color: 'primary' },
  secondary: { variant: 'contained', color: 'secondary' },
  danger: { variant: 'contained', color: 'error' },
  success: { variant: 'contained', color: 'success' },
  link: { variant: 'text', color: 'primary' },
  outline: { variant: 'outlined', color: 'primary' },
  'outline-primary': { variant: 'outlined', color: 'primary' },
}

const SIZES = { sm: 'small', lg: 'large' }

const StyledButton = styled(Button)({
  textTransform: 'none', // bootstrap doesn't uppercase button text; keep original casing
  borderRadius: 8,
  // Many call sites (migrated from react-bootstrap) put a semantic-ui <Icon> straight inside the
  // button as a child. Semantic renders it as <i class="icon"> and paints the glyph from an
  // ::before using the 'Icons' font. Inside MUI's inline-flex Button that <i>'s em-based
  // width/height and baseline get distorted (the glyph shows clipped / as a broken box). Pin the
  // icon layout here once so every AppButton renders child icons inline with the label — no need
  // to touch each call site.
  '& > i.icon': {
    fontFamily: 'Icons', // defensive: keep the icon font even inside MUI's typography
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    height: 'auto',
    margin: '0 0.4em 0 0',
    lineHeight: 1,
    verticalAlign: 'middle',
    background: 'none',
  },
  '& > i.icon::before': {
    fontFamily: 'Icons',
    background: 'none',
  },
})

const AppButton = ({ variant = 'primary', size, block = false, as, sx, children, ...rest }) => {
  const mapped = VARIANTS[variant] || VARIANTS.primary
  return (
    <StyledButton
      variant={mapped.variant}
      color={mapped.color}
      size={SIZES[size] || 'medium'}
      fullWidth={block}
      component={as}
      sx={sx}
      {...rest}
    >
      {children}
    </StyledButton>
  )
}

export default AppButton
