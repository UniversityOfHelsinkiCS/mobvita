import React from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { images } from 'Utilities/common'

const ExercisesEncouragementModal = ({ open, setOpen, storiesCovered, vocabularySeen }) => {
  const intl = useIntl()
  const notFirst = storiesCovered > 1

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
        <div style={{ padding: '1.5rem', backgroundColor: '#FFFFFF' }}>
          {notFirst ? (
            <div>
              <div
                className="header-2"
                style={{
                  marginBottom: '1rem',
                  fontWeight: 500,
                  color: '#000000',
                }}
              >
                <FormattedMessage id="story-completed-encouragement" />
              </div>
              <div className="bold pt-sm" style={{ color: '#000000' }}>
                {intl.formatMessage(
                  { id: 'stories-covered-encouragement' },
                  { stories: storiesCovered }
                )}
              </div>
              <div className="bold pt-sm" style={{ color: '#000000' }}>
                {intl.formatMessage(
                  { id: 'words-seen-encouragement' },
                  { vocabulary_seen: vocabularySeen }
                )}
              </div>
            </div>
          ) : (
            <div
              className="header-2"
              style={{
                marginBottom: '1.5rem',
                fontWeight: 500,
                color: '#000000',
              }}
            >
              <FormattedMessage id="first-story-covered-encouragement" />
            </div>
          )}
          <div className="pt-lg">
            <img
              src={images.balloons}
              alt="encouraging balloons"
              style={{ maxWidth: '35%', maxHeight: '35%' }}
            />
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default ExercisesEncouragementModal
