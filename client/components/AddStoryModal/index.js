import React, { useState } from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { useCurrentUser } from 'Utilities/common'
import StoryInputOptions from './StoryInputOptions'
import UploadFromWeb from './UploadFromWeb'
import UploadFromFile from './UploadFromFile'
import UploadPastedText from './UploadPastedText'
import GenerateStories from './GenerateStories'

const AddStoryModal = ({ open, setOpen }) => {
  const { lesson_topics } = useSelector(({ metadata }) => metadata)
  const user = useCurrentUser()
  const userIsAnonymous = user.email === 'anonymous_email'
  const [activeComponent, setActiveComponent] = useState('main')

  let headerText
  switch (activeComponent) {
    case 'main':
      headerText = <FormattedMessage id="add-your-stories" />
      break
    case 'web':
      headerText = <FormattedMessage id="upload-from-web" />
      break
    case 'file':
      headerText = <FormattedMessage id="upload-stories" />
      break
    case 'paste':
      headerText = <FormattedMessage id="paste-a-text" />
      break
    case 'generate':
      headerText = <FormattedMessage id="go-generating" />
      break
    default:
      headerText = null
  }

  const renderComponent = () => {
    switch (activeComponent) {
      case 'main':
        return (
          <StoryInputOptions
            closeModal={() => setActiveComponent(null)}
            lesson_topics={lesson_topics}
            userIsAnonymous={userIsAnonymous}
            setActiveComponent={setActiveComponent}
          />
        )
      case 'web':
        return <UploadFromWeb closeModal={() => setActiveComponent('main')} />
      case 'file':
        return <UploadFromFile closeModal={() => setActiveComponent('main')} />
      case 'paste':
        return <UploadPastedText closeModal={() => setActiveComponent('main')} />
      case 'generate':
        return <GenerateStories closeModal={() => setActiveComponent('main')} />
      default:
        return null
    }
  }

  return (
    <Modal
      open={open}
      size="small"
      closeIcon={{ style: { top: '8px', right: '8px' }, color: 'black', name: 'close' }}
      onClose={() => setOpen(false)}
    >
      <Modal.Header style={{ textAlign: 'center' }}>
        {headerText}
      </Modal.Header>
      <Modal.Content>
        {renderComponent()}
      </Modal.Content>
    </Modal>
  )
}

export default AddStoryModal