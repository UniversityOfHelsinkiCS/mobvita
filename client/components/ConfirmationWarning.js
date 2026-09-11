// React must remain in scope because Vite compiles this project's JSX with the classic runtime.
// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Box } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import AppDialog from 'Components/ui/AppDialog'
import AppButton from 'Components/AppButton'

const ConfirmationWarning = ({
  open,
  setOpen,
  action,
  children,
  title,
  acceptLabel,
  cancelLabel,
  acceptButtonProps,
  cancelButtonProps,
  actionsSx,
}) => {
  const handleAccept = () => {
    setOpen(false)
    action()
  }

  const handleReject = () => {
    setOpen(false)
  }

  return (
    <AppDialog
      open={open}
      onClose={handleReject}
      maxWidth="xs"
      title={title || <FormattedMessage id="Warning" />}
    >
      <Box sx={{ mb: '1.75em', lineHeight: 1.5 }}>{children}</Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75em', ...actionsSx }}>
        <AppButton variant="contrast-outline" onClick={handleReject} {...cancelButtonProps}>
          {cancelLabel || <FormattedMessage id="Cancel" />}
        </AppButton>
        <AppButton
          variant="danger"
          onClick={handleAccept}
          data-cy="confirm-warning-dialog"
          {...acceptButtonProps}
        >
          {acceptLabel || <FormattedMessage id="Confirm" />}
        </AppButton>
      </Box>
    </AppDialog>
  )
}

export default ConfirmationWarning
