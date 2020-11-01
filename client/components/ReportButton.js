import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import * as Sentry from '@sentry/react'
import { Icon, Modal, Button, Form, TextArea } from 'semantic-ui-react'
import { setNotification } from 'Utilities/redux/notificationReducer'

const ReportButton = () => {
  const dispatch = useDispatch()

  const [modalOpen, setModalOpen] = useState(false)
  const [optionalMessage, setOptionalMessage] = useState('')

  const handleConfirmation = () => {
    setModalOpen(false)
    Sentry.captureMessage(optionalMessage || 'User report', 'info')
    setOptionalMessage('')
    dispatch(setNotification('Report sent', 'success'))
  }

  return (
    <div>
      <button type="button" onClick={() => setModalOpen(true)} className="report-button">
        <Icon name="flag outline" />
        <FormattedMessage id="report-button" />
      </button>
      <Modal
        dimmer="inverted"
        size="small"
        open={modalOpen}
        onOpen={() => setModalOpen(true)}
        onClose={() => setModalOpen(false)}
      >
        <Modal.Header><FormattedMessage id="report-problem" /></Modal.Header>
        <Modal.Content>
          <p className="additional-info">
          <FormattedMessage id="thank-you-for-reporting-problem" />
          </p>
          <Form>
            <TextArea
              value={optionalMessage}
              onChange={(e, data) => setOptionalMessage(data.value)}
              placeholder="REVITA Team will see this page where you encountered the problem.  If you want to tell us more, please write here what went wrong..."
              style={{ marginTop: '1rem' }}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setModalOpen(false)}>
            <FormattedMessage id="Cancel" />
          </Button>
          <Button onClick={handleConfirmation} primary>
            <FormattedMessage id="Send" />
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  )
}

export default ReportButton
