import React, { useState } from 'react'
import { Modal, Button, Icon } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import { useCurrentUser } from 'Utilities/common'
import StoryInputOptions from './StoryInputOptions'
import UploadFromWeb from './UploadFromWeb'
import UploadFromFile from './UploadFromFile'
import UploadPastedText from './UploadPastedText'
import './AddStoryModal.scss'

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
      default:
        return null
    }
  }

  return (
    <Modal
      open={open}
      size={false}
      className='add-story-modal'
      closeIcon={{ style: { top: '8px', right: '8px' }, color: 'black', name: 'close' }}
      onClose={() => setOpen(false)}
    >
      <Modal.Header style={{ padding: '12px 16px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '40px 1fr 40px',
            alignItems: 'center',
          }}
        >
          <Button
            basic
            icon
            onClick={() => setActiveComponent('main')}
            disabled={activeComponent === 'main'}
            style={{ justifySelf: 'start' }}
          >
            <Icon name="left chevron" />
          </Button>

          <div style={{ justifySelf: 'center', textAlign: 'center', fontWeight: 600 }}>
            {headerText}
          </div>

          <div /> {/* spacer to keep title centered */}
        </div>
      </Modal.Header>
      <Modal.Content style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>{renderComponent()}</Modal.Content>
    </Modal>
  )
}

export default AddStoryModal
