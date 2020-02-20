import React, { useState } from 'react'
import { Header, Card, Icon, Accordion, List, Progress, Button, Dropdown } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import { inProduction } from 'Utilities/common'
import useWindowDimensions from 'Utilities/windowDimensions'

const StoryListItem = ({ story }) => {
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
      <Card.Content extra style={{ padding: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h5>{story.title}</h5>
        </div>
      </Card.Content>
      <Card.Content extra style={{ padding: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          {smallWindow
            ? (
              <Button.Group>
                <Link to={`/stories/${story._id}/practice`}>
                  <Button variant="success">
                    <FormattedMessage id="practice" />
                  </Button>
                </Link>
                <Dropdown className="button icon" floating trigger={<React.Fragment />}>
                  <Dropdown.Menu>
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
              </Button.Group>
            )
            : (
              <div>
                <Link to={`/stories/${story._id}/`}>
                  <Button variant="primary" style={{ marginRight: '0.5em' }}>
                    <FormattedMessage id="Read" />
                  </Button>
                </Link>
                <Link to={`/stories/${story._id}/practice`}>
                  <Button variant="primary" style={{ marginRight: '0.5em' }}>
                    <FormattedMessage id="practice" />
                  </Button>
                </Link>
                <Link to={`/flashcards/${story._id}/`}>
                  <Button variant="primary" style={{ marginRight: '0.5em' }}>
                    <FormattedMessage id="Flashcards" />
                  </Button>
                </Link>
              </div>
            )
          }




          <span style={{ marginLeft: 'auto' }}>
            {difficultyIcon}
          </span>
        </div>
      </Card.Content>
    </Card>
  )
}

export default StoryListItem
