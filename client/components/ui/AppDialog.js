import React from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import xClose from 'Assets/images/x-close.svg'
import { colors, font, shape } from 'Assets/mui_theme/designTokens'
import AppIcon from './AppIcon'

const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    backgroundColor: colors.card,
    borderRadius: shape.cardRadius,
    color: colors.ink,
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.18)',
  },
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(45, 44, 42, 0.4)',
  },
})

// Puts the caller's sx (object or array) after the defaults so it wins; MUI skips falsy entries.
const withSx = (defaults, sx) => [defaults, ...(Array.isArray(sx) ? sx : [sx])]

// AppDialog — design-system modal (MUI Dialog): cream card, ink text, title row with an optional
// `subtitle` line and an SVG close (X); the `*Sx` props override each part (see AddNewStoryDialog).
const AppDialog = ({
  open,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'sm',
  fullWidth = true,
  closeDataCy,
  paperSx,
  titleSx,
  subtitleSx,
  contentSx,
  closeSx,
  sx,
  ...rest
}) => (
  <StyledDialog
    open={open}
    onClose={onClose}
    maxWidth={maxWidth}
    fullWidth={fullWidth}
    sx={withSx({ '& .MuiDialog-paper': paperSx }, sx)}
    {...rest}
  >
    <DialogTitle
      sx={withSx({ fontSize: '24px', fontWeight: 500, color: colors.ink, pr: 6 }, titleSx)}
    >
      {title}
      {subtitle && (
        <Box
          component="span"
          sx={withSx(
            { display: 'block', mt: 1, fontSize: font.lead, fontWeight: 400, lineHeight: '18px' },
            subtitleSx,
          )}
        >
          {subtitle}
        </Box>
      )}
      {onClose && (
        <IconButton
          onClick={onClose}
          aria-label="close"
          data-cy={closeDataCy}
          sx={withSx({ position: 'absolute', right: 16, top: 16, color: colors.ink }, closeSx)}
        >
          {/* The Figma x-close asset; a 24px box draws the same 12px X the MUI CloseIcon did. */}
          <AppIcon src={xClose} size={24} color="currentColor" />
        </IconButton>
      )}
    </DialogTitle>
    <DialogContent sx={withSx({ color: colors.ink }, contentSx)}>{children}</DialogContent>
  </StyledDialog>
)

export default AppDialog
