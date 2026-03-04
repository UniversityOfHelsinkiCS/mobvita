import React from 'react'
import { Button, Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'

const StoryInputOptions = ({ closeModal, lesson_topics, userIsAnonymous, setActiveComponent }) => {
  return (
    <>
      {userIsAnonymous && (
        <div style={{ color: 'red', marginBottom: '1em' }}>
          <FormattedMessage id="warning-for-anonymous-users" />
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Button
            className="add-new-story-button"
            onClick={() => setActiveComponent('web')}
            primary
          >
            <Icon name="cloud upload" style={{ marginRight: '8px' }} />
            <FormattedMessage id="upload-from-web" />
          </Button>
          <Button
            className="add-new-story-button"
            onClick={() => setActiveComponent('file')}
            primary
          >
            <Icon name="file upload" style={{ marginRight: '8px' }} />
            <FormattedMessage id="upload-stories" />
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Button
            className="add-new-story-button"
            onClick={() => setActiveComponent('paste')}
            primary
          >
            <Icon name="paste" style={{ marginRight: '8px' }} />
            <FormattedMessage id="paste-a-text" />
          </Button>
          {lesson_topics?.length !== 0 && (
            <Button
              className="add-new-story-button"
              onClick={() => setActiveComponent('generate')}
              primary
            >
              <Icon name="magic" style={{ marginRight: '8px' }} />
              <FormattedMessage id="go-generating" />
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

export default StoryInputOptions
