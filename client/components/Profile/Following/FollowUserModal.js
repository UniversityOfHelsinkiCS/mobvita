import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import AppTextField from 'Components/ui/AppTextField'
import { followUser } from 'Utilities/redux/userReducer'
import { formatEmailList } from 'Utilities/common'

const FollowUserModal = ({ showModal, setShowModal }) => {
  const dispatch = useDispatch()
  const ownEmail = useSelector(({ user }) => user.data.user.email)
  const [usersToFollow, setUsersToFollow] = useState('')
  const [showSelfAddWarning, setShowSelfAddWarning] = useState(false)

  const follow = event => {
    event.preventDefault()
    if (formatEmailList(usersToFollow).includes(ownEmail)) {
      setShowSelfAddWarning(true)
    } else {
      setShowSelfAddWarning(false)
      dispatch(followUser(formatEmailList(usersToFollow)))
      setUsersToFollow('')
      setShowModal(false)
    }
  }

  return (
    <AppDialog
      open={showModal}
      onClose={() => setShowModal(false)}
      title={<FormattedMessage id="follow-a-user" />}
    >
      <form className="group-form" onSubmit={follow}>
        <span className="sm-label">
          <FormattedMessage id="enter-email-address" />{' '}
          <FormattedMessage id="multiple-emails-separated-by-space" />
        </span>
        <AppTextField
          multiline
          value={usersToFollow}
          onChange={e => setUsersToFollow(e.target.value)}
        />
        {showSelfAddWarning && (
          <div style={{ color: 'red', marginBottom: '1em' }}>
            <FormattedMessage id="you-cannot-add-yourself" />
          </div>
        )}
        <AppButton variant="primary" type="submit">
          <FormattedMessage id="Confirm" />
        </AppButton>
      </form>
    </AppDialog>
  )
}

export default FollowUserModal
