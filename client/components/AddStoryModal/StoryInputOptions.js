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
    <div className="story-input-options-root">
      {userIsAnonymous && (
        <div className="story-input-options-anon-warning">
          <FormattedMessage id="warning-for-anonymous-users" />
        </div>
      )}

      <div className="story-input-options-center">
        <div className="story-input-options-stack">
          <div className="story-input-options-row">
            <Button className="add-new-story-button" onClick={() => setActiveComponent('web')}>
              <Icon name="cloud upload" style={{ marginRight: '8px' }} />
              <FormattedMessage id="upload-from-web" />
            </Button>
            <Button className="add-new-story-button" onClick={() => setActiveComponent('file')}>
              <Icon name="file upload" style={{ marginRight: '8px' }} />
              <FormattedMessage id="upload-stories" />
            </Button>
          </div>

          <div className="story-input-options-row">
            <Button className="add-new-story-button" onClick={() => setActiveComponent('paste')}>
              <Icon name="paste" style={{ marginRight: '8px' }} />
              <FormattedMessage id="paste-a-text" />
            </Button>
            {lesson_topics?.length !== 0 && (
              <Button className="add-new-story-button" onClick={goToGeneratePage}>
                <Icon name="magic" style={{ marginRight: '8px' }} />
                <FormattedMessage id="go-generating" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StoryInputOptions
