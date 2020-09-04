import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGroups, removeFromGroup, getGroupToken } from 'Utilities/redux/groupsReducer'
import { ListGroup, ButtonGroup, ToggleButton } from 'react-bootstrap'
import { FormattedMessage, useIntl } from 'react-intl'
import { Icon, Dropdown } from 'semantic-ui-react'
import { getSummary } from 'Utilities/redux/groupSummaryReducer'
import { learningLanguageSelector } from 'Utilities/common'
import { updateGroupSelect } from 'Utilities/redux/userReducer'
import Spinner from 'Components/Spinner'
import CollapsingList from './CollapsingList'
import Summary from './Summary'
import StudentProgress from './StudentProgress'
import NoGroupsView from './NoGroupsView'
import GroupHistory from './GroupHistory'

const GroupAnalytics = () => {
  const intl = useIntl()
  const [content, setContent] = useState('summary')
  const [historyView, setHistoryView] = useState('test')
  const [currentStudent, setCurrentStudent] = useState(null)
  const userOid = useSelector(({ user }) => user.data.user.oid)
  const currentGroupId = useSelector(({ user }) => user.data.user.last_selected_group)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()

  const { groups, created, pending } = useSelector(({ groups }) => groups)
  const currentGroup = groups.find(group => group.group_id === currentGroupId)

  const groupOptions = groups.map(group => ({
    key: group.group_id,
    text: group.groupName,
    value: group.group_id,
  }))

  useEffect(() => {
    dispatch(getGroups())
  }, [])

  useEffect(() => {
    if (!groups || groups.length === 0) return
    if (currentGroupId && groups.some(group => group.group_id === currentGroupId)) return
    dispatch(updateGroupSelect(groups[0].group_id))
  }, [groups])

  useEffect(() => {
    if (currentGroup && currentGroup.is_teaching) {
      dispatch(getGroupToken(currentGroupId))
    }
  }, [currentGroup])

  useEffect(() => {
    if (!created) return
    dispatch(updateGroupSelect(created.group_id))
  }, [created])

  const compare = (a, b) => {
    if (a.userName.toLowerCase() < b.userName.toLowerCase()) return -1
    if (a.userName.toLowerCase() > b.userName.toLowerCase()) return 1
    return 0
  }

  if (currentGroup) {
    currentGroup.teachers.sort(compare)
    currentGroup.students.sort(compare)
  }

  const removeUser = userId => {
    dispatch(removeFromGroup(currentGroupId, userId))
  }

  const handleGroupChange = key => {
    dispatch(updateGroupSelect(key))
  }

  if (pending || (groups.length > 0 && !currentGroup))
    return (
      <div style={{ height: '80vh' }}>
        <Spinner />
      </div>
    )

  if (groups.length === 0) return <NoGroupsView />

  const currentUserIsTeacher = currentGroup?.teachers.find(teacher => teacher._id === userOid)

  return (
    <div className="group-container">
      <div className="group-analytics-top">
        <Dropdown
          options={groupOptions}
          value={currentGroupId}
          onChange={(_, { value }) => handleGroupChange(value)}
          style={{
            fontSize: '1.3rem',
            fontWeight: 'bold',
            textAlign: 'bottom',
            paddingLeft: '0.2rem',
            color: '#777',
            display: 'flex',
            alignItems: 'center',
          }}
        />
        {currentGroup?.is_teaching && (
          <ButtonGroup toggle>
            <ToggleButton
              type="radio"
              value="summary"
              variant="info"
              checked={content === 'summary'}
              onChange={() => setContent('summary')}
            >
              <FormattedMessage id="summary" />
            </ToggleButton>
            <ToggleButton
              type="radio"
              value="progress"
              variant="info"
              checked={content === 'progress'}
              onChange={() => setContent('progress')}
            >
              <FormattedMessage id="Progress" />
            </ToggleButton>
            <ToggleButton
              type="radio"
              value="history"
              variant="info"
              checked={content === 'history'}
              onChange={() => setContent('history')}
            >
              <FormattedMessage id="History" />
            </ToggleButton>
          </ButtonGroup>
        )}
      </div>
      <p style={{ paddingLeft: '0.2rem', fontStyle: 'italic' }}>{currentGroup?.description}</p>
      <CollapsingList header={intl.formatMessage({ id: 'Teachers' })}>
        <ListGroup>
          {currentGroup.teachers.map(teacher => (
            <ListGroup.Item key={teacher.userName}>{teacher.userName}</ListGroup.Item>
          ))}
        </ListGroup>
      </CollapsingList>
      {currentGroup.is_teaching && (
        <CollapsingList header={intl.formatMessage({ id: 'Students' })}>
          <ListGroup
            style={{
              maxHeight: '40vh',
              overflowY: 'auto',
            }}
          >
            {currentGroup.students.length === 0 ? (
              <ListGroup.Item />
            ) : (
              currentGroup.students.map(student => (
                <ListGroup.Item
                  style={{
                    backgroundColor: student === currentStudent ? 'gray' : 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                  }}
                  key={student.userName}
                  onClick={() => setCurrentStudent(student)}
                >
                  <span
                    style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
                  >
                    {student.userName} ({student.email})
                  </span>
                  {currentUserIsTeacher && (
                    <Icon
                      data-cy={`remove-from-group-${student.userName}`}
                      style={{ cursor: 'pointer' }}
                      name="close"
                      color="red"
                      onClick={() => removeUser(student._id)}
                    />
                  )}
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </CollapsingList>
      )}
      {content === 'summary' && currentGroup.is_teaching && (
        <>
          <hr />
          <span className="sm-label padding-left-1">
            <FormattedMessage id="Showing results for" />
          </span>
          <Summary
            groupName={currentGroup.groupName}
            isTeaching={currentGroup.is_teaching}
            learningLanguage={learningLanguage}
            getSummary={(start, end) => dispatch(getSummary(currentGroupId, start, end))}
          />
        </>
      )}
      {content === 'progress' && currentGroup.is_teaching && (
        <StudentProgress student={currentStudent} groupId={currentGroupId} />
      )}
      {content === 'history' && currentGroup.is_teaching && (
        <div>
          <ButtonGroup
            toggle
            style={{
              float: 'right',
              paddingTop: '1rem',
            }}
          >
            <ToggleButton
              type="radio"
              value="test"
              variant="success"
              checked={historyView === 'test'}
              onChange={() => setHistoryView('test')}
            >
              <FormattedMessage id="Test" />
            </ToggleButton>
            <ToggleButton
              type="radio"
              value="exercise"
              variant="success"
              checked={historyView === 'exercise'}
              onChange={() => setHistoryView('exercise')}
            >
              <FormattedMessage id="Exercise" />
            </ToggleButton>
          </ButtonGroup>
          <GroupHistory student={currentStudent} groupId={currentGroupId} view={historyView} />
        </div>
      )}
    </div>
  )
}

export default GroupAnalytics
