import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button } from 'react-bootstrap'
import { unfollowUser, unblockUser } from 'Utilities/redux/userReducer'
import { Icon, Table } from 'semantic-ui-react'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import { sanitizeHtml } from 'Utilities/common'
import FollowUserModal from './FollowUserModal'
import BlockUserModal from './BlockUserModal'

const People = () => {
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
          <FormattedMessage id="followed-users" />
        </div>

        {followedUsers.length > 0 ? (
          <Table size="small">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell key="followed-list-header">
                  <div className="space-between">
                    <FormattedMessage id="username" />
                    <span>
                      <FormattedMessage id="actions" />
                    </span>
                  </div>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {followedUsers.map(followed => (
                <Table.Row>
                  <Table.Cell key={followed.uid}>
                    {followed.username} ({followed.email})
                    <Icon
                      style={{ cursor: 'pointer' }}
                      name="close"
                      color="red"
                      onClick={() => setUserToUnfollow(followed)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <span className="additional-info">
            <FormattedMessage id="no-followed-users" />
          </span>
        )}
      </div>

      <Button onClick={() => setShowFollowUserModal(true)}>
        <FormattedMessage id="follow-a-user" />
      </Button>
      <hr />

      <div style={{ margin: '2em 0em' }}>
        <div className="header-2" style={{ marginBottom: '1em' }}>
          <FormattedMessage id="blocked-users" />
        </div>

        {blocked.length > 0 ? (
          <Table size="small">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell key="blocked-list-header">
                  <div className="space-between">
                    <FormattedMessage id="username" />
                    <span>
                      <FormattedMessage id="actions" />
                    </span>
                  </div>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {blocked.map(user => (
                <Table.Row>
                  <Table.Cell key={user.uid}>
                    {user.username} ({user.email})
                    <Icon
                      style={{ cursor: 'pointer' }}
                      name="close"
                      color="red"
                      onClick={() => setUserToUnblock(user)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <span className="additional-info">
            <FormattedMessage id="no-blocked-users" />
          </span>
        )}
      </div>
      <Button onClick={() => setShowBlockUserModal(true)}>
        <FormattedMessage id="block-a-user" />
      </Button>
    </div>
  )
}

export default People
