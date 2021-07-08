import React from 'react'
import { Modal, Icon, Divider } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const CompeteEnd = ({ open, setOpen, playerScore, botScore, exercisesTotal }) => {
  const history = useHistory()

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

    return <FormattedMessage id="tie-try-again" />
  }

  const playerScoreColor = whoseScore => {
    if (whoseScore === 'you') {
      if (playerScore > botScore) return { color: 'green' }
      if (playerScore < botScore) return { color: 'red' }
    }
    if (playerScore > botScore) return { color: 'red' }
    if (playerScore < botScore) return { color: 'green' }
  }

  const handleBackToLibrary = () => history.push('/library')
  const handleRestart = () => window.location.reload()

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      size="tiny"
      closeIcon={{
        style: { top: '1.0535rem', right: '1rem' },
        color: 'black',
        name: 'close',
      }}
      data-cy="competition-end-modal"
    >
      <Modal.Header>{getHeaderText()}</Modal.Header>
      <Modal.Content>
        <div className="competition-results-cont">
          <div className="competition-player-results">
            <div className="header-2">
              <FormattedMessage id="you" />
            </div>
            <div style={{ ...playerScoreColor('you'), fontSize: '36px' }}>
              <span>{playerScore}</span>/{exercisesTotal}
            </div>
          </div>
          <Divider vertical>VS</Divider>
          <div className="competition-player-results">
            <div className="header-2">
              <FormattedMessage id="opponent" />
            </div>
            <div style={{ ...playerScoreColor('opponent'), fontSize: '36px' }}>
              <span>{botScore}</span>/{exercisesTotal}
            </div>
          </div>
        </div>
        <div className="competition-results-buttons-cont">
          <Button onClick={handleRestart} style={{ marginBottom: '.25em' }}>
            {playerScore > botScore ? (
              <FormattedMessage id="restart-competition" />
            ) : (
              <FormattedMessage id="try-again" />
            )}
          </Button>
          <Button variant="outline-primary" onClick={handleBackToLibrary}>
            <Icon name="arrow left" /> <FormattedMessage id="back-to-library" />
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default CompeteEnd
