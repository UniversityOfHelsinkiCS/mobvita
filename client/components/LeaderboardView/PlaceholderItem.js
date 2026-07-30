import React from 'react'
import { Skeleton } from '@mui/material'

const PlaceholderItem = ({ position }) => {
  return (
    <div className="leaderboard-item-container">
      <div className="flex" style={{ alignItems: 'center', flex: 1 }}>
        <div
          className="justify-center"
          style={{ width: '2.5rem', fontSize: '1.1rem', paddingRight: '.5rem' }}
        >
          {position}
        </div>
        <Skeleton variant="text" sx={{ fontSize: '1.1rem', minWidth: '15em', flex: 1 }} />
      </div>
      <Skeleton variant="text" sx={{ fontSize: '1.1rem', minWidth: '2.5rem' }} />
    </div>
  )
}

export default PlaceholderItem
