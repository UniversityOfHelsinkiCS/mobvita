import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Modal } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { updateUserGrade } from 'Utilities/redux/userReducer'
import CERFLevelSlider from './CEFRLevelSlider'

const SetCEFRReminder = props => {
  const dispatch = useDispatch()
  const [sliderValue, setSliderValue] = useState(0)
  const skillLevels = [
    'A1',
    'A1/A2',
    'A2',
    'A2/B1',
    'B1',
    'B1/B2',
    'B2',
    'B2/C1',
    'C1',
    'C1/C2',
    'C2',
  ]

  const closeModal = () => {
    props.setOpen(false)
  }

  const submitSettings = () => {
    const minified = sliderValue / 11
    const rounded = Math.floor(minified / 10)
    console.log('ROUNDED ', rounded)
    if (rounded === 11) {
      dispatch(updateUserGrade('C2'))
    } else {
      dispatch(updateUserGrade(skillLevels[rounded]))
    }

    closeModal()
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
        <div className="encouragement" style={{ padding: '1.5rem', color: '#000000' }}>
          <h2>
            <FormattedMessage id="select-cefr-reminder" />
          </h2>
          <div>
            <CERFLevelSlider sliderValue={sliderValue} setSliderValue={setSliderValue} />
          </div>
          <br />
          <Button variant="primary" size="lg" onClick={submitSettings}>
            <FormattedMessage id="update-settings" />
          </Button>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default SetCEFRReminder
