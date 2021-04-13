import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Card, Icon, Label } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { updateGroupSelect } from 'Utilities/redux/userReducer'
import {
  deleteGroup,
  getGroupToken,
  leaveFromGroup,
  setGroupTestDeadline,
} from 'Utilities/redux/groupsReducer'

import { setNotification } from 'Utilities/redux/notificationReducer'
import Spinner from 'Components/Spinner'
import Subheader from 'Components/Subheader'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import { time } from 'highcharts'
import AddToGroup from './AddToGroup'
import NoGroupsView from './NoGroupsView'

const GroupInviteInfo = ({ group }) => {
  const anyPeopleAdded = !!group.addedPeople.length
  const anyPendingInvitations = !!group.pendingInvitations.length
  const anyFailedInvitations = !!group.failedInvitations.length

  return (
    <Card.Content extra>
      {anyPeopleAdded && (
        <div className="padding-bottom-2">
          <Subheader translationId="added-to-the-group" color="#2CB22C" iconName="checkmark" />
          {group.addedPeople.map(email => (
            <Label key={email} content={email} style={{ marginBottom: '.5rem' }} />
          ))}
        </div>
      )}
      {anyPendingInvitations && (
        <div className="padding-bottom-2">
          <Subheader translationId="invitation-email-sent-to" color="#84C3A3" iconName="mail" />
          {group.pendingInvitations.map(email => (
            <Label key={email} content={email} style={{ marginBottom: '.5rem' }} />
          ))}
        </div>
      )}
      {anyFailedInvitations && (
        <div>
          <Subheader translationId="invitation-failed-for" color="#dc3545" iconName="ban" />
          {group.failedInvitations.map(email => (
            <Label key={email} content={email} style={{ marginBottom: '.5rem' }} />
          ))}
          <span style={{ display: 'block', fontSize: '12px', paddingLeft: '.5rem' }}>
            <FormattedMessage id="invitation-failure-explanation" />
          </span>
        </div>
      )}
    </Card.Content>
  )
}

const GroupCard = ({
  group,
  setAddToGroupId,
  setDeleteGroupId,
  setLeaveGroupId,
  showTokenGroupId,
  setShowTokenGroupId,
  showTestEnableMenuGroupId,
  setShowTestEnableMenuGroupId,
}) => {
  const { groupName, group_id: id, is_teaching: isTeaching, test_deadline: testDeadline } = group

  const [currTestDeadline, setCurrTestDeadline] = useState(testDeadline)
  const showTestEnableMenu = showTestEnableMenuGroupId === id

  const showToken = showTokenGroupId === id
  const token = useSelector(state => state.groups.token)
  const dispatch = useDispatch()
  const history = useHistory()

  const testEnabled = currTestDeadline - Date.now() > 0
  const testButtonVariant = testEnabled ? 'danger' : 'primary'

  const deadlineObject = new Date(currTestDeadline)
  const timezone = deadlineObject.toString().split(' ')[5]
  const deadlineHumanFormat = `${deadlineObject.toLocaleString()} (${timezone})`

  const testButtonText = testEnabled ? (
    <FormattedMessage id="disable-test" />
  ) : (
    <FormattedMessage id="enable-test" />
  )

  const handleGroupNameClick = () => {
    dispatch(updateGroupSelect(id))
    const role = isTeaching ? 'teacher' : 'student'
    history.push(`/groups/${role}/analytics`)
  }

  const handleSettingsClick = () => {
    const role = isTeaching ? 'teacher' : 'student'
    history.push(`/groups/${role}/${id}/concepts`)
  }

  const handleTestDisable = () => {
    const currentDateMs = Date.now()
    dispatch(setGroupTestDeadline(currentDateMs, id))
    setCurrTestDeadline(currentDateMs)
    setShowTestEnableMenuGroupId(null)
  }

  const handleTestEnableDisableButtonClick = () => {
    if (testEnabled) {
      handleTestDisable()
    } else {
      setShowTokenGroupId(null)
      if (showTestEnableMenuGroupId) {
        setShowTestEnableMenuGroupId(null)
      } else {
        setShowTestEnableMenuGroupId(id)
      }
    }
  }

  const handleShowTokenClick = () => {
    setShowTestEnableMenuGroupId(null)
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

  const handleTestEnableOneHour = () => {
    const testDeadlineMs = Date.now() + 3600000 // 1 hour

    dispatch(setGroupTestDeadline(testDeadlineMs, id))
    setCurrTestDeadline(testDeadlineMs)
    setShowTestEnableMenuGroupId(null)
  }

  const handleTestEnableTwoHours = () => {
    const testDeadlineMs = Date.now() + 7200000 // 2 hours

    dispatch(setGroupTestDeadline(testDeadlineMs, id))
    setCurrTestDeadline(testDeadlineMs)
    setShowTestEnableMenuGroupId(null)
  }

  const handleTestEnableThreeHours = () => {
    const testDeadlineMs = Date.now() + 10800000 // 3 hours

    dispatch(setGroupTestDeadline(testDeadlineMs, id))
    setCurrTestDeadline(testDeadlineMs)
    setShowTestEnableMenuGroupId(null)
  }

  const handleTestEnableOneDay = () => {
    const testDeadlineMs = Date.now() + 86400000 // 1 day

    dispatch(setGroupTestDeadline(testDeadlineMs, id))
    setCurrTestDeadline(testDeadlineMs)
    setShowTestEnableMenuGroupId(null)
  }

  const handleTestButtonCancel = () => {
    setShowTestEnableMenuGroupId(null)
  }

  return (
    <Card fluid>
      <Card.Content
        extra
        onClick={isTeaching ? handleGroupNameClick : () => {}}
        style={{ padding: '15px 15px 5px' }}
      >
        <div className="story-item-title space-between">
          <h5 style={{ fontWeight: 'bold' }}>{groupName}</h5>
          {testEnabled && (
            <div style={{ marginLeft: '0.5em' }}>
              <FormattedMessage id="test-deadline" /> {deadlineHumanFormat}
            </div>
          )}
          <Icon name="ellipsis vertical" style={{ marginLeft: '1rem' }} />
        </div>
      </Card.Content>
      <Card.Content extra>
        <div className="space-between group-buttons sm" style={{ whiteSpace: 'nowrap' }}>
          {isTeaching && (
            <div className="gap-col-sm wrap-and-grow group-management-buttons">
              <Button onClick={handleSettingsClick}>
                <Icon name="settings" /> <FormattedMessage id="learning-settings" />
              </Button>
              <Button data-cy="add-to-group-modal" onClick={() => setAddToGroupId(id)}>
                <Icon name="plus" /> <FormattedMessage id="add-people-to-group" />
              </Button>
              <Button onClick={handleShowTokenClick}>
                <Icon name="key" /> <FormattedMessage id="show-group-token" />
              </Button>
              <Button
                data-cy="enable-test-button"
                onClick={handleTestEnableDisableButtonClick}
                variant={testButtonVariant}
              >
                <Icon name="pencil alternate" /> {testButtonText}
              </Button>
            </div>
          )}
          <div className="group-management-buttons flex gap-col-sm">
            <Button variant="danger" onClick={() => setLeaveGroupId(id)} data-cy="leave-group">
              <Icon name="log out" /> <FormattedMessage id="Leave" />
            </Button>
            {isTeaching && (
              <Button
                data-cy="delete-group"
                variant="danger"
                onClick={() => setDeleteGroupId(id)}
                style={{ whiteSpace: 'nowrap' }}
              >
                <Icon name="trash alternate outline" /> <FormattedMessage id="Delete" />
              </Button>
            )}
          </div>
        </div>
        {showToken && (
          <div>
            <div
              className="border rounded"
              style={{
                display: 'flex',
                marginTop: '0.5em',
                minHeight: '3em',
                wordBreak: 'break-all',
              }}
            >
              <span style={{ margin: 'auto', padding: '0.5em' }}>{token}</span>
              <CopyToClipboard text={token}>
                <Button type="button" onClick={handleTokenCopy}>
                  <Icon name="copy" size="large" />
                </Button>
              </CopyToClipboard>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  margin: 'auto',
                  padding: '0.5em',
                  fontStyle: 'oblique',
                  fontWeight: 'bold',
                }}
              >
                <FormattedMessage id="This key is valid for the next 30 days" />.
              </span>
            </div>
          </div>
        )}

        {showTestEnableMenu && (
          <div>
            <div
              className="border rounded"
              style={{
                display: 'flex',
                marginTop: '0.5em',
                minHeight: '3em',
                wordBreak: 'break-all',
              }}
            >
              <span style={{ margin: 'auto', padding: '0.5em' }}>
                <Button
                  data-cy="enable-test-one-day"
                  type="button"
                  onClick={handleTestEnableOneHour}
                  variant="success"
                  style={{ margin: '0.2em' }}
                >
                  <FormattedMessage id="enable-test-one-hour" />
                </Button>
                <Button
                  data-cy="enable-test-one-day"
                  type="button"
                  onClick={handleTestEnableTwoHours}
                  variant="success"
                  style={{ margin: '0.2em' }}
                >
                  <FormattedMessage id="enable-test-two-hours" />
                </Button>
                <Button
                  data-cy="enable-test-one-day"
                  type="button"
                  onClick={handleTestEnableThreeHours}
                  variant="success"
                  style={{ margin: '0.2em' }}
                >
                  <FormattedMessage id="enable-test-three-hours" />
                </Button>
                <Button
                  data-cy="enable-test-one-day"
                  type="button"
                  onClick={handleTestEnableOneDay}
                  variant="success"
                  style={{ margin: '0.2em' }}
                >
                  <FormattedMessage id="enable-test-one-day" />
                </Button>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    onClick={handleTestButtonCancel}
                    variant="danger"
                    style={{ margin: '0.2em' }}
                  >
                    <FormattedMessage id="Cancel" />
                  </Button>
                </div>
              </span>
            </div>
          </div>
        )}
      </Card.Content>
      {group.peopleInvited && <GroupInviteInfo group={group} />}
    </Card>
  )
}

const GroupManagement = ({ role }) => {
  const { groups: totalGroups, pending } = useSelector(({ groups }) => groups)
  const groups = totalGroups.filter(group => group.is_teaching === (role === 'teacher'))
  const userId = useSelector(state => state.user.data.user.oid)

  const [addToGroupId, setAddToGroupId] = useState(null)
  const [deleteGroupId, setDeleteGroupId] = useState(false)
  const [leaveGroupId, setLeaveGroupId] = useState(false)
  const [showTokenGroupId, setShowTokenGroupId] = useState(null)

  const [showTestEnableMenuGroupId, setShowTestEnableMenuGroupId] = useState(null)
  //

  const dispatch = useDispatch()

  const handleGroupDelete = () => {
    dispatch(deleteGroup(deleteGroupId))
  }

  const handleGroupLeave = () => {
    dispatch(leaveFromGroup(leaveGroupId, userId))
  }

  if (pending) return <Spinner fullHeight />

  if (groups.length === 0) return <NoGroupsView role={role} />

  return (
    <div className="ps-nm" data-cy="group-list">
      <AddToGroup groupId={addToGroupId} setGroupId={setAddToGroupId} />
      <ConfirmationWarning
        open={!!deleteGroupId}
        setOpen={setDeleteGroupId}
        action={handleGroupDelete}
      >
        <FormattedMessage id="this-will-remove-the-group-are-you-sure-you-want-to-proceed" />
      </ConfirmationWarning>
      <ConfirmationWarning
        open={!!leaveGroupId}
        setOpen={setLeaveGroupId}
        action={handleGroupLeave}
      >
        <FormattedMessage id="Are you sure you want to leave the group?" />
      </ConfirmationWarning>
      {groups.map(group => (
        <GroupCard
          key={group.group_id}
          group={group}
          setAddToGroupId={setAddToGroupId}
          setDeleteGroupId={setDeleteGroupId}
          setLeaveGroupId={setLeaveGroupId}
          showTokenGroupId={showTokenGroupId}
          setShowTokenGroupId={setShowTokenGroupId}
          showTestEnableMenuGroupId={showTestEnableMenuGroupId}
          setShowTestEnableMenuGroupId={setShowTestEnableMenuGroupId}
        />
      ))}
    </div>
  )
}

export default GroupManagement
