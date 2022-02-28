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
      centered={false}
      dimmer="inverted"
      closeIcon={{ style: { top: '2.5rem', right: '2.5rem' }, color: 'black', name: 'close' }}
      onClose={() => setOpen(false)}
    >
      <Modal.Content>
        {notFirst ? (
          <div>
            <div className="bold">
              <FormattedMessage className="bold" id="story-completed-encouragement" />
            </div>
            <div className="pt-lg">
              {intl.formatMessage(
                { id: 'stories-covered-encouragement' },
                { stories: storiesCovered }
              )}
            </div>
            <div className="pt-sm">
              {intl.formatMessage(
                { id: 'words-seen-encouragement' },
                { vocabulary_seen: vocabularySeen }
              )}
            </div>
          </div>
        ) : (
          <div className="bold">
            <FormattedMessage className="bold" id="first-story-covered-encouragement" />
          </div>
        )}
        <div className="pt-lg">
          <img
            src={images.balloons}
            alt="encouraging balloons"
            style={{ maxWidth: '35%', maxHeight: '35%' }}
          />
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default ExercisesEncouragementModal
