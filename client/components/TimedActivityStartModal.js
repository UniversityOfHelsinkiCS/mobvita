import React from 'react'
import { Modal } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'

const TimedActivityStartModal = ({ open, setOpen, activity, onBackClick }) => {
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
        <div className="mb-nm">
          <FormattedMessage id={`${activity}-info-text`} />
        </div>
        <div className="flex-col align-center gap-row-sm">
          <div>
            <Button onClick={() => setOpen(false)}>
              <FormattedMessage id="start" />
            </Button>
          </div>
          <div>
            <Button variant="secondary" onClick={handleBackClick}>
              <FormattedMessage id="go-back" />
            </Button>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default TimedActivityStartModal
