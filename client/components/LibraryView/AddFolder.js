import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import AppTextField from 'Components/ui/AppTextField'
import { images } from 'Utilities/common'

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
        maxWidth="xs"
      >
        <form onSubmit={handleSubmit}>
          <AppTextField
            autoFocus
            label={intl.formatMessage({ id: 'folder-name' })}
            value={folderName}
            error={Boolean(error)}
            helperText={error}
            onChange={e => {
              setFolderName(e.target.value)
              setError('')
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 20 }}>
            <AppButton variant="outline-secondary" onClick={closeDialog}>
              {intl.formatMessage({ id: 'Cancel' })}
            </AppButton>
            <AppButton type="submit" variant="primary" disabled={!folderName.trim()}>
              {intl.formatMessage({ id: 'Add' })}
            </AppButton>
          </div>
        </form>
      </AppDialog>
    </>
  )
}

export default AddFolder
