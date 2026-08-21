// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import AppDialog from 'Components/ui/AppDialog'
import AppButton from 'Components/AppButton'
import { colors, font } from 'Assets/mui_theme/designTokens'
import { useNavigate } from 'react-router-dom'

import { useLearningLanguage } from 'Utilities/common'
import { InitAdaptiveTest } from 'Utilities/redux/testReducer'
import { updateUserGrade, updateIsTeacher, updateToNonNewUser } from 'Utilities/redux/userReducer'
import CERFLevelSlider from './Sliders/CEFRLevelSlider'

const SetCEFRReminder = ({ open, setOpen, newUser }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const learningLanguage = useLearningLanguage()
  const [sliderValue, setSliderValue] = useState(121)
  const [isTeacher, setIsTeacher] = useState(false)
  const { hasAdaptiveTests, pending } = useSelector(({ metadata }) => metadata)
  const [step, setStep] = useState(1)

  const closeModal = () => {
    if (newUser) dispatch(updateToNonNewUser())
    setOpen(false)
  }

  const submitSettings = () => {
    const minified = sliderValue / 11
    const rounded = Math.floor(minified / 10)
    dispatch(updateUserGrade(rounded))
    dispatch(updateIsTeacher(false))
    closeModal()
  }

  const startAdaptiveTest = () => {
    dispatch(updateIsTeacher(false))
    dispatch(InitAdaptiveTest(learningLanguage))
    closeModal()
    navigate('/adaptive-test')
  }

  const handleStudentClick = () => {
    setIsTeacher(false)
    setStep(step + 1)
  }

  const handleTeacherClick = () => {
    setIsTeacher(true)
    dispatch(updateIsTeacher(true))
    closeModal()
  }

  if (pending) return null

  // Shared heading style — the base Geologica font, ink, centred.
  const headingStyle = {
    fontFamily: font.family,
    fontWeight: 700,
    fontSize: 22,
    lineHeight: 1.25,
    color: colors.ink,
    margin: '0 0 28px',
  }

  // No `onClose`: the old semantic modal had closeIcon / dimmer / escape all disabled,
  // so the dialog is dismissable only through its own buttons.
  return (
    <AppDialog
      open={open}
      maxWidth="xs"
      data-cy="set-cefr-reminder-modal"
      sx={{
        '& .MuiDialogTitle-root': { padding: 0 },
        '& .MuiDialog-paper': { minHeight: 360 },
        '& .MuiDialogContent-root': {
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        },
      }}
    >
      <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
        {step === 1 && (
          <>
            <h3 style={headingStyle}>
              <FormattedMessage id="user-role-select" />
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              <AppButton
                variant="primary"
                size="lg"
                sx={{ fontSize: 16 }}
                data-cy="set-cefr-role-student-button"
                onClick={handleStudentClick}
              >
                <FormattedMessage id="user-role-select-student" />
              </AppButton>
              <AppButton
                variant="secondary"
                size="lg"
                sx={{ fontSize: 16 }}
                data-cy="set-cefr-role-teacher-button"
                onClick={handleTeacherClick}
              >
                <FormattedMessage id="user-role-select-teacher" />
              </AppButton>
            </div>
          </>
        )}
        {step === 2 && !isTeacher && (
          <>
            <h3 style={headingStyle}>
              <FormattedMessage id="select-cefr-reminder" />
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              <AppButton
                variant="primary"
                size="lg"
                sx={{ fontSize: 16, width: '100%' }}
                data-cy="set-cefr-manually-button"
                onClick={() => setStep(3)}
              >
                <FormattedMessage id="set-cefr-manually" />
              </AppButton>
              {hasAdaptiveTests && (
                <AppButton
                  variant="secondary"
                  size="lg"
                  sx={{ fontSize: 16, width: '100%' }}
                  data-cy="set-cefr-adaptive-test-button"
                  onClick={startAdaptiveTest}
                >
                  <FormattedMessage id="adaptive-test-button" />
                </AppButton>
              )}
            </div>
          </>
        )}
        {step === 3 && !isTeacher && (
          <>
            <h3 style={headingStyle}>
              <FormattedMessage id="select-cefr-reminder" />
            </h3>
            <CERFLevelSlider sliderValue={sliderValue} setSliderValue={setSliderValue} />
          </>
        )}
        {step !== 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '1.5rem',
              borderTop: `1px solid ${colors.border}`,
              paddingTop: '1.25rem',
            }}
          >
            {step > 1 && (
              <AppButton
                variant="secondary"
                data-cy="set-cefr-back-button"
                sx={{ fontSize: 16 }}
                onClick={() => setStep(step - 1)}
              >
                <FormattedMessage id="Back" />
              </AppButton>
            )}
            <div style={{ marginLeft: 'auto' }}>
              {step === 3 && (
                <AppButton
                  variant="primary"
                  data-cy="set-cefr-save-button"
                  onClick={submitSettings}
                >
                  <FormattedMessage id="Save" />
                </AppButton>
              )}
            </div>
          </div>
        )}
      </div>
    </AppDialog>
  )
}

export default SetCEFRReminder
