import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import * as Sentry from '@sentry/react'
import { Icon, Modal, Button, Form, TextArea } from 'semantic-ui-react'
import { setNotification } from 'Utilities/redux/notificationReducer'

const ReportButton = ({ extraClass }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const maxCharacters = 500

  const [modalOpen, setModalOpen] = useState(false)
  const [optionalMessage, setOptionalMessage] = useState('')
  const [sendingDisabled, setSendingDisabled] = useState(false)
  const [charactersLeft, setCharactersLeft] = useState(maxCharacters)

  let timeout = null

  useEffect(() => {
    return () => clearTimeout(timeout)
  }, [])

  const sendSentryReport = () => {
    const eventTimeStamp = new Date().toLocaleString('en-GB')
    const eventTitle = optionalMessage || `User report ${eventTimeStamp}`
    const eventOptions = {
      severity: 'info',
      fingerprint: ['Level: info', `Timestamp: ${eventTimeStamp}`]
    }
    Sentry.captureMessage(eventTitle, eventOptions)
  }

  const handleConfirmation = () => {
    setModalOpen(false)
    setCharactersLeft(maxCharacters)
    sendSentryReport()
    setOptionalMessage('')
    dispatch(setNotification('report-sent', 'success'))
    setSendingDisabled(true)
    timeout = setTimeout(() => setSendingDisabled(false), 10000)
  }

  const handleTextChange = e => {
    setCharactersLeft(maxCharacters - e.target.value.length)
    setOptionalMessage(e.target.value)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className={`report-button ${extraClass}`}
      >
        <span>
          <Icon name="flag outline" />
          <FormattedMessage id="report-button" />
        </span>
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
              onChange={handleTextChange}
              placeholder={intl.formatMessage({ id: 'enter-more-about-problem' })}
              maxLength="500"
              style={{ marginTop: '1rem' }}
            />
          </Form>
        </Modal.Content>
        <div style={{ margin: '1rem' }}>
          <FormattedMessage id="characters-left" />
          {` ${charactersLeft}`}
        </div>
        <Modal.Actions>
          <Button negative onClick={() => setModalOpen(false)}>
            <FormattedMessage id="Cancel" />
          </Button>
          <Button onClick={handleConfirmation} primary disabled={sendingDisabled}>
            <FormattedMessage id="Send" />
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  )
}

export default ReportButton
