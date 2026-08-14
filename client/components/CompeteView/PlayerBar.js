import React, { useEffect } from 'react'
import Spinner from 'Components/Spinner'
import AppProgressBar from 'Components/ui/AppProgressBar'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import { FormattedMessage } from 'react-intl'
import useWindowDimensions from 'Utilities/windowDimensions'
import { colors } from 'Assets/mui_theme/designTokens'

const PlayerBar = ({
  snippetsTotal,
  currentSnippet,
  playerFinished,
  setPlayerFinished,
  setEndModalOpen,
  playerScore,
}) => {
  const smallScreen = useWindowDimensions().width < 500

  useEffect(() => {
    if (currentSnippet === snippetsTotal) {
      if (!playerFinished) {
        setPlayerFinished('user')
        setTimeout(() => {
          setEndModalOpen(true)
        }, 1000)
      }
    }
  }, [currentSnippet])

  const getLabelsWidth = () => {
    if (currentSnippet > snippetsTotal) return 100
    if (smallScreen && currentSnippet / snippetsTotal < 0.3) return 30
    if (!smallScreen && currentSnippet / snippetsTotal < 0.12) return 12
    return (currentSnippet / snippetsTotal) * 100
  }

  const getBarWidth = () => {
    if (currentSnippet / snippetsTotal === 0) return 2
    return (currentSnippet / snippetsTotal) * 100
  }

  const playerProgressTestString = (currentSnippet / snippetsTotal).toFixed(2).replace('.', '')

  return (
    <>
      {!snippetsTotal ? (
        <Spinner />
      ) : (
        <div data-cy="player-bar">
          <AppProgressBar
            value={getBarWidth()}
            height="0.9em"
            trackColor={colors.progressBarTrack}
            fillColor={colors.progressBarFill}
            style={{ borderRadius: '0px 0px 10px 10px' }}
            fillProps={{
              'data-cy': `progress-${playerProgressTestString}`,
              style: { borderRadius: 0 },
            }}
          />

          <div
            className="competition-bar-label"
            style={{
              width: `${getLabelsWidth()}%`,
            }}
          >
            <div data-cy="player-bar-progress-label">
              <span className="bold">
                <FormattedMessage id="you" />
              </span>{' '}
              ({currentSnippet}/{snippetsTotal})
            </div>
            <div>
              <div className="justify-center">
                <ThumbUpOutlinedIcon sx={{ color: 'green', marginBottom: '.2em' }} />
              </div>
              <div className="justify-center" data-cy="player-bar-score">
                {playerScore}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PlayerBar
