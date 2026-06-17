import React, { memo, useState } from 'react'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material'
import Folder from '../../assets/images/folder.png'
import FolderEmpty from '../../assets/images/folder_empty.png'
import './LibraryView.scss'

const FolderCard = ({
  name,
  onClick,
  onDragLeave,
  onDragOver,
  onDrop,
  onDelete,
  onRemove,
  isDropTarget = false,
  isEmpty = false,
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null)
  const menuOpen = Boolean(menuAnchor)
  const hasMenu = Boolean(onDelete)

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

  const cardClassName = [
    'library-folder-card',
    isDropTarget ? 'library-folder-card-drop-target' : '',
    isEmpty ? 'library-folder-card-empty' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={cardClassName}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
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

      {(onRemove || hasMenu) && (
        <>
          <Tooltip title={onRemove ? 'Remove empty folder' : 'Folder options'}>
            <IconButton
              aria-label={onRemove ? 'Remove empty folder' : 'Folder options'}
              className="library-folder-menu"
              size="small"
              onClick={e => {
                e.stopPropagation()
                if (onRemove) {
                  onRemove()
                  return
                }

                handleMenuOpen(e)
              }}
            >
              {onRemove ? <DeleteOutlineOutlinedIcon /> : <MoreVertIcon />}
            </IconButton>
          </Tooltip>
          {hasMenu && (
            <Menu
              anchorEl={menuAnchor}
              open={menuOpen}
              onClose={handleMenuClose}
              onClick={e => e.stopPropagation()}
            >
              <MenuItem onClick={handleDeleteClick}>Delete folder</MenuItem>
            </Menu>
          )}
        </>
      )}
    </div>
  )
}

export default memo(FolderCard)
