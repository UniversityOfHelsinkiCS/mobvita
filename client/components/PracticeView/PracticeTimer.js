import React from 'react'
import { Icon } from 'semantic-ui-react'
import { useSelector } from 'react-redux'

const PracticeTimer = ({
  controlledPractice,
  showPauseButton,
  timerContent,
  handlePauseOrResumeClick,
}) => {
  const { isPaused, willPause } = useSelector(({ practice }) => practice)

  if (!controlledPractice) return null

  return (
    <div className="practice-timer-cont">
      <div className="practice-timer-btns-cont">
        {showPauseButton && (
          <div className="practice-timer-pause-btn">
            <Icon
              className={willPause ? 'clicked' : 'unclicked'}
              size="small"
              name={isPaused ? 'play' : 'pause'}
              color={willPause ? 'grey' : 'black'}
              onClick={handlePauseOrResumeClick}
              style={{ margin: 0 }}
            />
          </div>
        )}
        <div className="practice-timer-value">{timerContent}</div>
      </div>
    </div>
  )
}

export default PracticeTimer
