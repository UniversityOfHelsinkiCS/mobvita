import React from 'react'
import { Icon } from 'semantic-ui-react'
import { useSelector } from 'react-redux'

const CompetitionPause = ({ handlePauseOrResumeClick }) => {
  const { isPaused, willPause } = useSelector(({ compete }) => compete)

  return (
    <div className="flex align-end">
      <div className="competition-pause-btn">
        <Icon
          className={willPause ? 'clicked' : 'unclicked'}
          size="large"
          name={isPaused ? 'play' : 'pause'}
          color={willPause ? 'grey' : 'black'}
          onClick={handlePauseOrResumeClick}
          style={{ margin: 0 }}
        />
      </div>
    </div>
  )
}

export default CompetitionPause
