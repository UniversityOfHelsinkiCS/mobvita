import React from 'react'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import { useSelector } from 'react-redux'

const PracticeTimer = ({
  controlledPractice,
  showPauseButton,
  timerContent,
  handlePauseOrResumeClick,
}) => {
  const { isPaused, willPause } = useSelector(({ practice }) => practice)

  if (!controlledPractice) return null

  const PauseOrPlayIcon = isPaused ? PlayArrowIcon : PauseIcon

  return (
    <div className="practice-timer-cont">
      <div className="practice-timer-btns-cont">
        {showPauseButton && (
          <div className="practice-timer-pause-btn">
            <PauseOrPlayIcon
              className={willPause ? 'clicked' : 'unclicked'}
              fontSize="small"
              sx={{ color: willPause ? 'grey' : 'black' }}
              data-cy="practice-timer-pause-button"
              onClick={handlePauseOrResumeClick}
              style={{ margin: 0 }}
            />
          </div>
        )}
        <div className="practice-timer-value" data-cy="practice-timer-value">
          {timerContent > 0 ? timerContent : 0}
        </div>
      </div>
    </div>
  )
}

export default PracticeTimer
