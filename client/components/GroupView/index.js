import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { Box, Card, Chip, TableBody } from '@mui/material'
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import AppTable from 'Components/ui/AppTable'
import CustomTooltip from 'Components/CustomTooltip'
import { colors } from 'Assets/mui_theme/designTokens'
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

const CardSection = ({ children, ...rest }) => (
  <Box sx={{ padding: '1em', borderTop: `1px solid ${colors.border}` }} {...rest}>
    {children}
  </Box>
)

const GroupInviteInfo = ({ group }) => {
  const anyPeopleAdded = !!group.addedPeople.length
  const anyPendingInvitations = !!group.pendingInvitations.length
  const anyFailedInvitations = !!group.failedInvitations.length

  return (
    <CardSection>
      {anyPeopleAdded && (
        <div className="padding-bottom-2">
          <Subheader translationId="added-to-the-group" color="#2CB22C" iconName="checkmark" />
          {group.addedPeople.map(email => (
            <Chip key={email} label={email} size="small" sx={{ mb: '.5rem', mr: '.5rem' }} />
          ))}
        </div>
      )}
      {anyPendingInvitations && (
        <div className="padding-bottom-2">
          <Subheader translationId="invitation-email-sent-to" color="#84C3A3" iconName="mail" />
          {group.pendingInvitations.map(email => (
            <Chip key={email} label={email} size="small" sx={{ mb: '.5rem', mr: '.5rem' }} />
          ))}
        </div>
      )}
      {anyFailedInvitations && (
        <div>
          <Subheader translationId="invitation-failed-for" color="#dc3545" iconName="ban" />
          {group.failedInvitations.map(email => (
            <Chip key={email} label={email} size="small" sx={{ mb: '.5rem', mr: '.5rem' }} />
          ))}
          <span style={{ display: 'block', fontSize: '12px', paddingLeft: '.5rem' }}>
            <FormattedMessage id="invitation-failure-explanation" />
          </span>
        </div>
      )}
    </CardSection>
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
  const [open, setOpen] = useState(false)

  return (
    <>
      {React.cloneElement(trigger, { onClick: () => setOpen(true) })}
      <AppDialog open={open} onClose={() => setOpen(false)} title={title}>
        <div className="italics" style={{ marginBottom: '1.5em' }}>
          {description}
          <br />
        </div>
        <AppTable striped sx={{ tableLayout: 'fixed' }}>
          <colgroup>
            <col width="40%" />
            <col width="60%" />
          </colgroup>
          <TableBody>
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
          </TableBody>
        </AppTable>
      </AppDialog>
    </>
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
    // `card` carries the app-wide card box (border/radius/margins) from custom.scss, and is not
    // just cosmetic — the e2e specs scope group actions with `.closest('.card')`.
    <Card
      className="card"
      sx={{ backgroundColor: colors.card, color: colors.ink }}
    >
      <GroupInfoModal
        title={groupName}
        id={id}
        description={description}
        creationDate={creationDate}
        language={language}
        numOfStudents={students.length}
        numOfStories={stories.length}
        trigger={
          <Box sx={{ padding: '15px 15px 5px', cursor: 'pointer' }}>
            <div className="story-item-title space-between">
              <h5 style={{ fontWeight: 'bold' }}>{groupName}</h5>
              {testEnabled && (
                <div style={{ marginLeft: '0.5em' }}>
                  <FormattedMessage id="test-deadline" /> {deadlineHumanFormat}
                </div>
              )}
              <MoreVertIcon style={{ marginLeft: '1rem' }} />
            </div>
          </Box>
        }
      />
      <CardSection>
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
            <CustomTooltip
              permanent
              placement="top-end"
              title={intl.formatMessage({ id: 'Leave' })}
            >
              <LogoutIcon
                onClick={() => setLeaveGroupId(id)}
                data-cy="leave-group"
                style={{ cursor: 'pointer', margin: '0.25em 0.25em' }}
              />
            </CustomTooltip>
            {isTeaching && (
              <CustomTooltip
                permanent
                placement="top-end"
                title={intl.formatMessage({ id: 'Delete' })}
              >
                <DeleteOutlinedIcon
                  onClick={() => setDeleteGroupId(id)}
                  data-cy="delete-group"
                  style={{ cursor: 'pointer', margin: '0.25em 0.25em', color: colors.error }}
                />
              </CustomTooltip>
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
      </CardSection>
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
          <Spinner fullHeight spinnerColor={colors.ink} size={60} />
        ) : (
          <>
            <Box data-cy="group-list" sx={{ px: '1rem' }}>
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
              {/* Cream design-system panel behind the group list. */}
              <Box
                sx={{
                  backgroundColor: colors.card,
                  color: colors.ink,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '20px',
                  p: { xs: '12px', sm: '20px' },
                  mt: '2rem',
                }}
              >
                {/* Right-aligned create/join row inside the cream panel. */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: '1em' }}>
                  <GroupActionModal
                    role={role}
                    trigger={
                      <AppButton
                        data-cy={role === 'teacher' ? 'create-group-button' : 'join-group-button'}
                        size="lg"
                      >
                        <FormattedMessage
                          id={role === 'teacher' ? 'create-new-group' : 'join-a-group'}
                        />
                      </AppButton>
                    }
                  />
                </Box>
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
              </Box>
            </Box>
          </>
        )}
      </div>
    )
  }
  return <NoGroupsView role={role} />
}

export default GroupView
