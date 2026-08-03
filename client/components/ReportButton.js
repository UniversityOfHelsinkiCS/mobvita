import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import * as Sentry from '@sentry/react'
import { TextField } from '@mui/material'
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import { setNotification } from 'Utilities/redux/notificationReducer'

const ReportButton = ({ extraClass }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const maxCharacters = 1000

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
      fingerprint: ['Level: info', `Timestamp: ${eventTimeStamp}`],
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
          <FlagOutlinedIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} />
          <FormattedMessage id="report-button" />
        </span>
      </button>
      <AppDialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={<FormattedMessage id="report-problem" />}
      >
        <p className="additional-info">
          <FormattedMessage id="thank-you-for-reporting-problem" />
        </p>
        <TextField
          fullWidth
          multiline
          minRows={3}
          value={optionalMessage}
          onChange={handleTextChange}
          placeholder={intl.formatMessage({ id: 'enter-more-about-problem' })}
          slotProps={{ htmlInput: { maxLength: maxCharacters } }}
          sx={{ mt: 2 }}
        />
        <div style={{ margin: '1rem 0' }}>
          <FormattedMessage id="characters-left" />
          {` ${charactersLeft}`}
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <AppButton variant="outline" onClick={() => setModalOpen(false)}>
            <FormattedMessage id="Cancel" />
          </AppButton>
          <AppButton onClick={handleConfirmation} disabled={sendingDisabled}>
            <FormattedMessage id="Send" />
          </AppButton>
        </div>
      </AppDialog>
    </>
  )
}

export default ReportButton
