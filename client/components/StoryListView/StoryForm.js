import React, { useState } from 'react'
import { Form, Input, Card, Icon } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { postStory } from 'Utilities/redux/uploadProgressReducer'
import { capitalize, learningLanguageSelector } from 'Utilities/common'
import { FormattedMessage, useIntl } from 'react-intl'
import { setNotification } from 'Utilities/redux/notificationReducer'
import { Button } from 'react-bootstrap'


const StoryForm = () => {
  const intl = useIntl()
  const [storyUrl, setStoryUrl] = useState('')
  const dispatch = useDispatch()

  const learningLanguage = useSelector(learningLanguageSelector)

  const handleStorySubmit = (event) => {
    event.preventDefault()

    const newStory = {
      language: capitalize(learningLanguage),
      url: storyUrl,
    }
    dispatch(postStory(newStory))
    dispatch(setNotification('Validating url-address', 'info'))
    setStoryUrl('')
  }

  return (
    <Card
      fluid
      key="storyform"
      style={{
        marginBottom: '10px',
        marginTop: '10px',
        height: 'max-content',
      }}
    >
      <Card.Content extra style={{ padding: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <h5><FormattedMessage id="add-your-stories" /></h5>
        </div>
      </Card.Content>
      <Card.Content extra style={{ padding: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <div style={{ flexBasis: '100%' }}>
            <Form onSubmit={handleStorySubmit}>
              <Input
                fluid
                placeholder={intl.formatMessage({ id: 'enter-web-address' })}
                value={storyUrl}
                onChange={event => setStoryUrl(event.target.value)}
                data-cy="new-story-input"
              />
              <Button style={{ marginTop: '0.5em' }} variant="primary" type="submit" data-cy="submit-story">
                <FormattedMessage id="Confirm" />
              </Button>
            </Form>
          </div>
        </div>
      </Card.Content>
    </Card>
  )
}

export default StoryForm
