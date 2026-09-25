import { colors } from 'Assets/mui_theme/designTokens'

// Field label: muted, inset 10px from the pill's edge, and 2px above the pill.
export const fieldLabelSx = { color: colors.muted, pl: '10px', mb: '2px' }

// Drops the field's green ring in every resting state, keeping the cream pill and its exact
// metrics — `transparent` rather than `none` so the outline still reserves its 2px and nothing
// shifts. The error ring is left alone: `.Mui-error fieldset` outranks the bare `fieldset` here.
export const fieldRinglessSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'transparent' },
    '&:hover fieldset': { borderColor: 'transparent' },
    '&.Mui-focused fieldset': { borderColor: 'transparent' },
  },
}
