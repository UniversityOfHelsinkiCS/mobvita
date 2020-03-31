import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Header, Card, Icon, Accordion, List, Progress, Dropdown, Button as SemanticButton } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import { inProduction, hiddenFeatures } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'
import ShareStory from './ShareStory'

const StoryListItem = ({ story, userCanShare, libraryShown }) => {
  const { groups } = useSelector(({ groups }) => groups)
  const [modalOpen, setModalOpen] = useState(false)
  const icons = {
    high: <div><Icon name="star outline" size="large" style={{ color: 'red' }} /><Icon name="star outline" size="large" style={{ color: 'red' }} /><Icon name="star outline" size="large" style={{ color: 'red' }} /></div>,
    average: <div><Icon name="star outline" size="large" style={{ color: 'steelblue' }} /><Icon name="star outline" size="large" style={{ color: 'steelblue' }} /></div>,
    low: <div><Icon name="star outline" size="large" style={{ color: 'forestgreen' }} /></div>,
    default: <div><Icon name="star outline" size="large" style={{ color: 'black' }} /></div>,
  }

  const smallWindow = useWindowDimensions().width < 500

  const difficultyIcon = icons[story.difficulty || 'default']

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

  const showLearningSettingsButton = inGroupLibrary
    && groups.find(group => group.group_id === story.group.group_id).is_teaching

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
        <h5 className="story-item-title">{story.title}</h5>
        <div className="story-item-group">{story.group && story.group.group_name}</div>
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
                    {userCanShare && !story.public && !inGroupLibrary && (
                      <Dropdown.Item
                        text={<FormattedMessage id="Share" />}
                        onClick={() => setModalOpen(true)}
                        icon="share"
                      />
                    )}

                    {false && (
                      <Dropdown.Item
                        text={<FormattedMessage id="Delete" />}
                        className="delete-button"
                        style={{ backgroundColor: '#dd0000' }}
                        disabled
                        icon="trash alternate outline"
                      />
                    )}


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
                {userCanShare && !story.public && !inGroupLibrary
                  && (
                    <Button onClick={() => setModalOpen(true)} variant="terniary" style={{ marginRight: '0.5em' }}>
                      <FormattedMessage id="Share" />
                    </Button>
                  )
                }
                {showLearningSettingsButton
                  && (
                    <Button
                      variant="primary"
                      style={{ marginRight: '0.5em' }}
                      as={Link}
                      to={`/stories/${story._id}/concepts`}
                    >
                      <FormattedMessage id="learning-settings" />
                    </Button>
                  )
                }
                {false && (
                  <Button disabled onClick={() => console.log('Not implemented yet')} variant="primary" style={{ marginRight: '0.5em' }}>
                    <FormattedMessage id="Delete" />
                  </Button>
                )}
              </div>
            )
          }


          <span style={{ marginLeft: 'auto' }}>
            {difficultyIcon}
          </span>
          <ShareStory story={story} isOpen={modalOpen} setOpen={setModalOpen} />
        </div>
      </Card.Content>
    </Card>
  )
}

export default StoryListItem
