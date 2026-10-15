import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import * as Sentry from '@sentry/react'
import { sendEmail } from 'Utilities/redux/emailReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'
import { useIsRegistered } from 'Utilities/common'
import AppDialog from 'Components/ui/AppDialog'
import ContactForm from './ContactForm'
import FeedbackForm from './FeedbackForm'

// Design "Feedback & Suggestions": a 750px card with 20px padding, an H3 title and the X 20px in.
const FEEDBACK_DIALOG_SX = {
  paperSx: { width: 750, maxWidth: 'calc(100% - 32px)', m: 2 },
  titleSx: { p: '20px', pr: 7, pb: '30px', fontSize: 26, fontWeight: 500, lineHeight: '28px' },
  contentSx: { px: '20px', pb: '20px' },
  closeSx: { right: 12, top: 12 },
}

// Contact modal, opened by a cloned `trigger` or `open`/`setOpen`: registered users get the
// contact / bug / suggestion form, visitors without an account keep the name + email form.
export default function ContactUs({ trigger, open: controlledOpen, setOpen: setControlledOpen }) {
  const dispatch = useDispatch()

  const error = useSelector(({ email }) => email.errorMessage)
  const session = useSelector(({ user }) => user)
  const user = session.data ? session.data.user : null
  const isRegistered = useIsRegistered()

  const [internalOpen, setInternalOpen] = useState(false)
  const controlled = typeof controlledOpen === 'boolean' && typeof setControlledOpen === 'function'
  const open = controlled ? controlledOpen : internalOpen
  const setOpen = controlled ? setControlledOpen : setInternalOpen

  const initialFormState = {
    name: user ? user.username : '',
    email: user ? user.email : '',
    subject: 'Revita',
    message: '',
  }
  const [formState, setFormState] = useState(initialFormState)
  const [topic, setTopic] = useState(null)
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [bugSendLocked, setBugSendLocked] = useState(false)
  const bugLockTimeout = useRef(null)

  useEffect(() => () => clearTimeout(bugLockTimeout.current), [])

  const handleFieldChange = (name, value) => {
    setFormState(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    setOpen(false)
    dispatch(sendEmail(formState))
    setFormState(initialFormState)
  }

  // A bug becomes its own Sentry issue (timestamp fingerprint) and locks bug sending for 10 s;
  // the rest are emailed.
  const handleFeedbackSubmit = () => {
    setOpen(false)
    if (topic === 'bug') {
      const timestamp = new Date().toLocaleString('en-GB')
      Sentry.captureMessage(feedbackMessage, {
        level: 'info',
        fingerprint: ['Level: info', `Timestamp: ${timestamp}`],
      })
      dispatch(setNotification('report-sent', 'success'))
      setBugSendLocked(true)
      bugLockTimeout.current = setTimeout(() => setBugSendLocked(false), 10000)
    } else {
      dispatch(
        sendEmail({
          name: user.username,
          email: user.email,
          subject: `Revita: ${topic}`,
          message: feedbackMessage,
        }),
      )
    }
    setTopic(null)
    setFeedbackMessage('')
  }

  return (
    <>
      {trigger && React.cloneElement(trigger, { onClick: () => setOpen(true) })}
      {isRegistered ? (
        <AppDialog
          open={open}
          onClose={() => setOpen(false)}
          title={<FormattedMessage id="contact-us" />}
          {...FEEDBACK_DIALOG_SX}
        >
          <FeedbackForm
            topic={topic}
            message={feedbackMessage}
            onTopicChange={setTopic}
            onMessageChange={setFeedbackMessage}
            onSubmit={handleFeedbackSubmit}
            sendDisabled={topic === 'bug' && bugSendLocked}
          />
        </AppDialog>
      ) : (
        <AppDialog open={open} onClose={() => setOpen(false)} title="Contact us">
          <ContactForm
            name={formState.name}
            email={formState.email}
            subject={formState.subject}
            message={formState.message}
            onFieldChange={handleFieldChange}
            onSubmit={handleSubmit}
            error={error}
          />
        </AppDialog>
      )}
    </>
  )
}
