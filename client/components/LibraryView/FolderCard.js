import React, { memo, useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Box, IconButton } from '@mui/material'
import { FormattedMessage, useIntl } from 'react-intl'
import AppButton from 'Components/AppButton'
import AppMenu, { AppMenuItem } from 'Components/ui/AppMenu'
import AppDialog from 'Components/ui/AppDialog'
import AppTextField from 'Components/ui/AppTextField'
import Folder from '../../assets/images/folder.svg'
import FolderEmpty from '../../assets/images/folder_empty.png'
import FlipBackward from '../../assets/images/flip-backward.svg'
import './LibraryView.scss'

const FolderCard = ({
  name,
  onClick,
  onDragStart,
  onDragLeave,
  onDragOver,
  onDrop,
  onDelete,
  onRemove,
  onRename,
  existingFolderNames = [],
  draggable = false,
  isDragging = false,
  isDropTarget = false,
  isEmpty = false,
  isSelected = false,
  isBack = false,
}) => {
  const intl = useIntl()
  const [menuOpen, setMenuOpen] = useState(false)
  const [renameOpen, setRenameOpen] = useState(false)
  const [renameValue, setRenameValue] = useState(name)
  const [renameError, setRenameError] = useState('')
  const hasMenu = Boolean(onRename || onDelete || onRemove)

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  const openRenameDialog = () => {
    setRenameValue(name)
    setRenameError('')
    setRenameOpen(true)
  }

  const closeRenameDialog = () => {
    setRenameOpen(false)
    setRenameError('')
  }

  const handleRenameSubmit = e => {
    e.preventDefault()

    const trimmedName = renameValue.trim()

    if (!trimmedName || trimmedName === name) {
      closeRenameDialog()
      return
    }

    if (trimmedName.includes('/')) {
      setRenameError(intl.formatMessage({ id: 'folder-name-invalid' }))
      return
    }

    if (existingFolderNames.some(folderName => folderName !== name && folderName === trimmedName)) {
      setRenameError(intl.formatMessage({ id: 'folder-name-exists' }))
      return
    }

    onRename(trimmedName)
    closeRenameDialog()
  }

  // A leading "go up one level" pill shown inside a subfolder: same size as a folder card, but a green
  // flip-backward icon and "..." in place of the name (Figma "Library Folder" back variant).
  if (isBack) {
    return (
      <div
        className="library-folder-card library-folder-card-back"
        role="button"
        tabIndex={0}
        aria-label={'Back to parent folder'}
        onClick={onClick}
        onKeyDown={handleKeyDown}
      >
        <span className="library-folder-content">
          <img src={FlipBackward} alt="" className="library-folder-icon" />
          <span className="library-folder-name">...</span>
        </span>
      </div>
    )
  }

  const cardClassName = [
    'library-folder-card',
    isDropTarget ? 'library-folder-card-drop-target' : '',
    isEmpty ? 'library-folder-card-empty' : '',
    isSelected || menuOpen ? 'library-folder-card-selected' : '',
    isDragging ? 'library-folder-card-dragging' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <>
      <div
        className={cardClassName}
        role="button"
        tabIndex={0}
        draggable={draggable}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        onDragStart={onDragStart}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <span className="library-folder-tab" />

        <span className="library-folder-content">
          <img
            src={isEmpty && !isDropTarget ? FolderEmpty : Folder}
            alt="Folder"
            className="library-folder-icon"
          />
          <span className="library-folder-name">{name}</span>
        </span>

        {hasMenu && (
          // Swallow the trigger/menu clicks so they don't reach the card (which would navigate/select it).
          <span
            className="library-folder-menu-wrap"
            role="presentation"
            onClick={e => e.stopPropagation()}
            onKeyDown={e => e.stopPropagation()}
          >
            <AppMenu
              onOpenChange={setMenuOpen}
              minWidth={180}
              borderRadius="30px"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              trigger={
                <IconButton
                  aria-label={intl.formatMessage({ id: 'folder-options' })}
                  className="library-folder-menu"
                  size="small"
                >
                  <MoreVertIcon />
                </IconButton>
              }
            >
              {onRename && (
                <AppMenuItem onClick={openRenameDialog}>
                  <FormattedMessage id="rename-folder" />
                </AppMenuItem>
              )}
              {onDelete && (
                <AppMenuItem onClick={onDelete}>
                  <FormattedMessage id="delete-folder" />
                </AppMenuItem>
              )}
              {onRemove && (
                <AppMenuItem onClick={onRemove}>
                  <FormattedMessage id="remove-empty-folder" />
                </AppMenuItem>
              )}
            </AppMenu>
          </span>
        )}
      </div>

      {onRename && (
        <AppDialog
          open={renameOpen}
          onClose={closeRenameDialog}
          title={<FormattedMessage id="rename-folder" />}
          maxWidth="xs"
        >
          <Box
            component="form"
            onSubmit={handleRenameSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
          >
            <AppTextField
              autoFocus
              label={intl.formatMessage({ id: 'folder-name' })}
              value={renameValue}
              error={Boolean(renameError)}
              helperText={renameError}
              onChange={e => {
                setRenameValue(e.target.value)
                setRenameError('')
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <AppButton variant="outline-secondary" onClick={closeRenameDialog}>
                {intl.formatMessage({ id: 'Cancel' })}
              </AppButton>
              <AppButton type="submit" variant="primary" disabled={!renameValue.trim()}>
                {intl.formatMessage({ id: 'Save' })}
              </AppButton>
            </Box>
          </Box>
        </AppDialog>
      )}
    </>
  )
}

export default memo(FolderCard)
