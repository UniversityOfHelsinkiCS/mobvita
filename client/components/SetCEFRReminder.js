import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'semantic-ui-react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

import { useLearningLanguage } from 'Utilities/common'
import { InitAdaptiveTest } from 'Utilities/redux/testReducer'
import { updateUserGrade, updateIsTeacher, updateToNonNewUser } from 'Utilities/redux/userReducer';
import CERFLevelSlider from './CEFRLevelSlider';

const SetCEFRReminder = ({ open, setOpen, newUser }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const learningLanguage = useLearningLanguage()
  const [sliderValue, setSliderValue] = useState(121);
  const [isTeacher, setIsTeacher] = useState(false);
  const { hasAdaptiveTests, pending } = useSelector(({ metadata }) => metadata);
  const [step, setStep] = useState(1);

  const closeModal = () => {
    if (newUser) dispatch(updateToNonNewUser());
    setOpen(false);
  };

  const submitSettings = () => {
    const minified = sliderValue / 11;
    const rounded = Math.floor(minified / 10);
    dispatch(updateUserGrade(rounded));
    dispatch(updateIsTeacher(false));
    closeModal();
  };

  const startAdaptiveTest = () => {
    dispatch(updateIsTeacher(false));
    dispatch(InitAdaptiveTest(learningLanguage))
    closeModal();
    history.push('/adaptive-test');
  };

  const handleStudentClick = () => {
    setIsTeacher(false)
    setStep(step + 1)
  }

  const handleTeacherClick = () => {
    setIsTeacher(true)
    dispatch(updateIsTeacher(true))
    closeModal()
  }

  if (pending) return null;

  return (
    <Modal basic open={open} size="tiny" centered={false} dimmer="blurring" closeIcon={false} closeOnDimmerClick={false} closeOnDocumentClick={false} closeOnEscape={false}>
      <Modal.Content>
        <div className="encouragement" style={{ padding: '1.5rem', textAlign: 'center' }}>
          {step === 1 && (
            <>
              <h3 style={{ marginBottom: '40px' }}>
                <FormattedMessage id="user-role-select" />
              </h3>
              <Button
                variant="primary"
                size="lg"
                onClick={handleStudentClick}
                style={{ marginRight: '20px' }}
              >
                <FormattedMessage id="user-role-select-student" />
              </Button>
              <Button variant="primary" size="lg" onClick={handleTeacherClick}>
                <FormattedMessage id="user-role-select-teacher" />
              </Button>
            </>
          )}
          {step === 2 && !isTeacher && (
            <>
              <h3>
                <FormattedMessage id="select-cefr-reminder" />
              </h3>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '20px',
                  marginTop: '30px',
                }}
              >
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
          {step !== 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '1rem',
                borderTop: '1px solid #ddd',
                paddingTop: '1rem',
              }}
            >
              {step > 1 && (
                <Button variant="secondary" onClick={() => setStep(step - 1)}>
                  <FormattedMessage id="Back" />
                </Button>
              )}
              <div style={{ marginLeft: 'auto' }}>
                {step === 3 && (
                  <Button variant="primary" onClick={submitSettings}>
                    <FormattedMessage id="Save" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </Modal.Content>
    </Modal>
  );
};

export default SetCEFRReminder;
