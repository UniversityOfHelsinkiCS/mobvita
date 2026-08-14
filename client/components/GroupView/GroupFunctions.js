/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Box } from '@mui/material'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import SettingsIcon from '@mui/icons-material/Settings'
import EditIcon from '@mui/icons-material/Edit'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import PersonIcon from '@mui/icons-material/Person'
import VpnKeyIcon from '@mui/icons-material/VpnKey'
import ShareIcon from '@mui/icons-material/Share'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { useDispatch, useSelector } from 'react-redux'
import { setGroupTestDeadline, getGroupToken } from 'Utilities/redux/groupsReducer'
import { updateGroupSelect, updateLibrarySelect } from 'Utilities/redux/userReducer'
import { getTestQuestions } from 'Utilities/redux/testReducer'
import AppButton from 'Components/AppButton'
import AppMenu, { AppMenuItem } from 'Components/ui/AppMenu'
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
  setCurrTestDeadline }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()


  const {
    is_teaching: isTeaching,
    group_id: groupId,
    language } = group
  const teacherView = useSelector(({ user }) => user.data.user.is_teacher)
  const [learningModalGroupId, setLearningModalGroupId] = useState(null)
  const [importStoryModalOpen, setImportStoryModalOpen] = useState(false)
  const { width } = useWindowDimensions()
  const testEnabled = currTestDeadline - Date.now() > 0
  const testButtonVariant = testEnabled ? 'danger' : 'primary'
  const testButtonTextKey = testEnabled ? 'disable-test' : 'enable-test'
  const peopleView = location.pathname.includes('people')
  const analyticsView = location.pathname.includes('analytics')
  const conceptsView = location.pathname.includes('concepts')
  const role = isTeaching ? 'teacher' : 'student'

  const handleAnalyticsClick = async () => {
    await dispatch(updateGroupSelect(groupId))
    navigate(`/groups/${role}/analytics`)
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
    navigate('/library')
  }

  const handlePeopleClick = async () => {
    await dispatch(updateGroupSelect(groupId))
    navigate(`/groups/${role}/people`)
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
    await navigate('/tests')
    dispatch(getTestQuestions(language, groupId, true))
  }

  


  return (
    <>
      {width >= 640 ? (
        <div className="flex" style={{ gap: '.25em', flexWrap: 'wrap' }}>
          {isTeaching && !analyticsView && teacherView && (
            <AppButton
              variant="primary"
              onClick={handleAnalyticsClick}
              data-cy="group-analytics-button"
              style={{ color: 'white' }}
            >
              <ShowChartIcon /> <FormattedMessage id="Analytics" />
            </AppButton>
          )}
          {isTeaching && teacherView && (
            <AppButton
              onClick={() => setLearningModalGroupId(groupId)}
              data-cy="group-learning-settings-button"
            >
              <SettingsIcon /> <FormattedMessage id="learning-settings" />
            </AppButton>
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
            <AppButton
              data-cy="enable-test-button"
              onClick={handleTestEnableDisableButtonClick}
              variant={testButtonVariant}
            >
              <EditIcon /> <FormattedMessage id={testButtonTextKey} />
            </AppButton>
          )}
          {!conceptsView && isTeaching && teacherView && (
            <AppButton
              variant="primary"
              as={Link}
              to={`/groups/teacher/${groupId}/settings`}
              data-cy="group-test-settings-button"
              style={{ color: 'white' }}
            >
              <SettingsIcon /> <FormattedMessage id="test-settings" />
            </AppButton>
          )}
          {isTeaching && teacherView && (<AppButton onClick={handleStoriesClick} data-cy="group-stories-button">
            <MenuBookIcon /> <FormattedMessage id="Stories" />
          </AppButton>)}
          {!peopleView && isTeaching && teacherView && (
            <AppButton data-cy="people-button" onClick={handlePeopleClick}>
              <PersonIcon /> <FormattedMessage id="people" />
            </AppButton>
          )}
          {isTeaching && teacherView && (
            <AppButton onClick={handleShowTokenClick} data-cy="group-show-token-button">
              <VpnKeyIcon /> <FormattedMessage id="show-group-token" />
            </AppButton>
          )}
          {isTeaching && teacherView && (
            <AppButton onClick={()=> setImportStoryModalOpen(true)} data-cy="group-import-story-button">
              <ShareIcon /> <FormattedMessage id="import-story" />
            </AppButton>

          )}
        </div>
      ) : (
        <Box sx={{ display: 'inline-flex' }}>
          <>
            {isTeaching && !analyticsView ? (
              <AppButton
                onClick={handleAnalyticsClick}
                style={{ backgroundColor: 'rgb(50, 170, 248)', color: 'white' }}
              >
                <FormattedMessage id="Analytics" />
              </AppButton> ? (
                isTeaching
              ) : (
                <AppMenuItem
                  onClick={() => setLearningModalGroupId(groupId)}
                  icon={<SettingsIcon />}
                >
                  <FormattedMessage id="learning-settings" />
                </AppMenuItem>
              )
            ) : (
              <AppButton
                as={Link}
                onClick={handleStoriesClick}
                data-cy="group-stories-button-mobile"
                style={{ backgroundColor: 'rgb(50, 170, 248)', color: 'white' }}
              >
                <FormattedMessage id="Stories" />
              </AppButton>
            )}
            <AppMenu
              trigger={
                <AppButton
                  data-cy="group-functions-menu-button"
                  style={{
                    backgroundColor: 'rgb(50, 170, 248)',
                    color: 'white',
                    borderLeft: '2px solid rgb(81, 138, 248)' }}
                >
                  <ArrowDropDownIcon />
                </AppButton>
              }
            >
              {isTeaching ? (
                <div className="story-item-dropdown">
                  <AppMenuItem
                    onClick={() => setLearningModalGroupId(groupId)}
                    data-cy="group-menu-learning-settings"
                    icon={<SettingsIcon />}
                  >
                    <FormattedMessage id="learning-settings" />
                  </AppMenuItem>
                  <AppMenuItem
                    onClick={handleTestEnableDisableButtonClick}
                    data-cy="group-menu-enable-test"
                    icon={<EditIcon />}
                  >
                    <FormattedMessage id={testButtonTextKey} />
                  </AppMenuItem>
                  {!conceptsView && (
                    <Link to={`/groups/teacher/${groupId}/concepts/settings`}>
                      <AppMenuItem data-cy="group-menu-test-settings" icon={<SettingsIcon />}>
                        <FormattedMessage id="test-settings" />
                      </AppMenuItem>
                    </Link>
                  )}
                  <AppMenuItem
                    onClick={handleStoriesClick}
                    data-cy="group-menu-stories"
                    icon={<MenuBookIcon />}
                  >
                    <FormattedMessage id="Stories" />
                  </AppMenuItem>
                  {!peopleView && (
                    <AppMenuItem
                      onClick={handlePeopleClick}
                      data-cy="group-menu-people"
                      icon={<PersonIcon />}
                    >
                      <FormattedMessage id="people" />
                    </AppMenuItem>
                  )}
                  <AppMenuItem
                    onClick={handleShowTokenClick}
                    data-cy="group-menu-show-token"
                    icon={<VpnKeyIcon />}
                  >
                    <FormattedMessage id="show-group-token" />
                  </AppMenuItem>
                </div>
              ) : (
                <div className="story-item-dropdown">
                  <AppMenuItem
                    onClick={handlePeopleClick}
                    data-cy="group-menu-people-student"
                    icon={<PersonIcon />}
                  >
                    <FormattedMessage id="people" />
                  </AppMenuItem>
                  {testEnabled && (
                    <AppMenuItem
                      onClick={handleTestStartClick}
                      data-cy="group-menu-start-test"
                      icon={<EditIcon />}
                    >
                      <FormattedMessage id="start-test" />
                    </AppMenuItem>
                  )}
                </div>
              )}
            </AppMenu>
          </>
        </Box>
      )}
    </>
  )
}

export default GroupFunctions
