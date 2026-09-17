import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import Box from '@mui/material/Box'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import AppTextField from 'Components/ui/AppTextField'
import {
  dialogActionsSx,
  fieldLabelSx,
  dialogSx,
  pillButtonSx,
  pillOutlineSx,
} from 'Components/ui/dialogSx'
import { images } from 'Utilities/common'

// The library's add-folder button and its 539px dialog (name field, Cancel, Add).
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
      <AppButton
        variant="tan"
        className="library-action-button"
        onClick={openDialog}
        data-cy="add-folder-button"
      >
        <img src={images.folderPlus} alt="" />
        {intl.formatMessage({ id: 'add-folder' })}
      </AppButton>

      <AppDialog
        open={open}
        onClose={closeDialog}
        title={intl.formatMessage({ id: 'add-folder' })}
        maxWidth="md"
        data-cy="add-folder-dialog"
        {...dialogSx(539)}
      >
        <form onSubmit={handleSubmit}>
          <AppTextField
            autoFocus
            label={intl.formatMessage({ id: 'folder-name' })}
            labelSx={fieldLabelSx}
            value={folderName}
            error={Boolean(error)}
            helperText={error}
            onChange={e => {
              setFolderName(e.target.value)
              setError('')
            }}
            inputProps={{ 'data-cy': 'add-folder-name-input' }}
          />
          <Box sx={{ ...dialogActionsSx, mt: '30px' }}>
            <AppButton
              variant="tan-outline"
              sx={pillOutlineSx()}
              onClick={closeDialog}
              data-cy="add-folder-cancel"
            >
              {intl.formatMessage({ id: 'Cancel' })}
            </AppButton>
            <AppButton
              type="submit"
              sx={pillButtonSx()}
              disabled={!folderName.trim()}
              data-cy="add-folder-submit"
            >
              {intl.formatMessage({ id: 'Add' })}
            </AppButton>
          </Box>
        </form>
      </AppDialog>
    </>
  )
}

export default AddFolder
