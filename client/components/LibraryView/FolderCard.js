import React, { memo } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IconButton } from '@mui/material'
import Folder from '../../assets/images/folder.png'
import './LibraryView.scss'

const FolderCard = ({ name, onClick }) => {
  const handleKeyDown = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick()
    }
  }

  return (
    <div
      className="library-folder-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <span className="library-folder-tab" />

      <span className="library-folder-content">
        <img src={Folder} alt="Folder" className="library-folder-icon" />
        <span className="library-folder-name">{name}</span>
      </span>

      <IconButton
        className="library-folder-menu"
        size="small"
        onClick={event => {
          event.stopPropagation()
          console.log('Open folder menu')
        }}
      >
        <MoreVertIcon />
      </IconButton>
    </div>
  )
}

export default memo(FolderCard)
