import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Card, Icon, Label, Dropdown, Popup, Modal } from 'semantic-ui-react'
import { Button, Table } from 'react-bootstrap'

import { updateLibrarySelect, updateGroupSelect } from 'Utilities/redux/userReducer'

import {
  getGroups,
  deleteGroup,
  getGroupToken,
  leaveFromGroup,
  setGroupTestDeadline,
} from 'Utilities/redux/groupsReducer'

import { getTestQuestions } from 'Utilities/redux/testReducer'

import { setNotification } from 'Utilities/redux/notificationReducer'
import Spinner from 'Components/Spinner'
import Subheader from 'Components/Subheader'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import GroupActionModal from './GroupActionModal'
import AddToGroup from './AddToGroup'
import NoGroupsView from './NoGroupsView'
import Row from './Row'

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

const GroupInfoModal = ({
  trigger,
  id,
  title,
  description,
  creationDate,
  language,
  numOfStories,
  numOfStudents,
}) => {
  const intl = useIntl()
  return (
    <Modal
      dimmer="inverted"
      closeIcon={{ style: { top: '1.0535rem', right: '1rem' }, color: 'black', name: 'close' }}
      trigger={trigger}
    >
      <Modal.Header className="bold" as="h2">
        {title}
      </Modal.Header>
      <Modal.Content>
        <div className="italics" style={{ marginBottom: '1.5em' }}>
          {description}
          <br />
        </div>
        <Table striped width="100%" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col width="40%" />
            <col width="60%" />
          </colgroup>
          <tbody>
            <Row translationId="creation-date"> {creationDate}</Row>
            <Row translationId="language"> {intl.formatMessage({ id: language })}</Row>
            <Row translationId="students"> {numOfStudents}</Row>
            <Row
              translationId="shared-stories"
              id={id}
              updateLibrarySelect={updateLibrarySelect}
              updateGroupSelect={updateGroupSelect}
            >
              {' '}
              {numOfStories}
            </Row>
          </tbody>
        </Table>
      </Modal.Content>
    </Modal>
  )
}

const GroupCard = ({
  group,
  setDeleteGroupId,
  setLeaveGroupId,
  showTokenGroupId,
  setShowTokenGroupId,
  showTestEnableMenuGroupId,
  setShowTestEnableMenuGroupId,
}) => {
  const {
    groupName,
    group_id: id,
    is_teaching: isTeaching,
    test_deadline: testDeadline,
    creation_date: creationDate,
    stories,
    description,
    language,
    students,
  } = group

  const [currTestDeadline, setCurrTestDeadline] = useState(testDeadline)
  const [chosenTestDuration, setChosenTestDuration] = useState(Date.now() + 7200000)
  const showTestEnableMenu = showTestEnableMenuGroupId === id

  const showToken = showTokenGroupId === id
  const token = useSelector(state => state.groups.token)
  const intl = useIntl()
  const dispatch = useDispatch()
  const history = useHistory()

  const testEnabled = currTestDeadline - Date.now() > 0
  const testButtonVariant = testEnabled ? 'danger' : 'primary'
  const testButtonTextKey = testEnabled ? 'disable-test' : 'enable-test'

  const deadlineObject = new Date(currTestDeadline)
  const timezone = deadlineObject.toString().split(' ')[5]
  const deadlineHumanFormat = `${deadlineObject.toLocaleString()} (${timezone})`

  const role = isTeaching ? 'teacher' : 'student'

  const handleAnalyticsClick = async () => {
    await dispatch(updateGroupSelect(id))
    history.push(`/groups/${role}/analytics`)
  }

  const handleStoriesClick = async () => {
    await dispatch(updateGroupSelect(id))
    await dispatch(updateLibrarySelect('group'))
    history.push('/library')
  }

  const handleSettingsClick = () => {
    history.push(`/groups/${role}/${id}/concepts`)
  }

  const handlePeopleClick = async () => {
    await dispatch(updateGroupSelect(id))
    history.push(`/groups/${role}/people`)
  }

  const handleTestDisable = async () => {
    const currentDateMs = Date.now()
    await dispatch(setGroupTestDeadline(currentDateMs, id))
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

  const handleTestEnableClick = async () => {
    await dispatch(setGroupTestDeadline(chosenTestDuration, id))
    setCurrTestDeadline(chosenTestDuration)
    setShowTestEnableMenuGroupId(null)
  }

  const handleTestButtonCancel = async () => {
    setShowTestEnableMenuGroupId(null)
  }

  const handleTestDurationChange = (e, { value }) => {
    setChosenTestDuration(Date.now() + value)
  }

  const handleTestStartClick = async () => {
    await history.push('/tests')
    dispatch(getTestQuestions(language, id, true))
  }

  const testTimeOptions = [
    {
      key: '2-hours',
      text: intl.formatMessage({ id: '2-hours' }),
      value: 7200000,
    },
    {
      key: '3-hours',
      text: intl.formatMessage({ id: '3-hours' }),
      value: 10800000,
    },
    {
      key: '4-hours',
      text: intl.formatMessage({ id: '4-hours' }),
      value: 14400000,
    },
    {
      key: '24-hours',
      text: intl.formatMessage({ id: '24-hours' }),
      value: 86400000,
    },
  ]

  return (
    <Card fluid>
      <GroupInfoModal
        title={groupName}
        id={id}
        description={description}
        creationDate={creationDate}
        language={language}
        numOfStudents={students.length}
        numOfStories={stories.length}
        trigger={
          <Card.Content extra style={{ padding: '15px 15px 5px' }}>
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
        }
      />
      <Card.Content extra>
        <div className="space-between group-buttons sm" style={{ whiteSpace: 'nowrap' }}>
          <div className="group-management-buttons">
            {isTeaching && (
              <>
                <Button onClick={handleAnalyticsClick}>
                  <Icon name="chart line" /> <FormattedMessage id="Analytics" />
                </Button>
              </>
            )}
            <Button onClick={handleStoriesClick}>
              <Icon name="book" /> <FormattedMessage id="Stories" />
            </Button>
            <Button data-cy="people-button" onClick={handlePeopleClick}>
              <Icon name="user" /> <FormattedMessage id="people" />
            </Button>
            {isTeaching && (
              <>
                <Button onClick={handleSettingsClick}>
                  <Icon name="settings" /> <FormattedMessage id="learning-settings" />
                </Button>

                <Button onClick={handleShowTokenClick}>
                  <Icon name="key" /> <FormattedMessage id="show-group-token" />
                </Button>
                <Button
                  data-cy="enable-test-button"
                  onClick={handleTestEnableDisableButtonClick}
                  variant={testButtonVariant}
                >
                  <Icon name="pencil alternate" /> <FormattedMessage id={testButtonTextKey} />
                </Button>
              </>
            )}
            {!isTeaching && testEnabled && (
              <Button data-cy="start-test-button" onClick={handleTestStartClick}>
                <Icon name="pencil alternate" /> <FormattedMessage id="start-test" />
              </Button>
            )}
          </div>
          <div>
            <Popup
              content={intl.formatMessage({ id: 'Leave' })}
              position="top right"
              trigger={
                <Icon
                  name="log out"
                  size="large"
                  onClick={() => setLeaveGroupId(id)}
                  data-cy="leave-group"
                  style={{ cursor: 'pointer', margin: '0.25em 0.25em' }}
                />
              }
            />
            {isTeaching && (
              <Popup
                content={intl.formatMessage({ id: 'Delete' })}
                position="top right"
                trigger={
                  <Icon
                    name="trash alternate"
                    color="red"
                    size="large"
                    onClick={() => setDeleteGroupId(id)}
                    data-cy="delete-group"
                    style={{ cursor: 'pointer', margin: '0.25em 0.25em' }}
                  />
                }
              />
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
                <b>
                  <FormattedMessage id="enable-test-for" />
                </b>{' '}
                <Dropdown
                  onChange={handleTestDurationChange}
                  placeholder={intl.formatMessage({ id: '2-hours' })}
                  selection
                  style={{ minWidth: '120px' }}
                  options={testTimeOptions}
                />
                <Button
                  data-cy="enable-test-ok-button"
                  type="button"
                  onClick={handleTestEnableClick}
                  variant="success"
                  style={{ margin: '0.5em' }}
                >
                  OK
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

const GroupManagement = () => {
  const { groups: totalGroups, pending } = useSelector(({ groups }) => groups)
  const { role } = useParams()
  const groups = totalGroups.filter(group => group.is_teaching === (role === 'teacher'))
  const userId = useSelector(state => state.user.data.user.oid)

  const [addToGroupId, setAddToGroupId] = useState(null)
  const [deleteGroupId, setDeleteGroupId] = useState(false)
  const [leaveGroupId, setLeaveGroupId] = useState(false)
  const [showTokenGroupId, setShowTokenGroupId] = useState(null)

  const [showTestEnableMenuGroupId, setShowTestEnableMenuGroupId] = useState(null)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getGroups())
  }, [])

  const handleGroupDelete = () => {
    dispatch(deleteGroup(deleteGroupId))
  }

  const handleGroupLeave = () => {
    dispatch(leaveFromGroup(leaveGroupId, userId))
  }

  if (pending) return <Spinner fullHeight />

  if (groups.length === 0) return <NoGroupsView role={role} />

  return (
    <div className="group-container">
      <div className="ps-nm" data-cy="group-list">
        <GroupActionModal
          role={role}
          trigger={
            <Button
              data-cy={role === 'teacher' ? 'create-group-button' : 'join-group-button'}
              size="lg"
              style={{ marginTop: '1em', marginBottom: '1em', backgroundColor: '#00B5AD' }}
            >
              <FormattedMessage id={role === 'teacher' ? 'create-new-group' : 'join-a-group'} />
            </Button>
          }
        />

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
    </div>
  )
}

export default GroupManagement
