import React from 'react'
import { Icon } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'

const StoryInputOptions = ({ closeModal, lesson_topics, userIsAnonymous, setActiveComponent }) => {
  const history = useHistory()

  const goToGeneratePage = () => {
    if (typeof closeModal === 'function') closeModal()
    history.push('/story-generation')
  }

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
          >
            <Icon name="cloud upload" style={{ marginRight: '8px' }} />
            <FormattedMessage id="upload-from-web" />
          </Button>
          <Button
            className="add-new-story-button"
            onClick={() => setActiveComponent('file')}
          >
            <Icon name="file upload" style={{ marginRight: '8px' }} />
            <FormattedMessage id="upload-stories" />
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Button
            className="add-new-story-button"
            onClick={() => setActiveComponent('paste')}
          >
            <Icon name="paste" style={{ marginRight: '8px' }} />
            <FormattedMessage id="paste-a-text" />
          </Button>
          {lesson_topics?.length !== 0 && (
            <Button
              className="add-new-story-button"
              onClick={goToGeneratePage}
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
