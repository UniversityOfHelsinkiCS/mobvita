import React, { useEffect } from 'react'
import Spinner from 'Components/Spinner'
import { Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'

const PlayerBar = ({
  snippetsTotal,
  currentSnippet,
  playerFinished,
  setPlayerFinished,
  setEndModalOpen,
  playerScore,
}) => {
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
    if (currentSnippet / snippetsTotal < 0.12) return 12
    return (currentSnippet / snippetsTotal) * 100
  }

  const getBarWidth = () => {
    if (currentSnippet / snippetsTotal === 0) return 2
    return (currentSnippet / snippetsTotal) * 100
  }

  return (
    <>
      {!snippetsTotal ? (
        <Spinner />
      ) : (
        <div>
          <div
            style={{
              height: '0.9em',
              textAlign: 'center',
              borderRadius: '0px 0px 10px 10px',
            }}
            className="progress"
          >
            <div
              className="progress-bar bg-success"
              style={{
                width: `${getBarWidth()}%`,
                backgroundColor: '#FA6',
                borderRadius: '0',
              }}
              role="progressbar"
              aria-valuenow={getBarWidth()}
              aria-valuemin="0"
              aria-valuemax="100"
            />
          </div>

          <div
            className="competition-bar-label"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: `${getLabelsWidth()}%`,
              marginRight: '0',
            }}
          >
            <div style={{ width: '150px' }}>
              <span className="bold">
                <FormattedMessage id="you" />
              </span>{' '}
              ({currentSnippet}/{snippetsTotal})
            </div>
            <div>
              <Icon name="thumbs up outline" />
              <div>{playerScore}</div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PlayerBar
