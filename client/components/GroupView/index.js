import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { Card, Icon, Label, Dropdown, Popup, Modal } from 'semantic-ui-react'
import { Button, Table } from 'react-bootstrap'
import { updateLibrarySelect, updateGroupSelect } from 'Utilities/redux/userReducer'
import {
  getGroups,
  deleteGroup,
  leaveFromGroup,
  setGroupTestDeadline,
} from 'Utilities/redux/groupsReducer'
import Spinner from 'Components/Spinner'
import Subheader from 'Components/Subheader'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import PeopleAddResultModal from './PeopleAddResultModal'
import GroupActionModal from './GroupActionModal'
import AddToGroup from './AddToGroup'
import NoGroupsView from './NoGroupsView'
import Row from './Row'
import GroupLearningSettingsModal from './GroupLearningSettingsModal'
import GroupFunctions from './GroupFunctions'
import GroupKey from './GroupKey'
import EnableTestMenu from './EnableTestMenu'

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
  const showTestEnableMenu = showTestEnableMenuGroupId === id
  const showToken = showTokenGroupId === id
  const intl = useIntl()

  const testEnabled = currTestDeadline - Date.now() > 0

  const deadlineObject = new Date(currTestDeadline)
  const timezone = deadlineObject.toString().split(' ')[5]
  const deadlineHumanFormat = `${deadlineObject.toLocaleString()} (${timezone})`

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
          <GroupFunctions
            group={group}
            showToken={showToken}
            setShowTokenGroupId={setShowTokenGroupId}
            showTestEnableMenuGroupId={showTestEnableMenuGroupId}
            setShowTestEnableMenuGroupId={setShowTestEnableMenuGroupId}
            currTestDeadline={currTestDeadline}
            setCurrTestDeadline={setCurrTestDeadline}
          />
          <div style={{ marginLeft: '1.5rem' }}>
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
        {showToken && <GroupKey />}
        {showTestEnableMenu && (
          <EnableTestMenu
            setGroupTestDeadline={setGroupTestDeadline}
            setCurrTestDeadline={setCurrTestDeadline}
            setShowTestEnableMenuGroupId={setShowTestEnableMenuGroupId}
            id={id}
          />
        )}
      </Card.Content>
      {group.peopleInvited && <GroupInviteInfo group={group} />}
    </Card>
  )
}

const GroupView = () => {
  const { groups: totalGroups, lastAddInfo, pending } = useSelector(({ groups }) => groups)
  const { role } = useParams()
  const groups = totalGroups.filter(group => group.is_teaching === (role === 'teacher'))
  const userId = useSelector(state => state.user.data.user.oid)

  const [addToGroupId, setAddToGroupId] = useState(null)
  const [deleteGroupId, setDeleteGroupId] = useState(false)
  const [leaveGroupId, setLeaveGroupId] = useState(false)
  const [learningModalGroupId, setLearningModalGroupId] = useState(null)
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

  if (pending || groups.length > 0) {
    return (
      <div className="group-container">
        {learningModalGroupId && (
          <GroupLearningSettingsModal
            open={!!learningModalGroupId}
            setOpen={setLearningModalGroupId}
            groupId={learningModalGroupId}
          />
        )}
        <PeopleAddResultModal lastAddInfo={lastAddInfo} />
        {pending ? (
          <Spinner fullHeight size={60} />
        ) : (
          <>
            <div className="ps-nm" data-cy="group-list">
              <GroupActionModal
                role={role}
                trigger={
                  <Button
                    data-cy={role === 'teacher' ? 'create-group-button' : 'join-group-button'}
                    size="lg"
                    style={{ marginTop: '1em', marginBottom: '1em', backgroundColor: '#00B5AD', float: 'right'}}
                  >
                    <FormattedMessage
                      id={role === 'teacher' ? 'create-new-group' : 'join-a-group'}
                    />
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
                  setLearningModalGroupId={setLearningModalGroupId}
                  setLeaveGroupId={setLeaveGroupId}
                  showTokenGroupId={showTokenGroupId}
                  setShowTokenGroupId={setShowTokenGroupId}
                  showTestEnableMenuGroupId={showTestEnableMenuGroupId}
                  setShowTestEnableMenuGroupId={setShowTestEnableMenuGroupId}
                />
              ))}
            </div>
          </>
        )}
      </div>
    )
  }
  return <NoGroupsView role={role} />
}

export default GroupView
