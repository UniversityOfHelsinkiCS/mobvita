import React, { useState } from 'react'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { styled } from '@mui/material/styles'
import { colors, font, shape } from 'Assets/mui_theme/designTokens'

/**
 * AppTextField — design-system text input.
 *
 * Pure primitive (props only; local show/hide state doesn't count as app state) so it renders
 * standalone on /design. Matches the 2026 auth mockups: a small static label above a pill-shaped
 * cream input with a green border. When `type="password"` it renders a show/hide eye toggle.
 *
 * `startIcon` / `endIcon` take any node and render as adornments inside the pill. They are
 * presentation only — behaviour built on them lives in a wrapper (see AppSearchField). The password
 * toggle owns the end slot, so `endIcon` is ignored when `type="password"`.
 *
 * onChange receives the native MUI event (use `e.target.value`).
 */
const Label = styled('label')({
  display: 'block',
  marginBottom: 6,
  fontSize: font.label,
  fontWeight: 500,
  color: colors.ink,
})

// `multiline` is read for styling (auto height + softer radius for textareas) and still forwarded
// to TextField so it renders a textarea. `hasStart`/`hasEnd` are styling-only, so they are held
// back from the DOM — they shift padding from the text onto the pill to fit the adornments.
const StyledTextField = styled(TextField, {
  shouldForwardProp: prop => prop !== 'hasStart' && prop !== 'hasEnd',
})(({ multiline, hasStart, hasEnd }) => ({
  '& .MuiOutlinedInput-root': {
    ...(multiline ? { padding: '10px 18px' } : { height: shape.inputHeight }),
    ...(hasStart && { paddingLeft: shape.inputPaddingX }),
    ...(hasEnd && { paddingRight: shape.inputPaddingX }),
    backgroundColor: colors.card,
    borderRadius: multiline ? '18px' : shape.inputRadius,
    fontSize: font.input,
    color: colors.ink,
    '& fieldset': { borderColor: colors.border },
    '&:hover fieldset': { borderColor: colors.focus },
    '&.Mui-focused fieldset': { borderColor: colors.focus, borderWidth: 1 },
    '&.Mui-error fieldset': { borderColor: colors.error },
  },
  '& .MuiOutlinedInput-input': {
    padding: multiline ? 0 : '0 18px',
    // With an adornment the pill already supplies the outer padding; the input only needs the gap
    // between icon and text.
    ...(hasStart && { paddingLeft: shape.inputIconGap }),
    ...(hasEnd && { paddingRight: shape.inputIconGap }),
    '&::placeholder': { color: colors.muted, opacity: 1 },
    // Browsers repaint autofilled fields (username/password) with their own tint, overriding the
    // cream input background. Force it back to the card colour and keep the text readable.
    '&:-webkit-autofill': {
      WebkitBoxShadow: `0 0 0 1000px ${colors.card} inset`,
      WebkitTextFillColor: colors.ink,
      caretColor: colors.ink,
      borderRadius: 'inherit',
      transition: 'background-color 9999s ease-in-out 0s',
    },
  },
}))

const AppTextField = ({
  label,
  type = 'text',
  fullWidth = true,
  startIcon,
  endIcon,
  inputProps,
  slotProps,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword && showPassword ? 'text' : type

  // MUI v7+ dropped the legacy `InputProps` / `inputProps` on TextField in favour of `slotProps`
  // (which is why they leaked to the DOM). Build the slots here: `input` = the Input component
  // (adornments etc.), `htmlInput` = the native <input> attributes (data-cy, etc.). Callers can
  // still pass `inputProps`/`slotProps` and we fold them in.
  const passwordToggle = isPassword ? (
    <IconButton
      onClick={() => setShowPassword(prev => !prev)}
      edge="end"
      size="small"
      tabIndex={-1}
      aria-label="toggle password visibility"
      sx={{ color: colors.muted }}
    >
      {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
    </IconButton>
  ) : null

  // The password toggle and `endIcon` compete for the same slot; the toggle wins so a password
  // field can never lose its show/hide affordance.
  const endNode = passwordToggle || endIcon
  const inputSlot = {
    ...slotProps?.input,
    ...(startIcon && {
      startAdornment: <InputAdornment position="start">{startIcon}</InputAdornment>,
    }),
    ...(endNode && { endAdornment: <InputAdornment position="end">{endNode}</InputAdornment> }),
  }

  const mergedSlotProps = {
    ...slotProps,
    input: inputSlot,
    ...(inputProps ? { htmlInput: { ...slotProps?.htmlInput, ...inputProps } } : {}),
  }

  return (
    <div style={{ width: fullWidth ? '100%' : undefined }}>
      {label && <Label>{label}</Label>}
      <StyledTextField
        type={resolvedType}
        fullWidth={fullWidth}
        variant="outlined"
        hasStart={!!startIcon}
        hasEnd={!!endNode}
        slotProps={mergedSlotProps}
        {...rest}
      />
    </div>
  )
}

export default AppTextField
