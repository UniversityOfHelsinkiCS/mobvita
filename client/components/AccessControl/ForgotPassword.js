import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { forgotPassword } from 'Utilities/redux/passwordResetReducer'
import AppDialog from 'Components/ui/AppDialog'
import ForgotPasswordForm from './ForgotPasswordForm'

/**
 * ForgotPassword — container for the reset-request dialog. Controlled via `isOpen` / `setOpen`.
 * Owns redux (forgotPassword) + email state; renders the pure <ForgotPasswordForm> in AppDialog.
 */
const ForgotPassword = ({ isOpen, setOpen }) => {
  const [email, setEmail] = useState('')
  const dispatch = useDispatch()

  const requestPassword = () => {
    dispatch(forgotPassword(email))
    setOpen(false)
  }

  return (
    <AppDialog
      open={isOpen}
      onClose={() => setOpen(false)}
      title={<FormattedMessage id="forgot-password" />}
    >
      <ForgotPasswordForm email={email} onEmailChange={setEmail} onSubmit={requestPassword} />
    </AppDialog>
  )
}

export default ForgotPassword
