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
 * onChange receives the native MUI event (use `e.target.value`).
 */
const Label = styled('label')({
  display: 'block',
  marginBottom: 6,
  fontFamily: font.family,
  fontSize: font.label,
  fontWeight: 500,
  color: colors.ink,
})

// `multiline` is read for styling (auto height + softer radius for textareas) and still forwarded
// to TextField so it renders a textarea.
const StyledTextField = styled(TextField)(({ multiline }) => ({
  '& .MuiOutlinedInput-root': {
    ...(multiline ? { padding: '10px 18px' } : { height: shape.inputHeight }),
    backgroundColor: colors.card,
    borderRadius: multiline ? '18px' : shape.inputRadius,
    fontFamily: font.family,
    fontSize: font.input,
    color: colors.ink,
    '& fieldset': { borderColor: colors.border },
    '&:hover fieldset': { borderColor: colors.focus },
    '&.Mui-focused fieldset': { borderColor: colors.focus, borderWidth: 1 },
    '&.Mui-error fieldset': { borderColor: colors.error },
  },
  '& .MuiOutlinedInput-input': {
    padding: multiline ? 0 : '0 18px',
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
  const passwordAdornment = isPassword
    ? {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword(prev => !prev)}
              edge="end"
              size="small"
              tabIndex={-1}
              aria-label="toggle password visibility"
              sx={{ color: colors.muted }}
            >
              {showPassword ? (
                <VisibilityOffIcon fontSize="small" />
              ) : (
                <VisibilityIcon fontSize="small" />
              )}
            </IconButton>
          </InputAdornment>
        ),
      }
    : undefined

  const mergedSlotProps = {
    ...slotProps,
    ...(passwordAdornment ? { input: { ...slotProps?.input, ...passwordAdornment } } : {}),
    ...(inputProps ? { htmlInput: { ...slotProps?.htmlInput, ...inputProps } } : {}),
  }

  return (
    <div style={{ width: fullWidth ? '100%' : undefined }}>
      {label && <Label>{label}</Label>}
      <StyledTextField
        type={resolvedType}
        fullWidth={fullWidth}
        variant="outlined"
        slotProps={mergedSlotProps}
        {...rest}
      />
    </div>
  )
}

export default AppTextField
