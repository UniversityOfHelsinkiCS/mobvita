import React, { memo, useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from '@mui/material'
import { FormattedMessage, useIntl } from 'react-intl'
import AppButton from 'Components/AppButton'
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
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [renameOpen, setRenameOpen] = useState(false)
  const [renameValue, setRenameValue] = useState(name)
  const [renameError, setRenameError] = useState('')
  const menuOpen = Boolean(menuAnchor)
  const hasMenu = Boolean(onRename || onDelete || onRemove)

  const handleKeyDown = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick()
    }
  }

  const handleMenuOpen = e => {
    e.stopPropagation()
    setMenuAnchor(e.currentTarget)
  }

  const handleMenuClose = e => {
    e?.stopPropagation()
    setMenuAnchor(null)
  }

  const handleDeleteClick = e => {
    handleMenuClose(e)
    onDelete()
  }

  const handleRemoveClick = e => {
    handleMenuClose(e)
    onRemove()
  }

  const openRenameDialog = e => {
    handleMenuClose(e)
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
    isSelected ? 'library-folder-card-selected' : '',
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
          <IconButton
            aria-label={intl.formatMessage({ id: 'folder-options' })}
            className="library-folder-menu"
            size="small"
            onClick={handleMenuOpen}
            onKeyDown={e => e.stopPropagation()}
          >
            <MoreVertIcon />
          </IconButton>
        )}
      </div>

      {hasMenu && (
        <Menu
          anchorEl={menuAnchor}
          open={menuOpen}
          onClose={handleMenuClose}
          onClick={e => e.stopPropagation()}
        >
          {onRename && (
            <MenuItem onClick={openRenameDialog}>
              <FormattedMessage id="rename-folder" />
            </MenuItem>
          )}
          {onDelete && (
            <MenuItem onClick={handleDeleteClick}>
              <FormattedMessage id="delete-folder" />
            </MenuItem>
          )}
          {onRemove && (
            <MenuItem onClick={handleRemoveClick}>
              <FormattedMessage id="remove-empty-folder" />
            </MenuItem>
          )}
        </Menu>
      )}

      {onRename && (
        <Dialog open={renameOpen} onClose={closeRenameDialog} fullWidth maxWidth="xs">
          <Box component="form" onSubmit={handleRenameSubmit}>
            <DialogTitle>
              <FormattedMessage id="rename-folder" />
            </DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                fullWidth
                label={intl.formatMessage({ id: 'folder-name' })}
                margin="dense"
                value={renameValue}
                error={Boolean(renameError)}
                helperText={renameError}
                onChange={e => {
                  setRenameValue(e.target.value)
                  setRenameError('')
                }}
              />
            </DialogContent>
            <DialogActions>
              <AppButton variant="outline-secondary" onClick={closeRenameDialog}>
                {intl.formatMessage({ id: 'Cancel' })}
              </AppButton>
              <AppButton type="submit" variant="primary" disabled={!renameValue.trim()}>
                {intl.formatMessage({ id: 'Save' })}
              </AppButton>
            </DialogActions>
          </Box>
        </Dialog>
      )}
    </>
  )
}

export default memo(FolderCard)
