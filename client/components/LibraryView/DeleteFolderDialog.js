import React from 'react'
import { FormattedMessage } from 'react-intl'
import Box from '@mui/material/Box'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import { dialogActionsSx, dialogSx, pillButtonSx, pillOutlineSx } from 'Components/ui/sx'
import { colors } from 'Assets/mui_theme/designTokens'

// The delete-folder question under a "Delete Folder" title, then Cancel and an alert Delete.
// Controlled via `open`/`onClose`; `onConfirm` runs the deletion and the caller closes it.
const DeleteFolderDialog = ({ open, onClose, onConfirm }) => (
  <AppDialog
    open={open}
    onClose={onClose}
    title={<FormattedMessage id="delete-folder" />}
    maxWidth="md"
    data-cy="delete-folder-dialog"
    {...dialogSx(539)}
  >
    <Box sx={{ fontSize: 16, fontWeight: 500, lineHeight: '18px', color: colors.ink }}>
      <FormattedMessage id="confirm-folder-delete" />
    </Box>
    <Box sx={{ ...dialogActionsSx, mt: '30px' }}>
      <AppButton
        variant="tan-outline"
        sx={pillOutlineSx()}
        onClick={onClose}
        data-cy="delete-folder-cancel"
      >
        <FormattedMessage id="Cancel" />
      </AppButton>
      <AppButton
        variant="alert"
        sx={{ ...pillButtonSx(colors.alert), color: colors.card }}
        onClick={onConfirm}
        data-cy="confirm-folder-delete"
      >
        <FormattedMessage id="Delete" />
      </AppButton>
    </Box>
  </AppDialog>
)

export default DeleteFolderDialog
