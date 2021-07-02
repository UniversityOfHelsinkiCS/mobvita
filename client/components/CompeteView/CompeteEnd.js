import React from 'react'
import { Modal, Divider } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const CompeteEnd = ({ open, setOpen, playerScore, botScore, exercisesTotal }) => {
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
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2.5em' }}>
          <Button disabled>
            {playerScore > botScore ? (
              <FormattedMessage id="restart-competition" />
            ) : (
              <FormattedMessage id="try-again" />
            )}
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default CompeteEnd
