import React from 'react'
import { Button } from 'semantic-ui-react'
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
            <FormattedMessage id="upload-from-web" />
          </Button>
          <Button
            className="add-new-story-button"
            onClick={() => setActiveComponent('file')}
            primary
          >
            <FormattedMessage id="upload-stories" />
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Button
            className="add-new-story-button"
            onClick={() => setActiveComponent('paste')}
            primary
          >
            <FormattedMessage id="paste-a-text" />
          </Button>
          {lesson_topics?.length !== 0 && (
            <Button
              className="add-new-story-button"
              onClick={() => setActiveComponent('generate')}
              primary
            >
              <FormattedMessage id="go-generating" />
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

export default StoryInputOptions
