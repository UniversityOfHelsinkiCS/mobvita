import React from 'react'
import { Divider } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useNavigate } from 'react-router-dom'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import { FormattedMessage } from 'react-intl'

const CompeteEnd = ({ open, setOpen, playerScore, botScore, exercisesTotal }) => {
  const navigate = useNavigate()

  const getHeaderText = () => {
    if (playerScore !== botScore)
      return (
        <div className="header-2">
          {playerScore > botScore ? (
            <>
              <FormattedMessage id="you-won" />{' '}
              <span role="img" aria-label="party-popper">
                🎉
              </span>
            </>
          ) : (
            <>
              <FormattedMessage id="better-luck-next-time" />{' '}
              <span role="img" aria-label="neutral-face">
                😐
              </span>
            </>
          )}
        </div>
      )

    return <FormattedMessage id="compete:tie-try-again" />
  }

  const playerScoreColor = whoseScore => {
    if (whoseScore === 'you') {
      if (playerScore > botScore) return { color: 'green' }
      if (playerScore < botScore) return { color: 'red' }
    }
    if (playerScore > botScore) return { color: 'red' }
    if (playerScore < botScore) return { color: 'green' }
  }

  const handleBackToLibrary = () => navigate('/library')
  const handleRestart = () => window.location.reload()

  return (
    <AppDialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="xs"
      title={<div data-cy="competition-end-header">{getHeaderText()}</div>}
      closeDataCy="competition-end-modal-close"
      data-cy="competition-end-modal"
    >
      <div className="competition-results-cont">
        <div className="competition-player-results">
          <div className="header-2">
            <FormattedMessage id="you" />
          </div>
          <div
            style={{ ...playerScoreColor('you'), fontSize: '36px' }}
            data-cy="competition-end-player-score"
          >
            <span>{playerScore}</span>/{exercisesTotal}
          </div>
        </div>
        <Divider orientation="vertical" flexItem>
          VS
        </Divider>
        <div className="competition-player-results">
          <div className="header-2">
            <FormattedMessage id="opponent" />
          </div>
          <div
            style={{ ...playerScoreColor('opponent'), fontSize: '36px' }}
            data-cy="competition-end-opponent-score"
          >
            <span>{botScore}</span>/{exercisesTotal}
          </div>
        </div>
      </div>
      <div className="competition-results-buttons-cont">
        <AppButton
          onClick={handleRestart}
          style={{ marginBottom: '.25em' }}
          data-cy="competition-end-restart-button"
        >
          {playerScore > botScore ? (
            <FormattedMessage id="restart-competition" />
          ) : (
            <FormattedMessage id="compete:try-again" />
          )}
        </AppButton>
        <AppButton
          variant="outline-primary"
          onClick={handleBackToLibrary}
          data-cy="competition-end-back-to-library-button"
        >
          <ArrowBackIcon /> <FormattedMessage id="back-to-library" />
        </AppButton>
      </div>
    </AppDialog>
  )
}

export default CompeteEnd
