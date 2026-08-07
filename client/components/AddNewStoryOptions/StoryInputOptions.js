import React from 'react'
import AppButton from 'Components/AppButton'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { ACCESS, images, useHasAccess } from 'Utilities/common'
import uploadFileIcon from '../../assets/images/upload-file.png'
import uploadWebIcon from '../../assets/images/upload-cloud.png'
import uploadPasteIcon from '../../assets/images/paste.png'

// Figma "Chat Bot answer": each story source is a full-width pill in its own pastel colour.
const optionButtonSx = background => ({
  width: '100%',
  justifyContent: 'flex-start',
  gap: '10px',
  padding: '8px 10px 8px 12px',
  color: '#2d2c2a',
  backgroundColor: background,
  '&:hover': { backgroundColor: background, filter: 'brightness(0.96)' },
})

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

      <div className="story-input-options-stack">
        <AppButton
          sx={optionButtonSx('#b1d3c2')}
          data-cy="add-story-web"
          onClick={() => setActiveComponent('web')}
        >
          <img src={uploadWebIcon} alt="" className="story-option-icon" />
          <FormattedMessage id="upload-from-web" />
        </AppButton>
        <AppButton
          sx={optionButtonSx('#c1dce6')}
          data-cy="add-story-file"
          onClick={() => setActiveComponent('file')}
        >
          <img src={uploadFileIcon} alt="" className="story-option-icon" />
          <FormattedMessage id="upload-stories" />
        </AppButton>
        <AppButton
          sx={optionButtonSx('#ece3be')}
          data-cy="add-story-paste"
          onClick={() => setActiveComponent('paste')}
        >
          <img src={uploadPasteIcon} alt="" className="story-option-icon" />
          <FormattedMessage id="paste-a-text" />
        </AppButton>
        {lesson_topics?.length !== 0 && canGenerate && (
          <AppButton
            sx={optionButtonSx('#cacae0')}
            data-cy="add-story-generate"
            onClick={goToGeneratePage}
          >
            <img src={images.star06} alt="" className="story-option-icon" />
            <FormattedMessage id="go-generating" />
          </AppButton>
        )}
      </div>
    </div>
  )
}

export default StoryInputOptions
