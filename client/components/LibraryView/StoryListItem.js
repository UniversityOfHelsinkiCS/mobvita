import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Dropdown, Button as SemanticButton } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { Link, useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { removeStory, unshareStory as unshare } from 'Utilities/redux/storiesReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import { getTextStyle, learningLanguageSelector, hiddenFeatures } from 'Utilities/common'
import ConfirmationWarning from 'Components/ConfirmationWarning'
import ShareStory from 'Components/StoryView/ShareStory'
import StoryDetailsModal from 'Components/StoryView/StoryDetailsModal'
import DifficultyStars from 'Components/DifficultyStars'

const StoryListItem = ({ story, userCanShare, libraryShown, selectedGroup }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const { groups } = useSelector(({ groups }) => groups)
  const learningLanguage = useSelector(learningLanguageSelector)

  const { width } = useWindowDimensions()
  const smallWindow = width < 640
  const showCrosswordsButton = width > 1023

  const currentGroup = groups.find(g => g.group_id === selectedGroup)

  const inGroupLibrary = libraryShown.group && story.groups
  const isTeacher = inGroupLibrary && currentGroup && currentGroup.is_teaching

  const showShareButton = userCanShare && !story.public && !inGroupLibrary

  const showDeleteButton = libraryShown.private || isTeacher
  const handleDelete = () => {
    setConfirmationOpen(true)
  }

  const showGroupName = story.groups && libraryShown.private

  const deleteStory = () => {
    dispatch(removeStory(story._id))
  }

  const unshareStory = () => {
    dispatch(unshare(selectedGroup, story._id))
  }

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
        {smallWindow ? (
          <h5
            className="story-item-title"
            onClick={() => history.push(`/stories/${story._id}`)}
            style={getTextStyle(learningLanguage)}
          >
            {story.title}
          </h5>
        ) : (
          <StoryDetailsModal
            trigger={
              <h5 className="story-item-title" style={getTextStyle(learningLanguage)}>
                {story.title}
              </h5>
            }
            story={story}
            setShareModalOpen={setShareModalOpen}
            showShareButton={showShareButton}
            showDeleteButton={showDeleteButton}
            handleDelete={handleDelete}
            inGroupLibrary={inGroupLibrary}
            currentGroup={currentGroup}
          />
        )}
        <div className="story-item-group">{showGroupName && story.groups[0]?.group_name}</div>
        {smallWindow && (showShareButton || showDeleteButton) && (
          <Dropdown
            direction="left"
            className="button icon basic"
            icon="edit"
            style={{ marginRight: '-1em', marginTop: '-1em', boxShadow: 'none' }}
          >
            <Dropdown.Menu>
              {showShareButton && (
                <Dropdown.Item
                  text={<FormattedMessage id="Share" />}
                  onClick={() => setShareModalOpen(true)}
                  icon="share"
                />
              )}
              {showDeleteButton && (
                <Dropdown.Item
                  text={<FormattedMessage id="Delete" />}
                  style={{ color: 'red' }}
                  icon="trash alternate outline"
                  onClick={handleDelete}
                />
              )}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </Card.Content>
      <Card.Content extra style={{ padding: '10px 15px 10px 15px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          {smallWindow ? (
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
                  <Dropdown.Item
                    text={<FormattedMessage id="Read" />}
                    as={Link}
                    to={`/stories/${story._id}/read`}
                    icon="book"
                  />
                </Dropdown.Menu>
              </Dropdown>
            </SemanticButton.Group>
          ) : (
            <div>
              <Link to={`/stories/${story._id}/practice`}>
                <Button variant="primary" style={{ marginRight: '0.5em' }}>
                  <FormattedMessage id="practice" />
                </Button>
              </Link>
              <Link to={`/flashcards/fillin/${story._id}/`}>
                <Button variant="primary" style={{ marginRight: '0.5em' }}>
                  <FormattedMessage id="Flashcards" />
                </Button>
              </Link>
              {showCrosswordsButton && (
                <Link to={`/crossword/${story._id}/`}>
                  <Button variant="secondary" style={{ marginRight: '0.5em' }}>
                    <FormattedMessage id="Crossword" />
                  </Button>
                </Link>
              )}
              <Link to={`/stories/${story._id}/read`}>
                <Button variant="secondary" style={{ marginRight: '0.5em' }}>
                  <FormattedMessage id="Read" />
                </Button>
              </Link>
            </div>
          )}

          <span style={{ marginLeft: 'auto' }}>
            <DifficultyStars difficulty={story.difficulty} size="large" />
          </span>
          <ShareStory story={story} isOpen={shareModalOpen} setOpen={setShareModalOpen} />
        </div>
      </Card.Content>
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
          <FormattedMessage id="this-will-permanently-remove-this-story-from-your-collection-are-you-sure-you-want-to-proceed" />
        )}
      </ConfirmationWarning>
    </Card>
  )
}

export default StoryListItem
