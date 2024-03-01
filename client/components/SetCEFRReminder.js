import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Divider, Modal } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { updateUserGrade, updateIsTeacher } from 'Utilities/redux/userReducer'
import CERFLevelSlider from './CEFRLevelSlider'

const SetCEFRReminder = ({ open, setOpen, newUser }) => {
  const dispatch = useDispatch()
  const [sliderValue, setSliderValue] = useState(121)
  const [isTeacher, setIsTeacher] = useState(false)
  const { hasAdaptiveTests, pending } = useSelector(({ metadata }) => metadata)

  // const user = useSelector(({ user }) => user.data)
  // const lastUsedLanguage = user.user.last_used_language

  const closeModal = () => {
    setOpen(false)
    /*
    if (newUser) {
      startTour()
    }
    */
  }

  const submitSettings = () => {
    const minified = sliderValue / 11
    const rounded = Math.floor(minified / 10)
    dispatch(updateUserGrade(rounded))
    dispatch(updateIsTeacher(isTeacher))
    closeModal()
  }

  if (pending) {
    return null
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
        <div className="encouragement" style={{ padding: '1.5rem' }}>
          <div className="space-evenly" style={{ marginTop: '.5em' }}>
            <span style={{ marginRight: '.5em', fontSize: '18px' }}>
              <input
                type="radio"
                style={{ marginRight: '.75em' }}
                onChange={() => {
                  setIsTeacher(false); 
                }}
                checked={!isTeacher}
              />
              <FormattedMessage id="user-role-select-student" />
            </span>
            <span style={{ marginRight: '.5em', fontSize: '18px' }}>
              <input
                type="radio"
                style={{ marginRight: '.75em' }}
                onChange={() => {
                  setIsTeacher(true); 
                }}
                checked={isTeacher}
              />
              <FormattedMessage id="user-role-select-teacher" />
            </span>
          </div>
          {
            !isTeacher && 
            (
              <>
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
                <div style={{display: 'flex', 'justify-content': 'center', width: '100%'}}>
                  <Button
                    style={{ marginBottom: '1em', display: 'flex',  'align-items': 'center', 'justify-content': 'center', width: '100%' }}
                    variant="primary"
                    size="lg"
                    onClick={submitSettings}
                  >
                    <FormattedMessage id="Save-CEFR" />
                  </Button>
                </div>
                
                {hasAdaptiveTests && (
                  <>
                    <Divider />
                    <div
                      style={{
                        marginTop: '1em',
                        color: isTeacher ? 'lightgrey' : '#000000',
                      }}
                    >
                      <h3>
                        <FormattedMessage id="offer-adaptive-test" />
                      </h3>
                      &nbsp;
                      <Link to="/adaptive-test">
                        <div style={{display: 'flex', 'justify-content': 'center', width: '100%'}}>
                          <Button 
                            style={{ fontSize: '18px', display: 'flex',  'align-items': 'center', 'justify-content': 'center', width: '100%' }} 
                            variant="primary" 
                            disabled={isTeacher}
                          >
                            <FormattedMessage id="adaptive-test-button" />
                          </Button>
                        </div>
                      </Link>
                    </div>
                  </>
                )}
              </>
            )
          }
          {
            isTeacher && (
              <div style={{ marginTop: '1em', display: 'flex', 'justify-content': 'center', width: '100%' }}>
                <Button 
                  style={{ fontSize: '18px', display: 'flex',  'align-items': 'center', 'justify-content': 'center', width: '100%' }} 
                  variant="primary" 
                  onClick={() => {
                    dispatch(updateIsTeacher(isTeacher));
                    closeModal()
                  }}
                >
                  <FormattedMessage id="Save" />
                </Button>
              </div>
            )
          }
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default SetCEFRReminder
