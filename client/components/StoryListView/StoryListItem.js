import React, { useState } from 'react'
import {
  Button, Header, Card, Icon, Accordion,
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
  return (
    <Card fluid key={story._id} style={{ marginBottom: '10px', marginTop: '10px', padding: '0.8em' }}>
      <Card.Content extra style={{ padding: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Header as="h4">{story.title}</Header>
        </div>
      </Card.Content>
      <Card.Content extra style={{ padding: '10px' }}>
        <span style={{ cursor: 'default', display: 'flex' }}>
          <FormattedMessage id="DIFFICULTY" />
          :
          {difficultyIcon}
          {difficultyText}
        </span>
      </Card.Content>
      <Card.Content extra>
        <div>
          <Link to={`/stories/${language}/${story._id}/`}>
            <Button color="teal" size="tiny">
              Read
            </Button>
          </Link>
          {' '}
          <Link to={`/stories/${language}/${story._id}/practice`}>
            <Button color="teal" size="tiny">
              Practice
            </Button>
          </Link>
          {' '}
          <Link to={`/stories/${language}/${story._id}/compete`}>
            <Button color="teal" size="tiny">
              Compete
            </Button>
          </Link>
        </div>
      </Card.Content>
      <Card.Content extra>
        {/* <Accordion fluid>
          <Accordion.Title onClick={() => setShow(!showInfo)} index={0}>
            Story info
          </Accordion.Title>
          <Accordion.Content active={showInfo} index={1} style={{ minHeight: '10em' }}>
            Placeholder text...
          </Accordion.Content>
        </Accordion> */}
      </Card.Content>
    </Card>
  )
}

export default StoryListItem
