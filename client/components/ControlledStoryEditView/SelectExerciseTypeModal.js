import React, { useState } from 'react'
import { Box } from '@mui/material'
import AppDialog from 'Components/ui/AppDialog'
import AppButton from 'Components/AppButton'
import { FormattedMessage } from 'react-intl'
import { colors } from 'Assets/mui_theme/designTokens'
import MultipleChoiceModal from './MultipleChoicesModal'

const BUTTON_SX = { width: '100%', height: 36 }

const SelectExerciseTypeModal = ({
  showExerciseOptionsModal,
  setShowExerciseOptionsModal,
  handleAddClozeExercise,
  handleAddHearingExercise,
  handleAddMultichoiceExercise,
  word,
  analyticChunkWord,
  showValidationMessage,
  noConcepts,
}) => {
  const [showChoices, setShowChoices] = useState(false)

  const closeModal = () => {
    setShowExerciseOptionsModal(false)
  }

  const handleOpenMCModal = () => {
    setShowChoices(true)
    setShowExerciseOptionsModal(false)
  }

  return (
    <>
      <MultipleChoiceModal
        open={showChoices}
        setOpen={setShowChoices}
        handleAddMultichoiceExercise={handleAddMultichoiceExercise}
        word={word}
        analyticChunkWord={analyticChunkWord}
        showValidationMessage={showValidationMessage}
      />
      <AppDialog
        open={showExerciseOptionsModal}
        onClose={closeModal}
        maxWidth="xs"
        title={<FormattedMessage id="choose-exercise-type" />}
        subtitle={word?.surface}
        subtitleSx={{ color: colors.muted, fontSize: 16 }}
        titleSx={{ px: '40px', pt: '32px' }}
        contentSx={{ px: '40px', pb: '32px' }}
        data-cy="select-exercise-type-modal"
        closeDataCy="select-exercise-type-modal-close"
      >
        {/* One choice per row: the three labels are full sentences, so a button row would wrap
            unevenly and hide which option is which. */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.75em' }}>
          {!noConcepts && (
            <AppButton
              type="button"
              onClick={handleAddClozeExercise}
              data-cy="choose-cloze-exercise-button"
              sx={BUTTON_SX}
            >
              <FormattedMessage id="choose-cloze-exercise" />
            </AppButton>
          )}
          <AppButton
            type="button"
            onClick={handleAddHearingExercise}
            data-cy="choose-listening-exercise-button"
            sx={BUTTON_SX}
          >
            <FormattedMessage id="choose-listening-exercise" />
          </AppButton>
          <AppButton
            type="button"
            onClick={handleOpenMCModal}
            data-cy="choose-multichoice-exercise-button"
            sx={BUTTON_SX}
          >
            <FormattedMessage id="choose-multichoice-exercise" />
          </AppButton>
        </Box>
      </AppDialog>
    </>
  )
}

export default SelectExerciseTypeModal
