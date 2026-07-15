import React from 'react'
import AppButton from 'Components/AppButton'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { ACCESS, useHasAccess } from 'Utilities/common'
import uploadFileIcon from '../../assets/images/upload-file.png'
import uploadWebIcon from '../../assets/images/upload-cloud.png'
import uploadPasteIcon from '../../assets/images/paste.png'
import generateAI from '../../assets/images/generate_ai.png'

const StoryInputOptions = ({ closeModal, lesson_topics, userIsAnonymous, setActiveComponent }) => {
  const navigate = useNavigate()
  // Generate-story button is for registered+ users (hidden for access <= 0).
  const canGenerate = useHasAccess(ACCESS.REGISTERED)

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
            <AppButton className="add-new-story-button" data-cy="add-story-web" onClick={() => setActiveComponent('web')}>
              <img src={uploadWebIcon} alt="web upload" className='story-option-icon' />
              <FormattedMessage id="upload-from-web" />
            </AppButton>
            <AppButton className="add-new-story-button" data-cy="add-story-file" onClick={() => setActiveComponent('file')}>
              <img src={uploadFileIcon} alt="file upload" className='story-option-icon' />
              <FormattedMessage id="upload-stories" />
            </AppButton>

            <AppButton className="add-new-story-button" data-cy="add-story-paste" onClick={() => setActiveComponent('paste')}>
              <img src={uploadPasteIcon} alt="paste" className='story-option-icon' />
              <FormattedMessage id="paste-a-text" />
            </AppButton>
            {lesson_topics?.length !== 0 && canGenerate && (
              <AppButton className="add-new-story-button" data-cy="add-story-generate" onClick={goToGeneratePage}>
                <img src={generateAI} alt="generate AI" className='story-option-icon' />
                <FormattedMessage id="go-generating" />
              </AppButton>
            )}
        </div>
      </div>
    </div>
  )
}

export default StoryInputOptions
