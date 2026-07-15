import FormattedHTMLMessage from 'Components/FormattedHTMLMessage';
import React from 'react'
import { Modal } from 'semantic-ui-react'
import AppButton from 'Components/AppButton'
import { FormattedMessage } from 'react-intl';

const TimedActivityStartModal = ({ open, setOpen, activity, onBackClick, onStart }) => {
  const handleStartClick = () => {
    if (onStart) onStart()
    setOpen(false)
  }

  const handleBackClick = () => {
    onBackClick()
    setOpen(false)
  }

  return (
    <Modal open={open} dimmer="blurring" size="tiny">
      <Modal.Header>
        <FormattedMessage id={activity} />
      </Modal.Header>
      <Modal.Content>
        <div className="mb-lg">
          <FormattedHTMLMessage id={`${activity}-info-text`} />
        </div>
        <div className="flex-col align-center gap-row-nm">
          <div>
            <AppButton data-cy="start-timed-activity" size="lg" onClick={handleStartClick}>
              <FormattedMessage id="start" />
            </AppButton>
          </div>
          <div>
            <AppButton variant="secondary" onClick={handleBackClick}>
              <FormattedMessage id="go-back" />
            </AppButton>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default TimedActivityStartModal
