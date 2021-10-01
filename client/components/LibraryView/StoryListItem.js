import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Dropdown, Button as SemanticButton, Icon, Popup } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { removeStory, unshareStory as unshare } from 'Utilities/redux/storiesReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import { getTextStyle, learningLanguageSelector, hiddenFeatures } from 'Utilities/common'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import ShareStory from 'Components/StoryView/ShareStory'
import StoryDetailsModal from 'Components/StoryView/StoryDetailsModal'
import DifficultyStars from 'Components/DifficultyStars'

const StoryTitle = ({
  story,
  setShareModalOpen,
  userCanShare,
  inGroupLibrary,
  currentGroup,
  libraryShown,
  setConfirmationOpen,
}) => {
  const { width } = useWindowDimensions()
  const learningLanguage = useSelector(learningLanguageSelector)

  const { email: userEmail } = useSelector(({ user }) => user.data.user)

  const handleDelete = () => {
    setConfirmationOpen(true)
  }

  const isTeacher = inGroupLibrary && currentGroup && currentGroup.is_teaching

  const showShareButton =
    !!userCanShare && !story.public && !inGroupLibrary && userEmail !== 'anonymous_email'

  const showDeleteButton = libraryShown.private || isTeacher

  if (width >= 640) {
    return (
      <StoryDetailsModal
        trigger={
          <span className="space-between" style={{ overflow: 'hidden', width: '100%' }}>
            <h5
              className="story-item-title"
              style={{ marginBottom: '.5rem', ...getTextStyle(learningLanguage) }}
            >
              {story.title}
            </h5>
            <Icon name="ellipsis vertical" style={{ marginLeft: '1rem' }} />
          </span>
        }
        story={story}
        setShareModalOpen={setShareModalOpen}
        showShareButton={showShareButton}
        showDeleteButton={showDeleteButton}
        handleDelete={handleDelete}
        inGroupLibrary={inGroupLibrary}
        currentGroup={currentGroup}
      />
    )
  }

  return (
    <Link
      to={`/stories/${story._id}`}
      className="space-between"
      style={{ overflow: 'hidden', width: '100%' }}
    >
      <h5 className="story-item-title" style={getTextStyle(learningLanguage)}>
        {story.title}
      </h5>
      <Icon name="ellipsis vertical" style={{ marginLeft: '1rem' }} />
    </Link>
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

const StoryActions = ({ story }) => {
  const { width } = useWindowDimensions()

  const showCrosswordsButton = width > 1023

  if (width >= 640) {
    return (
      <div className="story-actions">
        {story.percent_cov === 0 && (
          <Link to={`/stories/${story._id}/read`}>
            <Button variant="secondary">
              <FormattedMessage id="Read" />
            </Button>
          </Link>
        )}
        <Link to={`/stories/${story._id}/practice`}>
          <Button variant="primary">
            <FormattedMessage id="practice" />
          </Button>
        </Link>
        {story.percent_cov > 0 && (
          <Link to={`/stories/${story._id}/review`}>
            <Button variant="secondary">
              <FormattedMessage id="review" />
            </Button>
          </Link>
        )}
        <Link to={`/flashcards/fillin/${story._id}/`}>
          <Button variant="primary">
            <FormattedMessage id="Flashcards" />
          </Button>
        </Link>
        <Link to={`/compete/${story._id}/`}>
          <Button variant="secondary">
            <FormattedMessage id="compete" />
          </Button>
        </Link>
        {/* {hiddenFeatures && (
          <Link to={`/stories/${story._id}/preview`}>
            <Button variant="secondary">β</Button>
          </Link>
        )} */}
        {showCrosswordsButton && (
          <Link to={`/crossword/${story._id}/`}>
            <Button variant="secondary">
              <FormattedMessage id="Crossword" />
            </Button>
          </Link>
        )}
      </div>
    )
  }

  return (
    <SemanticButton.Group>
      <SemanticButton
        as={Link}
        to={`/stories/${story._id}/practice`}
        style={{ backgroundColor: 'hsla(208, 56%, 55%, 1)', color: 'white' }}
      >
        <FormattedMessage id="practice" />
      </SemanticButton>
      <Dropdown
        className="button icon"
        style={{ backgroundColor: 'rgb(97, 166, 226)', color: 'white' }}
        floating
        trigger={<React.Fragment />}
      >
        <Dropdown.Menu className="story-item-dropdown">
          <Dropdown.Item
            text={<FormattedMessage id="Flashcards" />}
            as={Link}
            to={`/flashcards/fillin/${story._id}/`}
            icon="id card"
          />
          {story.percent_cov > 0 && (
            <Dropdown.Item
              text={<FormattedMessage id="review" />}
              as={Link}
              to={`/stories/${story._id}/review`}
              icon="book"
            />
          )}
          {story.percent_cov === 0 && (
            <Dropdown.Item
              text={<FormattedMessage id="Read" />}
              as={Link}
              to={`/stories/${story._id}/read`}
              icon="book"
            />
          )}
          <Dropdown.Item
            text={<FormattedMessage id="compete" />}
            as={Link}
            to={`/compete/${story._id}/`}
            icon="lightning"
          />
        </Dropdown.Menu>
      </Dropdown>
    </SemanticButton.Group>
  )
}

const GroupsSharedTo = ({ groups }) => {
  const groupsToShow =
    groups.length > 3 ? groups.slice(2).concat({ group_name: '...', group_id: 'ellipsis' }) : groups

  return (
    <div
      className="flex-col"
      style={{ padding: '0 .5rem', fontSize: '.7rem', overflow: 'hidden', whiteSpace: 'nowrap' }}
    >
      {groupsToShow.map(({ group_name: groupName, group_id: id }) => (
        <span key={id} style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {groupName}
        </span>
      ))}
    </div>
  )
}

const StoryListItem = ({ story, userCanShare, libraryShown, selectedGroup }) => {
  const dispatch = useDispatch()
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const { groups } = useSelector(({ groups }) => groups)
  const { user: userId } = useSelector(({ user }) => ({ user: user.data.user.oid }))

  const currentGroup = groups.find(g => g.group_id === selectedGroup)
  const inGroupLibrary = libraryShown.group && story.groups
  const showGroupNames = story.groups && libraryShown.private

  const deleteStory = () => {
    dispatch(removeStory(story._id))
  }

  const unshareStory = () => {
    dispatch(unshare(selectedGroup, story._id))
  }

  const storyGroupShareInfo = libraryShown.group
    ? story.groups.find(g => g?.group_id === currentGroup?.group_id)
    : null

  return (
    <Card
      fluid
      key={story._id}
      style={{
        marginBottom: '10px',
        marginTop: '10px',
        height: 'max-content',
      }}
    >
      <Card.Content
        extra
        style={{ padding: '15px 15px 5px 15px', display: 'flex', justifyContent: 'space-between' }}
      >
        <StoryTitle
          story={story}
          setConfirmationOpen={setConfirmationOpen}
          setShareModalOpen={setShareModalOpen}
          userCanShare={userCanShare}
          inGroupLibrary={inGroupLibrary}
          currentGroup={currentGroup}
          libraryShown={libraryShown}
        />
      </Card.Content>
      <Card.Content
        extra
        style={{
          padding: '10px 15px 10px 15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <StoryActions story={story} />
        <div className="flex align-center" style={{ overflow: 'hidden' }}>
          {showGroupNames && <GroupsSharedTo groups={story.groups} />}

          {libraryShown.group && (
            <>
              <Popup
                basic
                content={<ShareInfoPopupContent infoObj={storyGroupShareInfo} />}
                trigger={
                  <div>
                    <Icon name="envelope outline" />
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
                  <Icon name="envelope outline" />
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
