import React, { useState } from 'react'
import { Button, Header, Card, Icon, Accordion, List, Progress } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { FormattedMessage } from 'react-intl'

const StoryListItem = ({ story, language }) => {
  const [showInfo, setShow] = useState(false)

  const icons = {
    high: <Icon name="diamond" size="large" style={{ color: 'red' }} />,
    average: <Icon name="angle double up" size="large" style={{ color: 'red' }} />,
    low: <Icon name="angle up" size="large" style={{ color: 'forestgreen' }} />,
    default: <Icon name="question" style={{ color: 'black' }} />,
  }

  const difficultyIcon = icons[story.difficulty || 'default']
  const difficultyText = story.elo_score

  const storyInfoElements = [
    story.author ? `Author: ${story.author}` : null,
    story.URL ? <a href={story.URL}>Link to source</a> : null,
    `Difficulty: ${story.difficulty}`,
    `Story Rating: ${story.elo_score}`,
    `Date added ${moment(story.date).format('MMM Do YYYY')}`,
    <>
      % of exercises answered correctly
      <Progress />
    </>, // TODO add progress bar logic
    <>
      % of story covered
      <Progress />
    </>]

  const storyInfoList = storyInfoElements.map(element => <List.Item key={`${story._id}`}>{element}</List.Item>)
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
          <Header as="h5">{story.title}</Header>
        </div>
      </Card.Content>
      <Card.Content extra style={{ padding: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <Link to={`/stories/${language}/${story._id}/`}>
            <Button color="teal" size="tiny" style={{ marginTop: '5px' }}>
              Read
            </Button>
          </Link>
          {' '}
          <Link to={`/stories/${language}/${story._id}/practice`}>
            <Button color="teal" size="tiny" style={{ marginTop: '5px' }}>
              Practice
            </Button>
          </Link>
          <span style={{ marginLeft: 'auto' }}>
            {difficultyIcon}
          </span>
        </div>
      </Card.Content>
    </Card>
  )
}

export default StoryListItem
