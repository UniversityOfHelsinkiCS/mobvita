import React from 'react'
import { Modal } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const CompeteEnd = ({ open, setOpen, fasterPlayer, playerScore, botScore, exercisesTotal }) => {
  return (
    <Modal open={open} onClose={() => setOpen(false)} size="tiny">
      <Modal.Header>
        <span>Competition has ended</span>
      </Modal.Header>
      <Modal.Content>
        <div>
          {fasterPlayer === 'bot' ? (
            <span>Opponent was faster...</span>
          ) : (
            <span>You were faster!</span>
          )}
        </div>
        <br />
        <div>
          You got {playerScore} correct out of {exercisesTotal} exercises.
        </div>
        <br />
        <div>
          The opponent got {botScore} correct out of {exercisesTotal} exercises.
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default CompeteEnd
