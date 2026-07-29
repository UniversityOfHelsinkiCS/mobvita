import React, { useState, useEffect } from 'react'
import { useIntl, FormattedMessage } from 'react-intl'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import AppTextField from 'Components/ui/AppTextField'
import { logout, deleteUser } from 'Utilities/redux/userReducer'
import { useDispatch, useSelector } from 'react-redux'

const DeleteAccount = () => {
  const intl = useIntl()
  const [open, setOpen] = useState(false)
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const dispatch = useDispatch()
  const { deleteSuccessful } = useSelector(({ user }) => user)

  useEffect(() => {
    if (deleteSuccessful) {
      dispatch(logout())
    }
  }, [deleteSuccessful])

  const handleAccept = () => {
    dispatch(deleteUser(passwordConfirmation))
  }

  const handleReject = () => {
    setOpen(false)
  }

  return (
    <div>
      <h2 className="header-2 pb-sm">{intl.formatMessage({ id: 'delete-account' })}</h2>
      <AppButton variant="danger" onClick={() => setOpen(true)}>
        <FormattedMessage id="delete-account" />
      </AppButton>
      <AppDialog
        open={open}
        onClose={() => setOpen(false)}
        title={<FormattedMessage id="delete-account-confirmation" />}
      >
        <div className="mb-nm">
          <FormattedMessage id="delete-account-information" />
        </div>
        <AppTextField
          value={passwordConfirmation}
          type="password"
          onChange={e => setPasswordConfirmation(e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <AppButton variant="outline" onClick={() => handleReject()}>
            <FormattedMessage id="Cancel" />
          </AppButton>
          <AppButton
            variant="danger"
            onClick={() => handleAccept()}
            data-cy="confirm-warning-dialog"
          >
            <FormattedMessage id="Confirm" />
          </AppButton>
        </div>
      </AppDialog>
    </div>
  )
}

export default DeleteAccount
