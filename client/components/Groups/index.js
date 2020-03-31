import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { getGroups, removeFromGroup, getGroupToken } from 'Utilities/redux/groupsReducer'
import {
  Dropdown,
  ListGroup,
  Button,
  Spinner,
} from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { getSummary, getPersonalSummary } from 'Utilities/redux/groupSummaryReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'
import { learningLanguageSelector } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import AddGroup from './AddGroup'
import AddToGroup from './AddToGroup'
import JoinGroup from './JoinGroup'
import CollapsingList from './CollapsingList'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import Summary from './Summary'

const GroupView = () => {
  const intl = useIntl()
  const [addToGroupOpen, setAddToGroupOpen] = useState(false)
  const [addGroupOpen, setAddGroupOpen] = useState(false)
  const [joinGroupOpen, setJoinGroupOpen] = useState(false)
  const [currentGroupId, setCurrentGroupId] = useState(null)
  const [showToken, setShowToken] = useState(false)
  const [summary, setSummary] = useState(false)
  const userOid = useSelector(({ user }) => user.data.user.oid)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()
  const history = useHistory()
  const bigWindow = useWindowDimensions().width >= 630

  const { groups, created, pending, token } = useSelector(({ groups }) => groups)
  const currentGroup = groups.find(group => group.group_id === currentGroupId)


  useEffect(() => {
    dispatch(getGroups())
  }, [])

  useEffect(() => {
    if (!groups || groups.length === 0) return
    if (currentGroupId && groups.some(group => group.group_id === currentGroupId)) return
    setCurrentGroupId(groups[0].group_id)
  }, [groups])

  useEffect(() => {
    if (currentGroupId && currentGroup.is_teaching) {
      dispatch(getGroupToken(currentGroupId))
    }
  }, [currentGroupId])

  useEffect(() => {
    if (!created) return
    setCurrentGroupId(created.group_id)
  }, [created])

  const removeUser = (userId) => {
    dispatch(removeFromGroup(currentGroupId, userId))
  }

  const handleSettingsClick = () => {
    history.push(`/groups/${currentGroupId}/concepts`)
  }

  const handleSummary = () => {
    setSummary(true)
  }

  const handleShowToken = () => {
    setShowToken(!showToken)
  }

  const handleTokenCopy = () => {
    dispatch(setNotification(intl.formatMessage({ id: 'token-copied' }), 'info'))
  }

  if (pending) {
    return (
      <div className="spinner-container">
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    )
  }

  if (!currentGroup) {
    return (
      <div className="group-container nogroups">
        <h2 id="title"> <FormattedMessage id="Groups" /></h2>
        <Button id="join-group-button" variant="info" onClick={() => setJoinGroupOpen(true)}>
          <FormattedMessage id="join-group" />
        </Button>
        <span className="additional-info">
          <FormattedMessage id="join-group-message" />
        </span>

        <br />
        <Button
          data-cy="create-group-modal"
          variant="primary"
          onClick={() => setAddGroupOpen(true)}
        >
          <FormattedMessage id="create-new-group" />
        </Button>
        <span className="additional-info">
          <FormattedMessage id="create-group-message" />
        </span>

        <AddGroup isOpen={addGroupOpen} setOpen={setAddGroupOpen} />
        <JoinGroup isOpen={joinGroupOpen} setOpen={setJoinGroupOpen} />
      </div>
    )
  }

  const currentUserIsTeacher = currentGroup.teachers.find(teacher => teacher._id === userOid)

  return (
    <div className="group-container">
      <div className="group-controls padding-bottom-1">
        <Dropdown
          data-cy="select-group"
          className="auto-right"
          onSelect={key => setCurrentGroupId(key)}
        >
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            {currentGroup.groupName}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {groups.map(group => (
              <Dropdown.Item eventKey={group.group_id} key={group.group_id}>{group.groupName}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <Button variant="info" onClick={() => setJoinGroupOpen(true)}>
          <FormattedMessage id="join-group" />
        </Button>
        {bigWindow
          && (
            <Button
              data-cy="create-group-modal"
              variant="info"
              onClick={() => setAddGroupOpen(true)}
            >
              <FormattedMessage id="create-new-group" />
            </Button>
          )
        }
      </div>
      <CollapsingList header={intl.formatMessage({ id: 'Teachers' })}>
        <ListGroup>
          {currentGroup.teachers.map(teacher => (
            <ListGroup.Item key={teacher.userName}>{teacher.userName}</ListGroup.Item>
          ))}
        </ListGroup>
      </CollapsingList>
      <CollapsingList header={intl.formatMessage({ id: 'Students' })}>
        <ListGroup style={{
          maxHeight: '50vh',
          overflowY: 'auto',
        }}
        >
          {currentGroup.students.length === 0 ? <ListGroup.Item /> : currentGroup.students.map(student => (
            <ListGroup.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} key={student.userName}>
              {student.userName}
              {currentUserIsTeacher && (
                <Icon
                  data-cy={`remove-from-group-${student.userName}`}
                  style={{ cursor: 'pointer' }}
                  name="close"
                  color="red"
                  onClick={() => removeUser(student._id)}
                />
              )
              }
            </ListGroup.Item>
          ))}
        </ListGroup>
      </CollapsingList>
      {currentGroup.is_teaching && !bigWindow
        && (
          <>
            <div className="group-controls padding-top-1">
              <Button className="auto-right" onClick={handleShowToken} block>
                <FormattedMessage id="show-group-token" />
              </Button>
            </div>
            {showToken && (
              <div className="border rounded" style={{ display: 'flex', marginTop: '0.2em', minHeight: '3em', flexDirection: 'row' }}>
                <div
                  style={{ padding: '0.5em', margin: 'auto', wordBreak: 'break-all' }}
                >
                  {token}
                </div>
                <CopyToClipboard text={token}>
                  <Button type="button" onClick={handleTokenCopy}>
                    <Icon name="copy" size="large" />
                  </Button>
                </CopyToClipboard>
              </div>
            )}
          </>
        )}
      {currentGroup.is_teaching && bigWindow
        && (
          <>
            <div className="group-controls padding-top-1">
              <Button
                data-cy="add-to-group-modal"
                onClick={() => setAddToGroupOpen(true)}
              >
                <FormattedMessage id="add-people-to-group" />
              </Button>
              <Button onClick={handleSummary}>
                <FormattedMessage id="summary" />
              </Button>
              <Button onClick={handleSettingsClick}>
                <FormattedMessage id="learning-settings" />
              </Button>
              <Button className="auto-right" onClick={handleShowToken}>
                <FormattedMessage id="show-group-token" />
              </Button>
              <DeleteConfirmationModal
                groupId={currentGroupId}
                trigger={(
                  <Button
                    data-cy="delete-group"
                    variant="danger"
                  >
                    <Icon name="trash alternate outline" /> {intl.formatMessage({ id: 'delete-group' })}
                  </Button>

                )}
              />
            </div>
            {showToken && (
              <div className="border rounded" style={{ display: 'flex', marginTop: '0.2em', minHeight: '3em' }}>
                <span style={{ margin: 'auto' }}>{token}</span>
                <CopyToClipboard text={token}>
                  <Button type="button" onClick={handleTokenCopy}>
                    <Icon name="copy" size="large" />
                  </Button>
                </CopyToClipboard>
              </div>
            )}


          </>
        )
      }


      {bigWindow && !currentGroup.is_teaching
        && (
          <Button onClick={handleSummary}>
            <FormattedMessage id="summary" />
          </Button>
        )
      }


      {summary && (
        <>
          <hr />
          <Summary
            groupName={currentGroup.groupName}
            isTeaching={currentGroup.is_teaching}
            learningLanguage={learningLanguage}
            getSummary={(start, end, summaryLanguage) => dispatch(getSummary(currentGroupId, summaryLanguage, start, end))}
            getPersonalSummary={(start, end, summaryLanguage) => dispatch(getPersonalSummary(summaryLanguage, start, end))}
          />
        </>
      )}


      <AddToGroup groupId={currentGroupId} isOpen={addToGroupOpen} setOpen={setAddToGroupOpen} />
      <AddGroup isOpen={addGroupOpen} setOpen={setAddGroupOpen} />
      <JoinGroup isOpen={joinGroupOpen} setOpen={setJoinGroupOpen} />
    </div>
  )
}

export default GroupView
