import React, { memo } from 'react'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IconButton, Tooltip } from '@mui/material'
import Folder from '../../assets/images/folder.png'
import './LibraryView.scss'

const FolderCard = ({
  name,
  onClick,
  onDragLeave,
  onDragOver,
  onDrop,
  onRemove,
  isDropTarget = false,
  isEmpty = false,
}) => {
  const handleKeyDown = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
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
        <img src={Folder} alt="Folder" className="library-folder-icon" />
        <span className="library-folder-name">{name}</span>
      </span>

      <Tooltip title={onRemove ? 'Remove empty folder' : 'Folder options'}>
        <IconButton
          aria-label={onRemove ? 'Remove empty folder' : 'Folder options'}
          className="library-folder-menu"
          size="small"
          onClick={event => {
            event.stopPropagation()
            if (onRemove) {
              onRemove()
              return
            }

            console.log('Open folder menu')
          }}
        >
          {onRemove ? <DeleteOutlineOutlinedIcon /> : <MoreVertIcon />}
        </IconButton>
      </Tooltip>
    </div>
  )
}

export default memo(FolderCard)
