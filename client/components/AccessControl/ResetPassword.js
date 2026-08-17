import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import AppButton from 'Components/AppButton'
import AppTextField from 'Components/ui/AppTextField'
import { Box } from '@mui/material'
import { resetPassword } from 'Utilities/redux/passwordResetReducer'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')
  const [error, setError] = useState(false)

  const dispatch = useDispatch()
  const intl = useIntl()
  const navigate = useNavigate()
  const { token } = useParams()

  const handleSubmit = e => {
    e.preventDefault()
    if (password !== repeat) {
      setError(true)
      return
    }

    dispatch(resetPassword(password, token))
    navigate('/home', { replace: true })
  }

  return (
    <div className="cont-narrow auto pt-xl">
      <form onSubmit={handleSubmit} data-cy="reset-password-form">
        <Box sx={{ mt: '0.5em', mb: '1.5em' }}>
          <AppTextField
            label={intl.formatMessage({ id: 'new-password' })}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={error}
            inputProps={{ 'data-cy': 'reset-password-new-password-input' }}
          />
        </Box>
        <Box sx={{ mt: '0.5em', mb: '1.5em' }}>
          <AppTextField
            label={intl.formatMessage({ id: 'repeat-password' })}
            type="password"
            value={repeat}
            onChange={e => setRepeat(e.target.value)}
            error={error}
            inputProps={{ 'data-cy': 'reset-password-repeat-password-input' }}
          />
        </Box>
        <Box sx={{ mt: '0.5em', mb: '1.5em' }}>
          <AppButton variant="primary" type="submit" data-cy="reset-password-submit-button">
            <FormattedMessage id="Confirm-Password" />
          </AppButton>
        </Box>
      </form>
    </div>
  )
}

export default ResetPassword
