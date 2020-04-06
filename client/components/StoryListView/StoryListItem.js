import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Icon, Progress, Dropdown, Button as SemanticButton } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import { removeStory } from 'Utilities/redux/storiesReducer'
import { unshareStory as unshare } from 'Utilities/redux/shareReducer'
import { inProduction, hiddenFeatures } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import DeleteConfirmationModal from 'Components/StoryListView/DeleteConfirmationModal'
import ShareStory from './ShareStory'
import DetailedStoryModal from './DetailedStoryModal'

const StoryListItem = ({ story, userCanShare, libraryShown }) => {
  const dispatch = useDispatch()
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const { groups } = useSelector(({ groups }) => groups)
  const icons = size => (
    {
      high: <div><Icon name="star outline" size={size} style={{ color: 'red' }} /><Icon name="star outline" size={size} style={{ color: 'red' }} /><Icon name="star outline" size={size} style={{ color: 'red' }} /></div>,
      average: <div><Icon name="star outline" size={size} style={{ color: 'steelblue' }} /><Icon name="star outline" size={size} style={{ color: 'steelblue' }} /></div>,
      low: <div><Icon name="star outline" size={size} style={{ color: 'forestgreen' }} /></div>,
      default: <div><Icon name="star outline" size={size} style={{ color: 'black' }} /></div>,
    }
  )

  const smallWindow = useWindowDimensions().width < 640

  const difficultyIcon = icons('large')[story.difficulty || 'default']

  const storyInfoElements = [
    story.author ? `Author: ${story.author}` : null,
    story.URL ? <a href={story.URL}><FormattedMessage id="source" /></a> : null,
    `Difficulty: ${story.difficulty}`,
    `Story Rating: ${story.elo_score}`,
    `Date added ${moment(story.date).format('MMM Do YYYY')}`,
    <>
      <FormattedMessage id="exercises-answered-correctly" />
      <Progress />
    </>, // TODO add progress bar logic
    <>
      <FormattedMessage id="part-of-story-covered" />
      <Progress />
    </>]

  const inGroupLibrary = libraryShown.group && story.group
  const isTeacher = inGroupLibrary && groups.find(g => g.group_id === story.group.group_id).is_teaching

  const showShareButton = userCanShare && !story.public && !inGroupLibrary

  const showDeleteButton = libraryShown.private || isTeacher
  const handleDelete = () => {
    setConfirmationOpen(true)
  }

  const deleteStory = () => {
    dispatch(removeStory(story._id))
  }

  const unshareStory = () => {
    dispatch(unshare(story.group.group_id, story._id))
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
      <Card.Content extra style={{ padding: '15px 15px 5px 15px', display: 'flex', justifyContent: 'space-between' }}>
        {smallWindow
          ? (
            <h5 className="story-item-title">{story.title}</h5>
          ) : (
            <DetailedStoryModal
              trigger={<h5 className="story-item-title">{story.title}</h5>}
              story={story}
              icons={icons}
              setShareModalOpen={setShareModalOpen}
              showShareButton={showShareButton}
              showDeleteButton={showDeleteButton}
              handleDelete={handleDelete}
              inGroupLibrary={inGroupLibrary}
            />
          )
        }
        <div className="story-item-group">{story.group && story.group.group_name}</div>
        {smallWindow && (showShareButton || showDeleteButton)
          && (
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
          )
        }
      </Card.Content>
      <Card.Content extra style={{ padding: '10px 15px 10px 15px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          {smallWindow
            ? (
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
                      text={<FormattedMessage id="Read" />}
                      as={Link}
                      to={`/stories/${story._id}/`}
                      icon="book"
                    />
                    <Dropdown.Item
                      text={<FormattedMessage id="Flashcards" />}
                      as={Link}
                      to={`/flashcards/${story._id}/`}
                      icon="id card"
                    />
                  </Dropdown.Menu>
                </Dropdown>
              </SemanticButton.Group>
            )
            : (
              <div>
                <Link to={`/stories/${story._id}/practice`}>
                  <Button variant="primary" style={{ marginRight: '0.5em' }}>
                    <FormattedMessage id="practice" />
                  </Button>
                </Link>
                <Link to={`/stories/${story._id}/`}>
                  <Button variant="secondary" style={{ marginRight: '0.5em' }}>
                    <FormattedMessage id="Read" />
                  </Button>
                </Link>
                <Link to={`/flashcards/${story._id}/`}>
                  <Button variant="secondary" style={{ marginRight: '0.5em' }}>
                    <FormattedMessage id="Flashcards" />
                  </Button>
                </Link>
              </div>
            )
          }


          <span style={{ marginLeft: 'auto' }}>
            {difficultyIcon}
          </span>
          <ShareStory story={story} isOpen={shareModalOpen} setOpen={setShareModalOpen} />
        </div>
      </Card.Content>
      <DeleteConfirmationModal
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        storyId={story._id}
        action={inGroupLibrary ? unshareStory : deleteStory}
      >
        <FormattedMessage id="this-will-permanently-remove-this-story-from-your-collection-are-you-sure-you-want-to-proceed" />
      </DeleteConfirmationModal>
    </Card>
  )
}

export default StoryListItem
