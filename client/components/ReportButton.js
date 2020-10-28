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
        Report
      </button>
      <Modal
        dimmer="inverted"
        size="small"
        open={modalOpen}
        onOpen={() => setModalOpen(true)}
        onClose={() => setModalOpen(false)}
      >
        <Modal.Header>Report a problem</Modal.Header>
        <Modal.Content>
          <p className="additional-info">
          Thank you for reporting a problem &mdash; we will review it as soon as possible!
          </p>
          <Form>
            <TextArea
              value={optionalMessage}
              onChange={(e, data) => setOptionalMessage(data.value)}
              placeholder="The REVITA Team will see this page, where you encountered the problem.  If you would like to tell us more about what went wrong, please do so here."
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
