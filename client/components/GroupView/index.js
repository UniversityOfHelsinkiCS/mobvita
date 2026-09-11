// React must remain in scope because Vite compiles this project's JSX with the classic runtime.
// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { FormattedMessage, useIntl } from 'react-intl'
import { Box, Card, Chip, TableBody } from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import AppMenu, { AppMenuItem } from 'Components/ui/AppMenu'
import AppTable from 'Components/ui/AppTable'
import AppTooltip from 'Components/ui/AppTooltip'
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
import { images } from 'Utilities/common'
import AppIcon from 'Components/ui/AppIcon'

const CardSection = ({ children, ...rest }) => (
  <Box sx={{ padding: '1em', borderTop: `1px solid ${colors.border}` }} {...rest}>
    {children}
  </Box>
)

const formatCreationDate = value => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

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
  const formattedCreationDate = formatCreationDate(creationDate)

  return (
    <>
      {trigger({ onClick: () => setOpen(true) })}
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
            <Row translationId="creation-date"> {formattedCreationDate}</Row>
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
      sx={{ backgroundColor: 'white', color: colors.ink, border: `4px solid #E8E5DC`, borderRadius: '12px', padding: '16px 20px', marginBottom: '6px', boxShadow: 'none' }}
    >
      <Box sx={{ padding: 0 }}>
        <div
          className="story-item-title group-card-header"
          style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}
        >
          {/* Top-aligned, so the icon sits on the group-name line rather than centring against the
              whole block once a description or test deadline is stacked underneath. */}
          <AppIcon
            src={images.group}
            size={24}
            color="#B1D3C2"
            style={{ alignSelf: 'flex-start', marginTop: '1px' }}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h5 style={{ fontWeight: 'normal', fontSize: '22px', padding: 0, margin: 0 }}>
                {groupName}
              </h5>
              {/* The details dialog now opens from this info icon only, not from the name. */}
              <GroupInfoModal
                title={groupName}
                id={id}
                description={description}
                creationDate={creationDate}
                language={language}
                numOfStudents={students.length}
                numOfStories={stories.length}
                trigger={triggerProps => (
                  <AppTooltip keyId="group-info" placement="top">
                    <button
                      {...triggerProps}
                      className="group-card-info-trigger"
                      type="button"
                      data-cy="group-info-button"
                      aria-label={intl.formatMessage({
                        id: 'group-info',
                        defaultMessage: 'Group info',
                      })}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        padding: 0,
                        border: 0,
                        background: 'transparent',
                      }}
                    >
                      {/* Masked and painted with `currentColor`, so the `.group-card-info-trigger`
                          rule in custom.scss owns both the rest and hover colour — an inline
                          `color` here would outrank it and freeze the hover. */}
                      <AppIcon src={images.infoIcon} size={16} color="currentColor" />
                    </button>
                  </AppTooltip>
                )}
              />
            </div>
            {description && <div style={{ fontSize: '12px', color: '#9D9B92' }}>{description}</div>}
            {testEnabled && (
              <div style={{ fontSize: '12px', color: '#9D9B92' }}>
                <FormattedMessage id="test-deadline" /> {deadlineHumanFormat}
              </div>
            )}
          </div>

          <AppMenu
                minWidth={200}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                disableScrollLock
                trigger={
                  <button
                    className="group-card-more-button"
                    type="button"
                    data-cy="group-card-actions"
                    aria-label={intl.formatMessage({ id: 'actions', defaultMessage: 'Actions' })}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px',
                      border: 0,
                      background: 'transparent',
                      color: colors.ink,
                    }}
                  >
                    <MoreVertIcon />
                  </button>
                }
              >
                <AppMenuItem
                  data-cy="leave-group"
                  onClick={() => setLeaveGroupId(id)}
                  icon={<img src={images.logOut01} alt="" style={{ width: 22, height: 22 }} />}
                >
                  <FormattedMessage id="leave-group" defaultMessage="Leave Group" />
                </AppMenuItem>
                {isTeaching && (
                  <AppMenuItem
                    data-cy="delete-group"
                    onClick={() => setDeleteGroupId(id)}
                    icon={<img src={images.trash03} alt="" style={{ width: 22, height: 22 }} />}
                  >
                    <FormattedMessage id="delete-group" defaultMessage="Delete Group" />
                  </AppMenuItem>
                )}
          </AppMenu>
        </div>
      </Box>

      <CardSection sx={{ borderTop: 'none', paddingTop: '20px' }}>
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
                title={<FormattedMessage id="delete-group" defaultMessage="Delete Group" />}
                acceptLabel={<FormattedMessage id="Delete" />}
                actionsSx={{ justifyContent: 'space-between' }}
                cancelButtonProps={{
                  size: 'sm',
                  sx: { flex: 1, height: '36px' },
                }}
                acceptButtonProps={{
                  variant: 'primary',
                  size: 'sm',
                  sx: {
                    flex: 1,
                    height: '36px',
                    backgroundColor: '#FF7700',
                    '&:hover': { backgroundColor: colors.alertHover },
                  },
                }}
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
                  border: `none`,
                  borderRadius: '20px',
                  p: { xs: '12px', sm: '20px' },                  
                }}
              >
                {/* Panel heading on the left, create/join action on the right. */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1em',
                    mb: '1em',
                  }}
                >
                  <h2
                    style={{
                      fontSize: '22px',
                      fontWeight: 'normal',
                      color: colors.ink,
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    <FormattedMessage id="groups" />
                  </h2>
                  <GroupActionModal
                    role={role}
                    trigger={
                      <AppButton
                        data-cy={role === 'teacher' ? 'create-group-button' : 'join-group-button'}
                        size={role === 'teacher' ? 'sm' : 'lg'}
                        sx={role === 'teacher' ? { '& img': { width: 20, height: 20 } } : undefined}
                      >
                        {role === 'teacher' && <img src={images.plusOutline} alt="" />}
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
