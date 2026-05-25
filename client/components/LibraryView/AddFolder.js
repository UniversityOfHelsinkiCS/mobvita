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
  Tooltip,
} from '@mui/material'
import { Button } from 'react-bootstrap'

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

  const handleSubmit = event => {
    event.preventDefault()

    const trimmedFolderName = folderName.trim()

    if (!trimmedFolderName) {
      setError('Folder name is required')
      return
    }

    if (trimmedFolderName.includes('/')) {
      setError('Folder name cannot contain /')
      return
    }

    if (existingFolderNames.includes(trimmedFolderName)) {
      setError('A folder with this name already exists here')
      return
    }

    onAddFolder(trimmedFolderName)
    closeDialog()
  }

  return (
    <>
      <Tooltip title={intl.formatMessage({ id: 'add-folder' })}>
        <IconButton
          aria-label={intl.formatMessage({ id: 'add-folder' })}
          className="library-add-folder-button"
          onClick={() => setOpen(true)}
        >
          <CreateNewFolderIcon />
        </IconButton>
      </Tooltip>

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
              onChange={event => {
                setFolderName(event.target.value)
                setError('')
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button variant="outline-secondary" onClick={closeDialog}>
              {intl.formatMessage({ id: 'Cancel' })}
            </Button>
            <Button type="submit" variant="primary">
              {intl.formatMessage({ id: 'Add' })}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  )
}

export default AddFolder
