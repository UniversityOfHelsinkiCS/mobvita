import React from 'react'
import { useSelector } from 'react-redux'
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { FormattedMessage } from 'react-intl'
import Spinner from 'Components/Spinner'
import { getWritingEssayVersions } from 'Utilities/redux/writingCorrectionReducer'

// Shows one saved essay fetched by id: its original and current versions side by side.
const EssayDetailModal = ({ open, onClose }) => {
  const essay = useSelector(state => state.writingCorrection.openedEssay)
  const pending = useSelector(state => state.writingCorrection.openedEssayPending)
  const error = useSelector(state => state.writingCorrection.openedEssayError)

  const close = () => onClose()
  const { title, original, current } = getWritingEssayVersions(essay)

  const renderVersion = (labelId, text) => (
    <Box sx={{ flex: '1 1 260px', minWidth: 0 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        <FormattedMessage id={labelId} />
      </Typography>
      <Typography sx={{ whiteSpace: 'pre-wrap' }}>{text || '—'}</Typography>
    </Box>
  )

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="md" data-cy="essay-detail-modal">
      <DialogTitle
        variant="h4"
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <span>{title || ''}</span>
        <IconButton onClick={close} aria-label="Close" size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {pending && <Spinner size={60} />}
        {!pending && error && (
          <Typography color="error">
            <FormattedMessage id="something-went-wrong" defaultMessage="Something went wrong." />
          </Typography>
        )}
        {!pending && !error && (
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {renderVersion('essay-original-version', original)}
            {renderVersion('essay-current-version', current)}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EssayDetailModal
