import React from 'react'
import { Modal } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import { images } from 'Utilities/common'

const WelcomeBackEncouragementModal = ({ open, setOpen, username, storiesCovered }) => {
  const intl = useIntl()

  return (
    <Modal
      basic
      open={open}
      size="small"
      centered={false}
      dimmer="blurring"
      closeIcon={{ style: { top: '2.5rem', right: '2.5rem' }, color: 'black', name: 'close' }}
      onClose={() => setOpen(false)}
    >
      <Modal.Content>
        <div>
          <div
            className="header-2"
            style={{
              marginTop: '1.5rem',
              marginBottom: '1.5rem',
              fontWeight: 500,
            }}
          >
            {intl.formatMessage({ id: 'welcome-back-encouragement' }, { username })}
          </div>
          <div className="bold">
            {intl.formatMessage(
              { id: 'stories-covered-encouragement' },
              { stories: storiesCovered }
            )}
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default WelcomeBackEncouragementModal
