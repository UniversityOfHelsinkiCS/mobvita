import React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'
import { colors, font, shape } from 'Assets/mui_theme/designTokens'

/**
 * AppDialog — design-system modal (MUI `Dialog`, not semantic-ui `Modal`).
 *
 * Pure/controlled: `open` + `onClose`. Styled to match the login card — cream paper, ink text,
 * Geologica, rounded corners, soft shadow — with a title row and a close (X) button. Long content
 * scrolls inside `DialogContent` while the title stays put.
 */
const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: colors.card,
    borderRadius: shape.cardRadius,
    color: colors.ink,
    fontFamily: font.family,
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18)',
  },
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(45, 44, 42, 0.4)',
  },
})

const AppDialog = ({
  open,
  onClose,
  title,
  children,
  maxWidth = 'sm',
  fullWidth = true,
  ...rest
}) => (
  <StyledDialog open={open} onClose={onClose} maxWidth={maxWidth} fullWidth={fullWidth} {...rest}>
    <DialogTitle
      sx={{ fontFamily: font.family, fontSize: '24px', fontWeight: 500, color: colors.ink, pr: 6 }}
    >
      {title}
      {onClose && (
        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{ position: 'absolute', right: 16, top: 16, color: colors.ink }}
        >
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
    <DialogContent sx={{ fontFamily: font.family, color: colors.ink }}>{children}</DialogContent>
  </StyledDialog>
)

export default AppDialog
