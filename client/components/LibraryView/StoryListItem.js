import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Dropdown, Button as SemanticButton, Icon, Popup } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { removeStory, getAllStories, unshareStory as unshare } from 'Utilities/redux/storiesReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import { getTextStyle, learningLanguageSelector } from 'Utilities/common'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import ShareStory from 'Components/StoryView/ShareStory'
import StoryDetailsModal from 'Components/StoryView/StoryDetailsModal'
import DifficultyStars from 'Components/DifficultyStars'
import { cancelControlledStory } from 'Utilities/redux/controlledPracticeReducer'

const StoryTitle = ({
  story,
  setShareModalOpen,
  inGroupLibrary,
  currentGroup,
  libraryShown,
  setConfirmationOpen,
  userTeachesAGroup,
  handleControlledStoryCancel,
}) => {
  const learningLanguage = useSelector(learningLanguageSelector)
  const { email: userEmail } = useSelector(({ user }) => user.data.user)
  const user = useSelector(({ user }) => user.data.user)
  const isTeacher = inGroupLibrary && currentGroup && currentGroup.is_teaching
  const isTeacherInPrivateLibrary = userTeachesAGroup && libraryShown.private
  const isControlledStory = !!story?.control_story
  const showDeleteButton = libraryShown.private || isTeacher
  const showShareButton = !story.public && !inGroupLibrary && userEmail !== 'anonymous_email'
  const showCreateControlStoryButton =
    isTeacherInPrivateLibrary && !isControlledStory && story.user === user?.oid
  const showCancelControlStoryButton =
    isTeacherInPrivateLibrary && isControlledStory && story.user === user?.oid

  const handleDelete = () => setConfirmationOpen(true)

  return (
    <StoryDetailsModal
      trigger={
        <span className="space-between" style={{ overflow: 'hidden', width: '100%' }}>
          <Icon color="grey" name="ellipsis vertical" className="story-item-dots" />
          <h5
            className="story-item-title"
            style={{ marginBottom: '.5rem', ...getTextStyle(learningLanguage) }}
          >
            {story.title}
          </h5>
        </span>
      }
      story={story}
      setShareModalOpen={setShareModalOpen}
      showShareButton={showShareButton}
      showDeleteButton={showDeleteButton}
      showCreateControlStoryButton={showCreateControlStoryButton}
      showCancelControlStoryButton={showCancelControlStoryButton}
      handleDelete={handleDelete}
      inGroupLibrary={inGroupLibrary}
      isTeacher={isTeacher}
      currentGroup={currentGroup}
      handleControlledStoryCancel={handleControlledStoryCancel}
    />
  )
}

const ShareInfoPopupContent = ({ infoObj }) => {
  return (
    <div>
      <b>
        <FormattedMessage id="shared-by" />:
      </b>{' '}
      {infoObj?.sender}
      <br />
      <b>
        <FormattedMessage id="message" />:
      </b>{' '}
      {infoObj?.message}
    </div>
  )
}

const StoryFunctionsDropdown = ({
  story,
  practiceLink,
  teacherInGroupView,
  inGroupLibrary,
  enableOnlyPractice,
}) => {
  return (
    <SemanticButton.Group>
      {teacherInGroupView ? (
        <SemanticButton
          as={Link}
          to={`/stories/${story._id}/group/review`}
          style={{ backgroundColor: 'rgb(50, 170, 248)', color: 'white' }}
        >
          <FormattedMessage id="review" />
        </SemanticButton>
      ) : (
        <SemanticButton
          as={Link}
          to={practiceLink}
          style={{ backgroundColor: 'rgb(50, 170, 248)', color: 'white' }}
        >
          <FormattedMessage id="practice" />
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
        <Dropdown.Menu className="story-item-dropdown">
          {teacherInGroupView && (
            <Dropdown.Item
              text={<FormattedMessage id="practice" />}
              as={Link}
              to={practiceLink}
              icon="pencil alternate"
            />
          )}
          <Dropdown.Item
            text={<FormattedMessage id="preview" />}
            as={Link}
            to={
              inGroupLibrary
                ? `/stories/${story._id}/group/preview`
                : `/stories/${story._id}/preview`
            }
            icon="book"
          />
          {story.percent_cov > 0 && !teacherInGroupView && (
            <Dropdown.Item
              text={<FormattedMessage id="review" />}
              as={Link}
              to={`/stories/${story._id}/review`}
              icon="book"
            />
          )}
          <Dropdown.Item
            text={<FormattedMessage id="Flashcards" />}
            as={Link}
            to={`/flashcards/fillin/${story._id}/`}
            icon="lightning"
          />
          <Dropdown.Item
            text={<FormattedMessage id="compete" />}
            as={Link}
            to={`/stories/${story._id}/compete`}
            icon="clock"
          />
        </Dropdown.Menu>
      </Dropdown>
    </SemanticButton.Group>
  )
}

const StoryActions = ({
  story,
  currentGroup,
  enableOnlyPractice,
  isControlled,
  inGroupLibrary,
  isTeacher,
}) => {
  const { width } = useWindowDimensions()

  const showCrosswordsButton = width > 1023
  const buttonVariant = enableOnlyPractice ? 'outline-secondary' : 'secondary'
  const uploadUnfinished = story?.uploadUnfinished
  const teacherInGroupView = isTeacher && inGroupLibrary
  const reviewButtonVariant =
    story.percent_cov === 0 || enableOnlyPractice ? 'outline-secondary' : 'secondary'

  const practiceLink = isControlled
    ? `/stories/${story._id}/controlled-practice`
    : `/stories/${story._id}/preview`
  // : `/stories/${story._id}/practice`

  if (width >= 640) {
    return (
      <div className="story-actions">
        <Link to={practiceLink}>
          <Button variant={teacherInGroupView ? 'secondary' : 'primary'}>
            <FormattedMessage id="practice" />
          </Button>
        </Link>

        <Link to={`/flashcards/fillin/${story._id}/`}>
          <Button
            variant={teacherInGroupView ? 'secondary' : 'primary'}
            disabled={enableOnlyPractice}
          >
            <FormattedMessage id="Flashcards" />
          </Button>
        </Link>
        {inGroupLibrary ? (
          <Link to={`/stories/${story._id}/group/preview`}>
            <Button
              variant={teacherInGroupView ? 'primary' : buttonVariant}
              disabled={enableOnlyPractice}
            >
              <FormattedMessage id="preview" />
            </Button>
          </Link>
        ) : (
          <Link to={`/stories/${story._id}/preview`}>
            <Button variant={buttonVariant} disabled={enableOnlyPractice}>
              <FormattedMessage id="preview" />
            </Button>
          </Link>
        )}
        {inGroupLibrary ? (
          <Link to={`/stories/${story._id}/group/review`}>
            <Button variant={teacherInGroupView ? 'primary' : reviewButtonVariant}>
              <FormattedMessage id="review" />{' '}
            </Button>
          </Link>
        ) : (
          <Link to={`/stories/${story._id}/review`}>
            <Button
              variant={reviewButtonVariant}
              disabled={story.percent_cov === 0 || enableOnlyPractice}
            >
              <FormattedMessage id="review" />{' '}
            </Button>
          </Link>
        )}
        <Link to={`/stories/${story._id}/compete`}>
          <Button
            variant={uploadUnfinished || teacherInGroupView ? 'outline-secondary' : buttonVariant}
            disabled={enableOnlyPractice || uploadUnfinished || teacherInGroupView}
          >
            <FormattedMessage id="compete" />{' '}
          </Button>
        </Link>

        {showCrosswordsButton && (
          <Link to={`/crossword/${story._id}/`}>
            <Button
              variant={uploadUnfinished || teacherInGroupView ? 'outline-secondary' : buttonVariant}
              disabled={enableOnlyPractice || uploadUnfinished || teacherInGroupView}
            >
              <FormattedMessage id="Crossword" />
            </Button>
          </Link>
        )}
      </div>
    )
  }

  return (
    <StoryFunctionsDropdown
      story={story}
      practiceLink={practiceLink}
      teacherInGroupView={teacherInGroupView}
      inGroupLibrary={inGroupLibrary}
      enableOnlyPractice={enableOnlyPractice}
    />
  )
}

const GroupsSharedTo = ({ groups }) => {
  return (
    <div>
      <Popup
        position="top right"
        content={
          <div>
            <FormattedMessage id="shared-with-following-groups" />
            <ul>
              {groups.map(({ group_name: groupName, group_id: id }) => (
                <li key={id}>{groupName}</li>
              ))}
            </ul>
          </div>
        }
        trigger={<Icon size="large" color="black" name="users" />}
      />
    </div>
  )
}

const StoryListItem = ({ story, libraryShown, selectedGroup }) => {
  const dispatch = useDispatch()
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const { groups } = useSelector(({ groups }) => groups)
  const { user: userId } = useSelector(({ user }) => ({ user: user.data.user.oid }))
  const learningLanguage = useSelector(learningLanguageSelector)
  const userTeachesAGroup = groups.some(group => group.is_teaching) // definition of being teacher
  const isControlledStory = !!story?.control_story
  const currentGroup = groups.find(g => g.group_id === selectedGroup)
  const inGroupLibrary = libraryShown.group && !!story.groups
  const showGroupNames = story.groups && libraryShown.private
  const enableOnlyPractice = inGroupLibrary && !currentGroup?.is_teaching && isControlledStory
  const uploadUnfinished = story?.uploadUnfinished
  const timedExercise = story?.timed_exercise
  const commentsOnStory = story?.annotation_count > 0
  const deleteStory = () => dispatch(removeStory(story._id))
  const unshareStory = () => dispatch(unshare(selectedGroup, story._id))

  const handleControlledStoryCancel = async () => {
    await dispatch(cancelControlledStory(story._id))
    dispatch(
      getAllStories(learningLanguage, {
        sort_by: 'date',
        order: -1,
      })
    )
  }

  const storyGroupShareInfo = libraryShown.group
    ? story.groups.find(g => g?.group_id === currentGroup?.group_id)
    : null

  return (
    <Card fluid key={story._id} className={`${isControlledStory ? 'card-controlled-story' : ''}`}>
      <Card.Content extra className="story-card-title-cont">
        <StoryTitle
          story={story}
          setConfirmationOpen={setConfirmationOpen}
          setShareModalOpen={setShareModalOpen}
          inGroupLibrary={inGroupLibrary}
          currentGroup={currentGroup}
          libraryShown={libraryShown}
          userTeachesAGroup={userTeachesAGroup}
          handleControlledStoryCancel={handleControlledStoryCancel}
        />
      </Card.Content>
      <Card.Content extra className="story-card-actions-cont">
        <StoryActions
          story={story}
          currentGroup={currentGroup}
          enableOnlyPractice={enableOnlyPractice}
          isControlled={isControlledStory}
          inGroupLibrary={inGroupLibrary}
          isTeacher={inGroupLibrary && currentGroup && currentGroup.is_teaching}
        />
        <div className="flex align-center" style={{ overflow: 'hidden' }}>
          {showGroupNames && <GroupsSharedTo groups={story.groups} />}

          {uploadUnfinished && (
            <div>
              <Popup
                position="top center"
                content={<FormattedMessage id="story-not-yet-processed" />}
                trigger={
                  <div>
                    <Icon name="hourglass half" color="black" />
                  </div>
                }
              />
            </div>
          )}

          {timedExercise && (
            <Popup
              basic
              content={<FormattedMessage id="timed-practice-explanation" />}
              trigger={
                <div>
                  <Icon color="black" name="clock outline" />
                </div>
              }
            />
          )}
          {commentsOnStory && (
            <Popup
              basic
              content={<FormattedMessage id="comments-on-story-explanation" />}
              trigger={
                <div>
                  <Icon color="black" name="comments" />
                </div>
              }
            />
          )}

          {libraryShown.group && (
            <>
              <Popup
                basic
                content={<ShareInfoPopupContent infoObj={storyGroupShareInfo} />}
                trigger={
                  <div>
                    <Icon color="black" name="envelope outline" />
                  </div>
                }
              />
            </>
          )}

          {!libraryShown.group && story?.sharedwith?.includes(userId) && (
            <Popup
              basic
              content={<ShareInfoPopupContent infoObj={story.sharing_info} />}
              trigger={
                <div>
                  <Icon color="black" name="envelope outline" />
                </div>
              }
            />
          )}
          <DifficultyStars
            difficulty={story.difficulty}
            style={{ whiteSpace: 'nowrap', marginLeft: '1em' }}
          />
        </div>
      </Card.Content>

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
