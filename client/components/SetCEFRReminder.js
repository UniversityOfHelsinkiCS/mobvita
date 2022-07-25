import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch } from 'react-redux'
import { Modal } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { sidebarSetOpen } from 'Utilities/redux/sidebarReducer'
import { updateUserGrade } from 'Utilities/redux/userReducer'
import CERFLevelSlider from './CEFRLevelSlider'

const SetCEFRReminder = ({ open, setOpen, newUser }) => {
  const dispatch = useDispatch()
  const [sliderValue, setSliderValue] = useState(121)
  const [isTeacher, setIsTeacher] = useState(false)

  const startTour = () => {
    dispatch(sidebarSetOpen(false))
    dispatch({ type: 'TOUR_RESTART' })
  }

  const closeModal = () => {
    setOpen(false)
    if (newUser) {
      startTour()
    }
  }

  const submitSettings = () => {
    const minified = sliderValue / 11
    const rounded = Math.floor(minified / 10)
    dispatch(updateUserGrade(rounded))

    closeModal()
  }

  return (
    <Modal
      basic
      open={open}
      size="tiny"
      centered={false}
      dimmer="blurring"
      closeIcon={{ style: { top: '2.5rem', right: '2.5rem' }, color: 'black', name: 'close' }}
      onClose={closeModal}
    >
      <Modal.Content>
        <div className="encouragement" style={{ padding: '1.5rem', color: '#000000' }}>
          <div className="space-evenly" style={{ marginLeft: '.5em', marginTop: '.5em' }}>
            <span style={{ marginRight: '.5em' }}>
              <input type="radio" onChange={() => setIsTeacher(false)} checked={!isTeacher} />
            </span>
            <span style={{ marginRight: '.5em' }}>
              <FormattedMessage id="user-role-select-student" />
            </span>
            <span style={{ marginRight: '.5em' }}>
              <input type="radio" onChange={() => setIsTeacher(true)} checked={isTeacher} />
            </span>
            <span style={{ marginRight: '.5em' }}>
              <FormattedMessage id="user-role-select-teacher" />
            </span>
          </div>
          <hr />
          <h3 style={{ marginTop: '1em', color: isTeacher ? '#D3D3D3' : '#000000' }}>
            <FormattedMessage id="select-cefr-reminder" />
          </h3>
          <div>
            <CERFLevelSlider
              isDisabled={isTeacher}
              sliderValue={sliderValue}
              setSliderValue={setSliderValue}
            />
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
