import React from 'react'
import { Modal } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

const EndModal = ({ open, setOpen, restart }) => {
  const handleRestart = () => {
    setOpen(false)
    restart()
  }

  return (
    <Modal open={open} size="tiny">
      <Modal.Header>
        <span>
          <FormattedMessage id="congratulations-you-have-solved-this-crossword" />
        </span>
      </Modal.Header>
      <Modal.Content>
        <Button variant="primary" onClick={handleRestart} style={{ marginRight: '0.5em' }}>
          <FormattedMessage id="New Crossword" />
        </Button>
        <Link to="/library">
          <Button variant="secondary">
            <FormattedMessage id="Back to library" />
          </Button>
        </Link>
      </Modal.Content>
    </Modal>
  )
}

export default EndModal
