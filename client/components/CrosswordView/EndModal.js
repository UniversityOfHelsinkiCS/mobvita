import React from 'react'
import { Box } from '@mui/material'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import { FormattedMessage, useIntl } from 'react-intl'
import { Link } from 'react-router-dom'

const EndModal = ({ open, setOpen, restart }) => {
  const intl = useIntl()

  const handleClose = () => setOpen(false)

  const handleRestart = () => {
    setOpen(false)
    restart()
  }

  return (
    <AppDialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      title={intl.formatMessage({ id: 'congratulations-you-have-solved-this-crossword' })}
    >
      <Box sx={{ display: 'flex', gap: '0.75em', flexWrap: 'wrap', mt: '0.5em' }}>
        <AppButton variant="tan" onClick={handleRestart}>
          <FormattedMessage id="New crossword" />
        </AppButton>
        <Link to="/library">
          <AppButton variant="contrast-outline">
            <FormattedMessage id="Back to library" />
          </AppButton>
        </Link>
      </Box>
    </AppDialog>
  )
}

export default EndModal
