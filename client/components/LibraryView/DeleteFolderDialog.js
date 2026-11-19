import React from 'react'
import { FormattedMessage } from 'react-intl'
import Box from '@mui/material/Box'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import { dialogActionsSx, dialogSx, pillButtonSx, pillOutlineSx } from 'Components/ui/sx'
import { colors } from 'Assets/mui_theme/designTokens'

// Folder delete confirmation; with `inGroup` it asks to unshare the folder from `groupName`.
// Controlled via `open`/`onClose`; `onConfirm` runs the action and the caller closes it.
const DeleteFolderDialog = ({ open, onClose, onConfirm, inGroup = false, groupName = '' }) => (
  <AppDialog
    open={open}
    onClose={onClose}
    title={<FormattedMessage id={inGroup ? 'remove-folder-from-group' : 'delete-folder'} />}
    maxWidth="md"
    data-cy="delete-folder-dialog"
    {...dialogSx(539)}
  >
    <Box sx={{ fontSize: 16, fontWeight: 500, lineHeight: '18px', color: colors.ink }}>
      {inGroup ? (
        <FormattedMessage id="confirm-folder-remove-from-group" values={{ group: groupName }} />
      ) : (
        <FormattedMessage id="confirm-folder-delete" />
      )}
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
        <FormattedMessage id={inGroup ? 'Remove' : 'Delete'} />
      </AppButton>
    </Box>
  </AppDialog>
)

export default DeleteFolderDialog
