import React, { useState } from 'react'
import {
  Button, Header, Card, Icon, Accordion, List, Progress,
} from 'semantic-ui-react'
import { Link } from 'react-router-dom'

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
    `Author: ${story.author}`,
    <a href={story.URL}>Source</a>,
    `Difficulty: ${story.difficulty}`,
    `Story Rating: ${story.elo_score}`,
    `Date added ${story.date}`,
    <>% of exercises answered correctly <Progress /></>,
    <>% of story covered <Progress /></>]

  const storyInfoList = storyInfoElements.map((element, i) => <List.Item key={`${story._id}-${i}`}>{element}</List.Item>)
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
          <Header as="h4">{story.title}</Header>
        </div>
      </Card.Content>
      <Card.Content extra style={{ padding: '15px' }}>
        <span style={{ cursor: 'default', display: 'flex' }}>
          <FormattedMessage id="DIFFICULTY" />
          :
          {difficultyIcon}
          {difficultyText}
        </span>
      </Card.Content>
      <Card.Content extra style={{ padding: '15px' }}>
        <div>
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
          {' '}
          <Link to={`/stories/${language}/${story._id}/compete`}>
            <Button color="teal" size="tiny" style={{ marginTop: '5px' }}>
              Compete
            </Button>
          </Link>
        </div>
      </Card.Content>
      <Card.Content extra style={{ padding: '15px' }}>
        <Accordion fluid>
          <Accordion.Title onClick={() => setShow(!showInfo)} index={0}>
            Story info
          </Accordion.Title>
          <Accordion.Content active={showInfo} index={1} style={{ minHeight: '10em' }}>
            <List>
              {storyInfoList}
            </List>
          </Accordion.Content>
        </Accordion>
      </Card.Content>
    </Card>
  )
}

export default StoryListItem
