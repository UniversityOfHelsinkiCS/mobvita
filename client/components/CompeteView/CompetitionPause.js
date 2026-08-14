import React from 'react'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import { useSelector } from 'react-redux'

const CompetitionPause = ({ handlePauseOrResumeClick }) => {
  const { isPaused, willPause } = useSelector(({ compete }) => compete)

  const PauseOrPlayIcon = isPaused ? PlayArrowIcon : PauseIcon

  return (
    <div className="flex align-end">
      <div className="competition-pause-btn">
        <PauseOrPlayIcon
          className={willPause ? 'clicked' : 'unclicked'}
          fontSize="small"
          sx={{ color: willPause ? 'grey' : 'black' }}
          data-cy="competition-pause-button"
          onClick={handlePauseOrResumeClick}
          style={{ margin: 0 }}
        />
      </div>
    </div>
  )
}

export default CompetitionPause
