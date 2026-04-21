import React from 'react'
import { Icon } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import { useLocation } from 'react-router-dom'
import uploadFileIcon from '../../assets/images/upload-file.png'
import uploadWebIcon from '../../assets/images/upload-cloud.png'
import uploadPasteIcon from '../../assets/images/paste.png'
import generateAI from '../../assets/images/generate_ai.png'

const StoryInputOptions = ({ closeModal, lesson_topics, userIsAnonymous, setActiveComponent }) => {
  const navigate = useNavigate()

  const goToGeneratePage = () => {
    if (typeof closeModal === 'function') closeModal()
    navigate('/story-generation')
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
            <Button className="add-new-story-button" onClick={() => setActiveComponent('web')}>
              <img src={uploadWebIcon} alt="web upload" className='story-option-icon' />
              <FormattedMessage id="upload-from-web" />
            </Button>
            <Button className="add-new-story-button" onClick={() => setActiveComponent('file')}>
              <img src={uploadFileIcon} alt="file upload" className='story-option-icon' />
              <FormattedMessage id="upload-stories" />
            </Button>

            <Button className="add-new-story-button" onClick={() => setActiveComponent('paste')}>
              <img src={uploadPasteIcon} alt="paste" className='story-option-icon' />
              <FormattedMessage id="paste-a-text" />
            </Button>
            {lesson_topics?.length !== 0 && (
              <Button className="add-new-story-button" onClick={goToGeneratePage}>
                <img src={generateAI} alt="generate AI" className='story-option-icon' />
                <FormattedMessage id="go-generating" />
              </Button>
            )}
        </div>
      </div>
    </div>
  )
}

export default StoryInputOptions
