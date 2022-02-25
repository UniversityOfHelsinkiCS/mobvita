import React from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { images } from 'Utilities/common'

const ExercisesEncouragementModal = ({ open, setOpen, storiesCovered }) => {
  const intl = useIntl()

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
        <div className="bold">
          <FormattedMessage className="bold" id="story-completed-encouragement" />
        </div>
        <div className="pt-lg">
          {intl.formatMessage({ id: 'stories-covered-encouragement' }, { stories: storiesCovered })}
        </div>
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
