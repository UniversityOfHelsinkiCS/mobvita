import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'semantic-ui-react';
import { Button, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { updateUserGrade, updateIsTeacher, updateToNonNewUser } from 'Utilities/redux/userReducer';
import CERFLevelSlider from './CEFRLevelSlider';

const SetCEFRReminder = ({ open, setOpen, newUser }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [sliderValue, setSliderValue] = useState(121);
  const [isTeacher, setIsTeacher] = useState(false);
  const { hasAdaptiveTests, pending } = useSelector(({ metadata }) => metadata);
  const [step, setStep] = useState(1);

  const closeModal = () => {
    if (newUser) dispatch(updateToNonNewUser());
    setOpen(false);
  };

  const submitSettings = () => {
    if (isTeacher) {
      dispatch(updateIsTeacher(true));
      closeModal();
    } else {
      const minified = sliderValue / 11;
      const rounded = Math.floor(minified / 10);
      dispatch(updateUserGrade(rounded));
      dispatch(updateIsTeacher(false));
      closeModal();
    }
  };

  const startAdaptiveTest = () => {
    dispatch(updateIsTeacher(false));
    closeModal();
    history.push('/adaptive-test');
  };

  if (pending) return null;

  return (
    <Modal basic open={open} size="tiny" centered={false} dimmer="blurring" closeIcon={false} closeOnDimmerClick={false} closeOnDocumentClick={false} closeOnEscape={false}>
      <Modal.Content>
        <div className="encouragement" style={{ padding: '1.5rem', textAlign: 'center' }}>
          {step === 1 && (
            <>
              <h3><FormattedMessage id="user-role-select" /></h3>
              <ToggleButtonGroup type="radio" name="role" value={isTeacher} onChange={setIsTeacher} className="d-flex justify-content-center" style={{ transition: '0.3s' }}>
                <ToggleButton variant={!isTeacher ? 'primary' : 'secondary'} value={false}><FormattedMessage id="user-role-select-student" /></ToggleButton>
                <ToggleButton variant={isTeacher ? 'primary' : 'secondary'} value={true}><FormattedMessage id="user-role-select-teacher" /></ToggleButton>
              </ToggleButtonGroup>
            </>
          )}
          {step === 2 && !isTeacher && (
            <>
              <h3><FormattedMessage id="select-cefr-reminder" /></h3>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <Button variant="primary" size="lg" onClick={() => setStep(3)}>
                  <FormattedMessage id="set-cefr-manually" />
                </Button>
                {hasAdaptiveTests && (
                  <Button variant="primary" size="lg" onClick={startAdaptiveTest}>
                    <FormattedMessage id="adaptive-test-button" />
                  </Button>
                )}
              </div>
            </>
          )}
          {step === 3 && !isTeacher && (
            <>
              <h3><FormattedMessage id="select-cefr-reminder" /></h3>
              <CERFLevelSlider sliderValue={sliderValue} setSliderValue={setSliderValue} />
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
            {step > 1 && !isTeacher && (
              <Button variant="secondary" onClick={() => setStep(step - 1)}>
                <FormattedMessage id="Back" />
              </Button>
            )}
            <div style={{ marginLeft: 'auto' }}>
              {isTeacher || step === 3 ? (
                <Button variant="primary" onClick={submitSettings}>
                  <FormattedMessage id="Save" />
                </Button>
              ) : (
                <Button variant="primary" onClick={() => setStep(step + 1)}>
                  <FormattedMessage id="next" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default SetCEFRReminder;
