import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button } from 'react-bootstrap'
import { removeFriend, unblockUser } from 'Utilities/redux/userReducer'
import { Icon, Table } from 'semantic-ui-react'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import { sanitizeHtml } from 'Utilities/common'
import AddFriendsModal from './AddFriendsModal'
import BlockUserModal from './BlockUserModal'

const Friends = () => {
  const { friends, blocked } = useSelector(({ user }) => user.data.user)

  const dispatch = useDispatch()
  const intl = useIntl()

  const [showAddFriendsModal, setShowAddFriendsModal] = useState(false)
  const [showBlockUserModal, setShowBlockUserModal] = useState(false)

  const [friendToRemove, setFriendToRemove] = useState(false)
  const [userToUnblock, setUserToUnblock] = useState(false)

  const remove = () => dispatch(removeFriend(friendToRemove.uid))
  const unblock = () => dispatch(unblockUser(userToUnblock.uid))

  const getWarningText = action => {
    if (action === 'remove') {
      return intl.formatMessage(
        { id: 'friend-remove-confirmation' },
        { user: friendToRemove?.username }
      )
    }
    return intl.formatMessage(
      { id: 'user-unblock-confirmation' },
      { user: userToUnblock?.username }
    )
  }

  return (
    <div className="cont ps-nm">
      <AddFriendsModal showModal={showAddFriendsModal} setShowModal={setShowAddFriendsModal} />
      <ConfirmationWarning open={!!friendToRemove} setOpen={setFriendToRemove} action={remove}>
        <span dangerouslySetInnerHTML={sanitizeHtml(getWarningText('remove'))} />
      </ConfirmationWarning>

      <BlockUserModal showModal={showBlockUserModal} setShowModal={setShowBlockUserModal} />
      <ConfirmationWarning open={!!userToUnblock} setOpen={setUserToUnblock} action={unblock}>
        <span dangerouslySetInnerHTML={sanitizeHtml(getWarningText('unblock'))} />
      </ConfirmationWarning>

      <div style={{ margin: '2em 0em' }}>
        <div className="header-2" style={{ marginBottom: '1em' }}>
          <FormattedMessage id="friends" />
        </div>

        {friends.length > 0 ? (
          <Table size="small">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell key="friend-list-header">
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
              {friends.map(friend => (
                <Table.Row>
                  <Table.Cell key={friend.uid}>
                    {friend.username} ({friend.email})
                    <Icon
                      style={{ cursor: 'pointer' }}
                      name="close"
                      color="red"
                      onClick={() => setFriendToRemove(friend)}
                    />
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <span className="additional-info">
            <FormattedMessage id="no-friends" />
          </span>
        )}
      </div>

      <Button onClick={() => setShowAddFriendsModal(true)}>
        <FormattedMessage id="add-a-friend" />
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

export default Friends
