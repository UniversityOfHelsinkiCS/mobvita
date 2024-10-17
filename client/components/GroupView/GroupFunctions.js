/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Icon, Dropdown, Button as SemanticButton } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { setGroupTestDeadline, getGroupToken } from 'Utilities/redux/groupsReducer'
import { updateGroupSelect, updateLibrarySelect } from 'Utilities/redux/userReducer'
import { getTestQuestions } from 'Utilities/redux/testReducer'
import { Button } from 'react-bootstrap'
import useWindowDimensions from 'Utilities/windowDimensions'
import GroupLearningSettingsModal from './GroupLearningSettingsModal'
import ImportStoryModal from './ImportStoryModal'

const GroupFunctions = ({
  group,
  showToken,
  setShowTokenGroupId,
  showTestEnableMenuGroupId,
  setShowTestEnableMenuGroupId,
  currTestDeadline,
  setCurrTestDeadline,
}) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    is_teaching: isTeaching,
    group_id: groupId,
    language,
  } = group
  const teacherView = useSelector(({ user }) => user.data.user.is_teacher)
  const [learningModalGroupId, setLearningModalGroupId] = useState(null)
  const [importStoryModalOpen, setImportStoryModalOpen] = useState(false)
  const { width } = useWindowDimensions()
  const testEnabled = currTestDeadline - Date.now() > 0
  const testButtonVariant = testEnabled ? 'danger' : 'primary'
  const testButtonTextKey = testEnabled ? 'disable-test' : 'enable-test'
  const peopleView = history.location.pathname.includes('people')
  const analyticsView = history.location.pathname.includes('analytics')
  const conceptsView = history.location.pathname.includes('concepts')
  const role = isTeaching ? 'teacher' : 'student'

  const handleAnalyticsClick = async () => {
    await dispatch(updateGroupSelect(groupId))
    history.push(`/groups/${role}/analytics`)
  }

  const handleShowTokenClick = () => {
    setShowTestEnableMenuGroupId(null)
    if (showToken) {
      setShowTokenGroupId(null)
    } else {
      dispatch(getGroupToken(groupId))
      setShowTokenGroupId(groupId)
    }
  }

  const handleTestDisable = async () => {
    const currentDateMs = Date.now()
    await dispatch(setGroupTestDeadline(currentDateMs, groupId))
    setCurrTestDeadline(currentDateMs)
    setShowTestEnableMenuGroupId(null)
  }

  const handleStoriesClick = async () => {
    await dispatch(updateGroupSelect(groupId))
    await dispatch(updateLibrarySelect('group'))
    history.push('/library')
  }

  const handlePeopleClick = async () => {
    await dispatch(updateGroupSelect(groupId))
    history.push(`/groups/${role}/people`)
  }

  const handleTestEnableDisableButtonClick = () => {
    if (testEnabled) {
      handleTestDisable()
    } else {
      setShowTokenGroupId(null)
      if (showTestEnableMenuGroupId) {
        setShowTestEnableMenuGroupId(null)
      } else {
        setShowTestEnableMenuGroupId(groupId)
      }
    }
  }

  const handleTestStartClick = async () => {
    await history.push('/tests')
    dispatch(getTestQuestions(language, groupId, true))
  }

  


  return (
    <>
      {width >= 640 ? (
        <div className="flex" style={{ gap: '.25em', flexWrap: 'wrap' }}>
          {isTeaching && !analyticsView && teacherView && (
            <Button
              variant="primary"
              onClick={handleAnalyticsClick}
              style={{ color: 'white' }}
            >
              <Icon name="chart line" /> <FormattedMessage id="Analytics" />
            </Button>
          )}
          {isTeaching && teacherView && (
            <Button onClick={() => setLearningModalGroupId(groupId)}>
              <Icon name="settings" /> <FormattedMessage id="learning-settings" />
            </Button>
          )}
          {learningModalGroupId && isTeaching && (
            <GroupLearningSettingsModal
              open={!!learningModalGroupId}
              setOpen={setLearningModalGroupId}
              groupId={learningModalGroupId}
            />
          )}
          {isTeaching && teacherView && (
            <ImportStoryModal open={importStoryModalOpen} setOpen={setImportStoryModalOpen} groupId={groupId} />
          )}
          {isTeaching && teacherView && (
            <Button
              data-cy="enable-test-button"
              onClick={handleTestEnableDisableButtonClick}
              variant={testButtonVariant}
            >
              <Icon name="pencil alternate" /> <FormattedMessage id={testButtonTextKey} />
            </Button>
          )}
          {!conceptsView && isTeaching && teacherView && (
            <Button
              variant="primary"
              as={Link}
              to={`/groups/teacher/${groupId}/concepts/settings`}
              style={{ color: 'white' }}
            >
              <Icon name="settings" /> <FormattedMessage id="test-settings" />
            </Button>
          )}
          {isTeaching && teacherView && (<Button onClick={handleStoriesClick}>
            <Icon name="book" /> <FormattedMessage id="Stories" />
          </Button>)}
          {!peopleView && isTeaching && teacherView && (
            <Button data-cy="people-button" onClick={handlePeopleClick}>
              <Icon name="user" /> <FormattedMessage id="people" />
            </Button>
          )}
          {isTeaching && teacherView && (
            <Button onClick={handleShowTokenClick}>
              <Icon name="key" /> <FormattedMessage id="show-group-token" />
            </Button>
          )}
          {isTeaching && teacherView && (
            <Button onClick={()=> setImportStoryModalOpen(true)}>
              <Icon name="share" /> <FormattedMessage id="import-story" />
            </Button>
            
          )}
        </div>
      ) : (
        <SemanticButton.Group>
          <>
            {isTeaching && !analyticsView ? (
              <SemanticButton
                onClick={handleAnalyticsClick}
                style={{ backgroundColor: 'rgb(50, 170, 248)', color: 'white' }}
              >
                <FormattedMessage id="Analytics" />
              </SemanticButton> ? (
                isTeaching
              ) : (
                <Dropdown.Item
                  text={<FormattedMessage id="learning-settings" />}
                  as={Link}
                  onClick={() => setLearningModalGroupId(groupId)}
                  icon="settings"
                />
              )
            ) : (
              <SemanticButton
                as={Link}
                onClick={handleStoriesClick}
                style={{ backgroundColor: 'rgb(50, 170, 248)', color: 'white' }}
              >
                <FormattedMessage id="Stories" />
              </SemanticButton>
            )}
            <Dropdown
              className="button icon"
              style={{
                backgroundColor: 'rgb(50, 170, 248)',
                color: 'white',
                borderLeft: '2px solid rgb(81, 138, 248)',
              }}
              floating
              trigger={<React.Fragment />}
            >
              {isTeaching ? (
                <Dropdown.Menu className="story-item-dropdown">
                  <Dropdown.Item
                    text={<FormattedMessage id="learning-settings" />}
                    as={Link}
                    onClick={() => setLearningModalGroupId(groupId)}
                    icon="settings"
                  />
                  <Dropdown.Item
                    text={<FormattedMessage id={testButtonTextKey} />}
                    as={Link}
                    onClick={handleTestEnableDisableButtonClick}
                    icon="pencil alternate"
                  />
                  {!conceptsView && (
                    <Dropdown.Item
                      text={<FormattedMessage id="test-settings" />}
                      as={Link}
                      to={`/groups/teacher/${groupId}/concepts/settings`}
                      icon="settings"
                    />
                  )}
                  <Dropdown.Item
                    text={<FormattedMessage id="Stories" />}
                    as={Link}
                    onClick={handleStoriesClick}
                    icon="book"
                  />
                  {!peopleView && (
                    <Dropdown.Item
                      text={<FormattedMessage id="people" />}
                      as={Link}
                      onClick={handlePeopleClick}
                      icon="user"
                    />
                  )}
                  <Dropdown.Item
                    text={<FormattedMessage id="show-group-token" />}
                    as={Link}
                    onClick={handleShowTokenClick}
                    icon="key"
                  />
                </Dropdown.Menu>
              ) : (
                <Dropdown.Menu className="story-item-dropdown">
                  <Dropdown.Item
                    text={<FormattedMessage id="people" />}
                    as={Link}
                    onClick={handlePeopleClick}
                    icon="user"
                  />
                  {testEnabled && (
                    <Dropdown.Item
                      text={<FormattedMessage id="start-test" />}
                      as={Link}
                      onClick={handleTestStartClick}
                      icon="pencil alternate"
                    />
                  )}
                </Dropdown.Menu>
              )}
            </Dropdown>
          </>
        </SemanticButton.Group>
      )}
    </>
  )
}

export default GroupFunctions
