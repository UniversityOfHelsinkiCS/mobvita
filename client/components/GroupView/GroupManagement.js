import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Card, Icon } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { updateGroupSelect } from 'Utilities/redux/userReducer'
import { deleteGroup, getGroupToken } from 'Utilities/redux/groupsReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'
import Spinner from 'Components/Spinner'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import AddToGroup from './AddToGroup'

const GroupCard = ({
  group,
  setAddToGroupId,
  setDeleteGroupId,
  showTokenGroupId,
  setShowTokenGroupId,
}) => {
  const { groupName, group_id: id, is_teaching: isTeaching } = group

  const showToken = showTokenGroupId === id

  const token = useSelector(state => state.groups.token)

  const dispatch = useDispatch()
  const history = useHistory()

  const handleGroupNameClick = () => {
    dispatch(updateGroupSelect(id))
    history.push('/groups/analytics')
  }

  const handleSettingsClick = () => {
    history.push(`/groups/${id}/concepts`)
  }

  const handleShowTokenClick = () => {
    if (showToken) {
      setShowTokenGroupId(null)
    } else {
      dispatch(getGroupToken(id))
      setShowTokenGroupId(id)
    }
  }

  const handleTokenCopy = () => {
    dispatch(setNotification('token-copied', 'info'))
  }

  return (
    <Card fluid>
      <Card.Content
        extra
        onClick={isTeaching ? handleGroupNameClick : () => {}}
        style={{ cursor: 'pointer' }}
      >
        <h5 style={{ fontWeight: 'bold' }}>{groupName}</h5>
      </Card.Content>
      {isTeaching && (
        <Card.Content extra>
          <div className="space-between">
            <div className="gap-1">
              <Button onClick={handleSettingsClick}>
                <Icon name="settings" /> <FormattedMessage id="learning-settings" />
              </Button>
              <Button data-cy="add-to-group-modal" onClick={() => setAddToGroupId(id)}>
                <Icon name="plus" /> <FormattedMessage id="add-people-to-group" />
              </Button>
              <Button onClick={handleShowTokenClick}>
                <Icon name="key" /> <FormattedMessage id="show-group-token" />
              </Button>
            </div>
            <Button data-cy="delete-group" variant="danger" onClick={() => setDeleteGroupId(id)}>
              <Icon name="trash alternate outline" /> <FormattedMessage id="delete-group" />
            </Button>
          </div>
          {showToken && (
            <div
              className="border rounded"
              style={{ display: 'flex', marginTop: '0.5em', minHeight: '3em' }}
            >
              <span style={{ margin: 'auto' }}>{token}</span>
              <CopyToClipboard text={token}>
                <Button type="button" onClick={handleTokenCopy}>
                  <Icon name="copy" size="large" />
                </Button>
              </CopyToClipboard>
            </div>
          )}
        </Card.Content>
      )}
    </Card>
  )
}

const GroupManagement = () => {
  const { groups, pending } = useSelector(state => state.groups)

  const [addToGroupId, setAddToGroupId] = useState(null)
  const [deleteGroupId, setDeleteGroupId] = useState(false)
  const [showTokenGroupId, setShowTokenGroupId] = useState(null)

  const dispatch = useDispatch()
  const history = useHistory()

  const handleGroupDelete = () => {
    dispatch(deleteGroup(deleteGroupId))
  }

  if (pending) return <Spinner />

  if (groups.length === 0) {
    return (
      <div className="group-container nogroups">
        <h2 id="title">
          {' '}
          <FormattedMessage id="Groups" />
        </h2>
        <Button id="join-group-button" variant="info" onClick={() => history.push('/groups/join')}>
          <FormattedMessage id="join-group" />
        </Button>
        <span className="additional-info">
          <FormattedMessage id="join-group-message" />
        </span>

        <br />
        <Button
          data-cy="create-group"
          variant="primary"
          onClick={() => history.push('/groups/create')}
        >
          <FormattedMessage id="create-new-group" />
        </Button>
        <span className="additional-info">
          <FormattedMessage id="create-group-message" />
        </span>
      </div>
    )
  }

  return (
    <div className="padding-sides-2">
      <AddToGroup groupId={addToGroupId} setGroupId={setAddToGroupId} />
      <ConfirmationWarning
        open={!!deleteGroupId}
        setOpen={setDeleteGroupId}
        action={handleGroupDelete}
      >
        <FormattedMessage id="this-will-remove-the-group-are-you-sure-you-want-to-proceed" />
      </ConfirmationWarning>
      {groups.map(group => (
        <GroupCard
          key={group.group_id}
          group={group}
          setAddToGroupId={setAddToGroupId}
          setDeleteGroupId={setDeleteGroupId}
          showTokenGroupId={showTokenGroupId}
          setShowTokenGroupId={setShowTokenGroupId}
        />
      ))}
    </div>
  )
}

export default GroupManagement
