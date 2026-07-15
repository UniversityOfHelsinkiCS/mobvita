import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
} from '@mui/material'
import AppButton from 'Components/AppButton'
import CustomTooltip from 'Components/CustomTooltip'

const AddFolder = ({ existingFolderNames, onAddFolder }) => {
  const intl = useIntl()
  const [open, setOpen] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [error, setError] = useState('')

  const closeDialog = () => {
    setOpen(false)
    setFolderName('')
    setError('')
  }

  const openDialog = e => {
    e.currentTarget.blur()
    setOpen(true)
  }

  const handleSubmit = e => {
    e.preventDefault()

    const trimmedFolderName = folderName.trim()

    if (trimmedFolderName.includes('/')) {
      setError(intl.formatMessage({ id: 'folder-name-invalid' }))
      return
    }

    if (existingFolderNames.includes(trimmedFolderName)) {
      setError(intl.formatMessage({ id: 'folder-name-exists' }))
      return
    }

    onAddFolder(trimmedFolderName)
    closeDialog()
  }

  return (
    <>
      <CustomTooltip title={intl.formatMessage({ id: 'add-folder' })}>
        <IconButton
          aria-label={intl.formatMessage({ id: 'add-folder' })}
          className="library-add-folder-button"
          onClick={openDialog}
        >
          <CreateNewFolderIcon />
        </IconButton>
      </CustomTooltip>

      <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="xs">
        <Box component="form" onSubmit={handleSubmit}>
          <DialogTitle>{intl.formatMessage({ id: 'add-folder' })}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              label={intl.formatMessage({ id: 'folder-name' })}
              margin="dense"
              value={folderName}
              error={Boolean(error)}
              helperText={error}
              onChange={e => {
                setFolderName(e.target.value)
                setError('')
              }}
            />
          </DialogContent>
          <DialogActions>
            <AppButton variant="outline-secondary" onClick={closeDialog}>
              {intl.formatMessage({ id: 'Cancel' })}
            </AppButton>
            <AppButton type="submit" variant="primary" disabled={!folderName.trim()}>
              {intl.formatMessage({ id: 'Add' })}
            </AppButton>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}

export default AddFolder
