import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Modal } from 'semantic-ui-react'
import CERFLevelSlider from './CEFRLevelSlider'

const SetCEFRReminder = props => {
  const [sliderValue, setSliderValue] = useState(0)

  const closeModal = () => {
    props.setOpen(false)
  }

  return (
    <Modal
      basic
      open={props.open}
      size="tiny"
      centered={false}
      dimmer="blurring"
      closeIcon={{ style: { top: '2.5rem', right: '2.5rem' }, color: 'black', name: 'close' }}
      onClose={closeModal}
    >
      <Modal.Content>
        <div className="encouragement" style={{ padding: '1.5rem' }}>
          <h2 style={{ color: '#000000' }}>
            <FormattedMessage id="select-cefr-reminder" />
          </h2>
          <div style={{ color: '#000000' }}>
            <CERFLevelSlider sliderValue={sliderValue} setSliderValue={setSliderValue} />
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default SetCEFRReminder
