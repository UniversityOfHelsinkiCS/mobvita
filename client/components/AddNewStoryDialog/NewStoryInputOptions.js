import React from 'react'
import AppButton from 'Components/AppButton'
import AppIcon from 'Components/ui/AppIcon'
import { FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'
import { ACCESS, images, useHasAccess } from 'Utilities/common'
import { colors } from 'Assets/mui_theme/designTokens'
import { pillButtonSx } from './styles'

// A story-source pill: the shared Figma pill, full width, icon and label left-aligned.
const optionButtonSx = background => ({
  ...pillButtonSx(background),
  width: '100%',
  justifyContent: 'flex-start',
})

// The story-source pills (web, file, paste, AI); AI needs lesson topics and a registered user.
const NewStoryInputOptions = ({
  closeModal,
  lesson_topics,
  userIsAnonymous,
  setActiveComponent,
}) => {
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
          sx={optionButtonSx(colors.green)}
          data-cy="add-story-web"
          onClick={() => setActiveComponent('web')}
        >
          <AppIcon src={images.globe} />
          <FormattedMessage id="upload-from-web" />
        </AppButton>
        <AppButton
          sx={optionButtonSx(colors.panel)}
          data-cy="add-story-file"
          onClick={() => setActiveComponent('file')}
        >
          <AppIcon src={images.upload} />
          <FormattedMessage id="upload-stories" />
        </AppButton>
        <AppButton
          sx={optionButtonSx(colors.menuHover)}
          data-cy="add-story-paste"
          onClick={() => setActiveComponent('paste')}
        >
          <AppIcon src={images.paste} />
          <FormattedMessage id="paste-a-text" />
        </AppButton>
        {lesson_topics?.length !== 0 && canGenerate && (
          <AppButton
            sx={optionButtonSx(colors.lavender)}
            data-cy="add-story-generate"
            onClick={goToGeneratePage}
          >
            <AppIcon src={images.star06} />
            <FormattedMessage id="go-generating" />
          </AppButton>
        )}
      </div>
    </div>
  )
}

export default NewStoryInputOptions
