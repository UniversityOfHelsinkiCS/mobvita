import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Card } from '@mui/material'
import CommentsIcon from '@mui/icons-material/ModeComment'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import GroupsIcon from '@mui/icons-material/Groups'
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom'
import MailOutlineIcon from '@mui/icons-material/MailOutlined'
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { FormattedMessage } from 'react-intl'
import {
  removeStory,
  getAllStories,
  unshareStory as unshare,
  storyVisibilityChange,
  setStoryUploadUnfinished,
} from 'Utilities/redux/storiesReducer'
import { callApi } from 'Utilities/apiConnection'
import { getTextStyle, images, learningLanguageSelector } from 'Utilities/common'
import CustomTooltip from 'Components/CustomTooltip'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import ShareStory from 'Components/StoryView/ShareStory'
import StoryDetailsModal from 'Components/StoryView/StoryDetailsModal'
import DifficultyStars from 'Components/DifficultyStars'
import { cancelControlledStory } from 'Utilities/redux/controlledPracticeReducer'
import './LibraryView.scss'

const liveDescriptionCache = {}

const StoryTitle = ({
  story,
  triggerContent,
  setShareModalOpen,
  inGroupLibrary,
  currentGroup,
  libraryShown,
  setConfirmationOpen,
  storyGroupShareInfo,
  handleControlledStoryCancel,
  setSharedStoryVisibility,
  savedLibrarySelection,
}) => {
  const { user, teacherView } = useSelector(({ user }) => user.data)
  const { email: userEmail } = user
  const isControlledStory = !!story?.control_story
  const showDeleteButton = libraryShown.private || (!libraryShown.public && teacherView)
  const showShareButton = !story.public && !inGroupLibrary && userEmail !== 'anonymous_email'
  const showCreateControlStoryButton =
    teacherView && !isControlledStory && story.user === user?.oid && !story.flashcardsOnly
  const showCancelControlStoryButton =
    teacherView && isControlledStory && story.user === user?.oid && !story.flashcardsOnly

  const handleDelete = () => setConfirmationOpen(true)

  return (
    <StoryDetailsModal
      trigger={triggerContent}
      story={story}
      setShareModalOpen={setShareModalOpen}
      showShareButton={showShareButton}
      showDeleteButton={showDeleteButton}
      showCreateControlStoryButton={showCreateControlStoryButton}
      showCancelControlStoryButton={showCancelControlStoryButton}
      handleDelete={handleDelete}
      inGroupLibrary={inGroupLibrary}
      isTeacher={teacherView}
      currentGroup={currentGroup}
      handleControlledStoryCancel={handleControlledStoryCancel}
      hidden={(storyGroupShareInfo && storyGroupShareInfo.hidden) || false}
      setSharedStoryVisibility={setSharedStoryVisibility}
      user={user}
      savedLibrarySelection={savedLibrarySelection}
    />
  )
}

const ShareInfoPopupContent = ({ infoObj }) => {
  return (
    <Box>
      <b>
        <FormattedMessage id="shared-by" />:
      </b>{' '}
      {infoObj?.sender}
      <br />
      <b>
        <FormattedMessage id="message" />:
      </b>{' '}
      {infoObj?.message}
    </Box>
  )
}

const GroupsSharedTo = ({ groups }) => {
  return (
    <CustomTooltip
      placement="top"
      title={
        <Box>
          <FormattedMessage id="shared-with-following-groups" />
          <ul>
            {groups.map(({ group_name: groupName, group_id: id }) => (
              <li key={id}>{groupName}</li>
            ))}
          </ul>
        </Box>
      }
    >
      <GroupsIcon color="primary" sx={{ mr: '15px' }} />
    </CustomTooltip>
  )
}

const StoryListItem = ({
  story,
  libraryShown,
  selectedGroup,
  savedLibrarySelection,
  draggable = true,
  isDragging = false,
  onDragEnd = () => {},
  onDragStart = () => {},
}) => {
  const dispatch = useDispatch()
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [processingDescription, setProcessingDescription] = useState(
    () => liveDescriptionCache[story._id] || null,
  )
  const { groups } = useSelector(({ groups }) => groups)
  const userId = useSelector(({ user }) => user.data.user.oid)
  const learningLanguage = useSelector(learningLanguageSelector)
  const isControlledStory = !!story?.control_story
  const currentGroup = groups.find(g => g.group_id === selectedGroup)
  const inGroupLibrary = libraryShown.group && !!story.groups
  const showGroupNames = story.groups && libraryShown.private
  const uploadUnfinished = story?.uploadUnfinished
  const isUnderProcessingDescription =
    typeof story?.description === 'string' &&
    story.description.trim().toLowerCase().includes('under processing')
  const shouldPollForLiveDescription =
    uploadUnfinished || (isUnderProcessingDescription && !processingDescription)
  const timedExercise = story?.timed_exercise
  const commentsOnStory = story?.annotation_count > 0
  const deleteStory = () => dispatch(removeStory(story._id))
  const unshareStory = () => dispatch(unshare(selectedGroup, story._id))

  useEffect(() => {
    setProcessingDescription(liveDescriptionCache[story._id] || null)
  }, [story._id])

  useEffect(() => {
    if (!shouldPollForLiveDescription) return

    let cancelled = false

    const pollLoadingDescription = async () => {
      try {
        const response = await callApi(`/stories/${story._id}/loading`)
        const data = response?.data || {}
        if (cancelled) return

        const progress = Number(data.progress)
        const isReady = data.exercise_ready || progress === 1
        const generatedDescription = data.story?.description

        if (isReady && generatedDescription) {
          liveDescriptionCache[story._id] = generatedDescription
          setProcessingDescription(generatedDescription)
          dispatch(setStoryUploadUnfinished(false, story._id))
        }
      } catch {
        // Keep polling; intermittent loading endpoint failures should not break the card UI.
      }
    }

    pollLoadingDescription()
    const interval = setInterval(pollLoadingDescription, 5000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [dispatch, shouldPollForLiveDescription, story._id])

  const handleControlledStoryCancel = async () => {
    await dispatch(cancelControlledStory(story._id))
    dispatch(
      getAllStories(learningLanguage, {
        sort_by: 'date',
        order: -1,
      }),
    )
  }

  const setSharedStoryVisibility = async (storyId, visibility) => {
    await dispatch(storyVisibilityChange(selectedGroup, storyId, visibility))
    dispatch(
      getAllStories(learningLanguage, {
        sort_by: 'date',
        order: -1,
      }),
    )
  }

  const storyGroupShareInfo = libraryShown.group
    ? story.groups.find(g => g?.group_id === currentGroup?.group_id)
    : null

  // Reading coverage (0–1) drives the 10-segment progress bar and the "Progress X%" label.
  const progressPct = Math.max(0, Math.min(100, Math.round((story?.percent_cov || 0) * 100)))
  const filledSegments = Math.round(progressPct / 10)

  return (
    <Card
      key={story._id}
      data-cy={`library-story-card-${story._id}`}
      className={`library-item-card ${
        isControlledStory ? 'card-controlled-story' : ''
      } ${isDragging ? 'library-story-card-dragging' : ''} tour-story-card`}
      elevation={0}
      draggable={draggable}
      onDragEnd={onDragEnd}
      onDragStart={event => {
        if (!draggable) return
        onDragStart(story._id, event)
      }}
    >
      <StoryTitle
        story={story}
        setConfirmationOpen={setConfirmationOpen}
        setShareModalOpen={setShareModalOpen}
        inGroupLibrary={inGroupLibrary}
        currentGroup={currentGroup}
        libraryShown={libraryShown}
        storyGroupShareInfo={storyGroupShareInfo}
        handleControlledStoryCancel={handleControlledStoryCancel}
        setSharedStoryVisibility={setSharedStoryVisibility}
        savedLibrarySelection={savedLibrarySelection}
        triggerContent={
          <div className="library-item-body library-tour-open-story-modal" role="button" tabIndex={0}>
            <img src={images.bookOpenGreen} alt="" className="library-item-icon" />
            <div className="library-item-main">
              <div className="library-item-toprow">
                <span className="library-item-title" style={getTextStyle(learningLanguage)}>
                  {story.title}
                </span>
                <div className="library-item-badges library-tour-difficulty-stars">
                  {story.flashcardsOnly && <ContentCopyIcon fontSize="small" />}
                  {showGroupNames && <GroupsSharedTo groups={story.groups} />}
                  {uploadUnfinished && (
                    <CustomTooltip title={<FormattedMessage id="story-not-yet-processed" />}>
                      <HourglassBottomIcon color="warning" fontSize="small" />
                    </CustomTooltip>
                  )}
                  {libraryShown.group && storyGroupShareInfo?.hidden && (
                    <CustomTooltip title={<FormattedMessage id="group-hidden-story" />}>
                      <VisibilityOffIcon color="error" fontSize="small" />
                    </CustomTooltip>
                  )}
                  {timedExercise && (
                    <CustomTooltip title={<FormattedMessage id="timed-practice-explanation" />}>
                      <TimerOutlinedIcon color="error" fontSize="small" />
                    </CustomTooltip>
                  )}
                  {commentsOnStory && (
                    <CustomTooltip title={<FormattedMessage id="comments-on-story-explanation" />}>
                      <CommentsIcon fontSize="small" />
                    </CustomTooltip>
                  )}
                  {libraryShown.group && (
                    <CustomTooltip title={<ShareInfoPopupContent infoObj={storyGroupShareInfo} />}>
                      <MailOutlineIcon fontSize="small" />
                    </CustomTooltip>
                  )}
                  {!libraryShown.group && story?.sharedwith?.includes(userId) && !story?.public && (
                    <CustomTooltip title={<ShareInfoPopupContent infoObj={story.sharing_info} />}>
                      <MailOutlineIcon fontSize="small" />
                    </CustomTooltip>
                  )}
                  <img
                    src={story?.has_questions ? images.bulb : images.bulbEmpty}
                    alt=""
                    className="library-item-bulb"
                  />
                  <DifficultyStars difficulty={story.difficulty} />
                </div>
              </div>
              <div className="library-item-progress">
                <span className="library-item-progress-label">
                  <FormattedMessage id="Progress" /> {progressPct}%
                </span>
                <div className="library-item-progressbar" aria-hidden="true">
                  {Array.from({ length: 10 }).map((_, index) => (
                    <span
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      className={`library-item-seg ${index < filledSegments ? 'is-filled' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
      />

      <ShareStory story={story} isOpen={shareModalOpen} setOpen={setShareModalOpen} />
      <ConfirmationWarning
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        storyId={story._id}
        action={inGroupLibrary ? unshareStory : deleteStory}
      >
        {inGroupLibrary && currentGroup ? (
          <FormattedMessage
            id="remove-story-from-group-warning"
            values={{ group: currentGroup.groupName }}
          />
        ) : (
          <FormattedMessage id="story-remove-confirm" />
        )}
      </ConfirmationWarning>
    </Card>
  )
}

export default StoryListItem
