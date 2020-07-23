import React from 'react'
import { Modal, Button } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'

const EndModal = ({ open, setOpen, restart }) => {
  const handleRestart = () => {
    setOpen(false)
    restart()
  }

  return (
    <Modal open={open}>
      <Modal.Header>
        <FormattedMessage id="congratulations-you-have-solved-this-crossword" />
      </Modal.Header>
      <Modal.Content>
        <Button onClick={handleRestart}>
          <FormattedMessage id="new-crossword" />
        </Button>
        <Link to="/library">
          <Button>
            <FormattedMessage id="back-to-library" />
          </Button>
        </Link>
      </Modal.Content>
    </Modal>
  )
}

export default EndModal
