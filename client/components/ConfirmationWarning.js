import React from 'react'
import { Box } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import AppDialog from 'Components/ui/AppDialog'
import AppButton from 'Components/AppButton'

const ConfirmationWarning = ({ open, setOpen, action, children }) => {
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
      title={<FormattedMessage id="Warning" />}
    >
      <Box sx={{ mb: '1.75em', lineHeight: 1.5 }}>{children}</Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75em' }}>
        <AppButton variant="contrast-outline" onClick={handleReject}>
          <FormattedMessage id="Cancel" />
        </AppButton>
        <AppButton variant="danger" onClick={handleAccept} data-cy="confirm-warning-dialog">
          <FormattedMessage id="Confirm" />
        </AppButton>
      </Box>
    </AppDialog>
  )
}

export default ConfirmationWarning
