import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import AppTextField from 'Components/ui/AppTextField'
import { blockUser } from 'Utilities/redux/userReducer'
import { formatEmailList } from 'Utilities/common'

const BlockUserModal = ({ showModal, setShowModal }) => {
  const dispatch = useDispatch()
  const ownEmail = useSelector(({ user }) => user.data.user.email)
  const [userToBlock, setuserToBlock] = useState('')
  const [showSelfAddWarning, setShowSelfAddWarning] = useState(false)

  const block = event => {
    event.preventDefault()

    if (formatEmailList(userToBlock).includes(ownEmail)) {
      setShowSelfAddWarning(true)
    } else {
      setShowSelfAddWarning(false)
      dispatch(blockUser(formatEmailList(userToBlock)))
      setuserToBlock('')
      setShowModal(false)
    }
  }

  return (
    <AppDialog
      open={showModal}
      onClose={() => setShowModal(false)}
      title={<FormattedMessage id="block-a-user" />}
    >
      <form className="group-form" onSubmit={block}>
        <span className="sm-label">
          <FormattedMessage id="enter-email-address" />{' '}
          <FormattedMessage id="multiple-emails-separated-by-space" />
        </span>
        <AppTextField
          multiline
          value={userToBlock}
          onChange={e => setuserToBlock(e.target.value)}
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

export default BlockUserModal
