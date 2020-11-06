import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import * as Sentry from '@sentry/react'
import { Icon, Modal, Button, Form, TextArea } from 'semantic-ui-react'
import { setNotification } from 'Utilities/redux/notificationReducer'

const ReportButton = () => {
  const dispatch = useDispatch()
  const intl = useIntl()

  const [modalOpen, setModalOpen] = useState(false)
  const [optionalMessage, setOptionalMessage] = useState('')
  const [sendingDisabled, setSendingDisabled] = useState(false)

  let timeout = null

  useEffect(() => {
    return () => clearTimeout(timeout)
  }, [])

  const handleConfirmation = () => {
    setModalOpen(false)
    Sentry.captureMessage(optionalMessage || 'User report', 'info')
    setOptionalMessage('')
    dispatch(setNotification('report-sent', 'success'))
    setSendingDisabled(true)
    timeout = setTimeout(() => setSendingDisabled(false), 10000)
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
        <Modal.Header>
          <FormattedMessage id="report-problem" />
        </Modal.Header>
        <Modal.Content>
          <p className="additional-info">
            <FormattedMessage id="thank-you-for-reporting-problem" />
          </p>
          <Form>
            <TextArea
              value={optionalMessage}
              onChange={(e, data) => setOptionalMessage(data.value)}
              placeholder={intl.formatMessage({ id: 'enter-more-about-problem' })}
              style={{ marginTop: '1rem' }}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button negative onClick={() => setModalOpen(false)}>
            <FormattedMessage id="Cancel" />
          </Button>
          <Button onClick={handleConfirmation} primary disabled={sendingDisabled}>
            <FormattedMessage id="Send" />
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  )
}

export default ReportButton
