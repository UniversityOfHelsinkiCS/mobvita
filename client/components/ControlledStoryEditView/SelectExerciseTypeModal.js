import React, { useState } from 'react'
import AppDialog from 'Components/ui/AppDialog'
import AppButton from 'Components/AppButton'
import { FormattedMessage } from 'react-intl'
import MultipleChoiceModal from './MultipleChoicesModal'

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
        data-cy="select-exercise-type-modal"
        closeDataCy="select-exercise-type-modal-close"
      >
        <div className="encouragement">
          <div className="pt-sm" style={{ color: '#000000', marginLeft: '0.5em' }}>
            <FormattedMessage id="choose-exercise-type" />
          </div>
          <hr />
          <div style={{ marginBottom: '0.5em' }}>
            {!noConcepts && (
              <span style={{ marginBottom: '0.5em', marginLeft: '0.5em' }}>
                <AppButton
                  type="submit"
                  onClick={handleAddClozeExercise}
                  onKeyDown={handleAddClozeExercise}
                  data-cy="choose-cloze-exercise-button"
                >
                  <FormattedMessage id="choose-cloze-exercise" />
                </AppButton>
              </span>
            )}
            <span style={{ marginBottom: '0.5em', marginLeft: '0.45em' }}>
              <AppButton
                type="submit"
                onClick={handleAddHearingExercise}
                onKeyDown={handleAddHearingExercise}
                data-cy="choose-listening-exercise-button"
              >
                <FormattedMessage id="choose-listening-exercise" />
              </AppButton>
            </span>
            <span style={{ marginBottom: '0.5em', marginLeft: '0.45em' }}>
              <AppButton
                type="submit"
                onClick={handleOpenMCModal}
                onKeyDown={handleOpenMCModal}
                data-cy="choose-multichoice-exercise-button"
              >
                <FormattedMessage id="choose-multichoice-exercise" />
              </AppButton>
            </span>
          </div>
        </div>
      </AppDialog>
    </>
  )
}

export default SelectExerciseTypeModal
