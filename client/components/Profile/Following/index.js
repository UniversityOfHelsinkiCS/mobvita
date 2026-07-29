import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import AppButton from 'Components/AppButton'
import { unfollowUser, unblockUser } from 'Utilities/redux/userReducer'
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material'
import InfoOutlined from '@mui/icons-material/InfoOutlined'
import CloseIcon from '@mui/icons-material/Close'
import CustomTooltip from 'Components/CustomTooltip'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import { sanitizeHtml } from 'Utilities/common'
import FollowUserModal from './FollowUserModal'
import BlockUserModal from './BlockUserModal'

const Following = () => {
  const { friends: followedUsers, blocked } = useSelector(({ user }) => user.data.user)

  const dispatch = useDispatch()
  const intl = useIntl()

  const [showFollowUserModal, setShowFollowUserModal] = useState(false)
  const [showBlockUserModal, setShowBlockUserModal] = useState(false)

  const [userToUnfollow, setUserToUnfollow] = useState(false)
  const [userToUnblock, setUserToUnblock] = useState(false)

  const remove = () => dispatch(unfollowUser(userToUnfollow.uid))
  const unblock = () => dispatch(unblockUser(userToUnblock.uid))

  const getWarningText = action => {
    if (action === 'remove') {
      return intl.formatMessage(
        { id: 'user-unfollow-confirmation' },
        { user: userToUnfollow?.username }
      )
    }
    return intl.formatMessage(
      { id: 'user-unblock-confirmation' },
      { user: userToUnblock?.username }
    )
  }

  return (
    <div className="cont ps-nm">
      <FollowUserModal showModal={showFollowUserModal} setShowModal={setShowFollowUserModal} />
      <ConfirmationWarning open={!!userToUnfollow} setOpen={setUserToUnfollow} action={remove}>
        <span dangerouslySetInnerHTML={sanitizeHtml(getWarningText('remove'))} />
      </ConfirmationWarning>

      <BlockUserModal showModal={showBlockUserModal} setShowModal={setShowBlockUserModal} />
      <ConfirmationWarning open={!!userToUnblock} setOpen={setUserToUnblock} action={unblock}>
        <span dangerouslySetInnerHTML={sanitizeHtml(getWarningText('unblock'))} />
      </ConfirmationWarning>

      <div style={{ margin: '2em 0em' }}>
        <div className="header-2" style={{ marginBottom: '1em' }}>
          <CustomTooltip
            title={<FormattedMessage id="following-users-information" />}
            placement="top"
            permanent
          >
            <span style={{ display: 'inline-flex' }}>
              <InfoOutlined fontSize="small" sx={{ color: 'grey' }} />
            </span>
          </CustomTooltip>
          <FormattedMessage id="followed-users" />{' '}
        </div>

        {followedUsers.length > 0 ? (
          <Table size="small" data-cy="followed-table">
            <TableHead>
              <TableRow key="followed-header-row">
                <TableCell>
                  <div className="space-between">
                    <div>
                      <FormattedMessage id="username" />
                    </div>
                    <div>
                      <FormattedMessage id="actions" />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {followedUsers.map(followed => (
                <TableRow key={`${followed.usename}`}>
                  <TableCell>
                    <div className="space-between">
                      <div>
                        {followed.username} ({followed.email})
                      </div>
                      <CloseIcon
                        sx={{ cursor: 'pointer', color: 'red' }}
                        onClick={() => setUserToUnfollow(followed)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <span className="additional-info">
            <FormattedMessage id="no-followed-users" />
          </span>
        )}
      </div>

      <AppButton data-cy="follow-user-button" onClick={() => setShowFollowUserModal(true)}>
        <FormattedMessage id="follow-a-user" />
      </AppButton>
      <hr />

      <div style={{ margin: '2em 0em' }}>
        <div className="header-2" style={{ marginBottom: '1em' }}>
          <CustomTooltip
            title={<FormattedMessage id="blocking-users-information" />}
            placement="top"
            permanent
          >
            <span style={{ display: 'inline-flex' }}>
              <InfoOutlined fontSize="small" sx={{ color: 'grey' }} />
            </span>
          </CustomTooltip>
          <FormattedMessage id="blocked-users" />{' '}
        </div>

        {blocked.length > 0 ? (
          <Table size="small" data-cy="blocked-table">
            <TableHead>
              <TableRow key="blocked-header-row">
                <TableCell>
                  <div className="space-between">
                    <div>
                      <FormattedMessage id="username" />
                    </div>
                    <div>
                      <FormattedMessage id="actions" />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blocked.map(user => (
                <TableRow key={`${user.username}`}>
                  <TableCell>
                    <div className="space-between">
                      <div data-cy={user.email}>
                        {user.username} ({user.email})
                      </div>
                      <CloseIcon
                        sx={{ cursor: 'pointer', color: 'red' }}
                        onClick={() => setUserToUnblock(user)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <span className="additional-info">
            <FormattedMessage id="no-blocked-users" />
          </span>
        )}
      </div>
      <AppButton data-cy="block-user-button" onClick={() => setShowBlockUserModal(true)}>
        <FormattedMessage id="block-a-user" />
      </AppButton>
    </div>
  )
}

export default Following
