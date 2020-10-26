import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import * as Sentry from '@sentry/react'
import { Icon, Modal, Button } from 'semantic-ui-react'
import { setNotification } from 'Utilities/redux/notificationReducer'

const ReportButton = () => {
  const dispatch = useDispatch()

  const [modalOpen, setModalOpen] = useState(false)

  const evokeError = () => Sentry.captureMessage('User report')

  const handleConfirmation = () => {
    setModalOpen(false)
    dispatch(setNotification('Report sent', 'success'))
    evokeError()
  }

  return (
    <div>
      <button type="button" onClick={() => setModalOpen(true)} className="report-button">
        <Icon name="flag outline" />
        Report
      </button>
      <Modal
        dimmer="inverted"
        size="small"
        open={modalOpen}
        onOpen={() => setModalOpen(true)}
        onClose={() => setModalOpen(false)}
      >
        <Modal.Header>Report error</Modal.Header>
        <Modal.Content>
          This will send the current state of the application to be reviewed for errors.
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setModalOpen(false)}>
            <FormattedMessage id="Cancel" />
          </Button>
          <Button onClick={handleConfirmation} data-cy="confirm-warning-dialog">
            <FormattedMessage id="Confirm" />
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  )
}

export default ReportButton
