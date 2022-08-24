import React, { useState } from 'react'
import { Modal } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
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
      <Modal
        basic
        open={showExerciseOptionsModal}
        size="tiny"
        centered
        closeIcon={{ style: { top: '2rem', right: '2rem' }, color: 'black', name: 'close' }}
        onClose={closeModal}
      >
        <Modal.Content>
          <div className="encouragement">
            <div className="pt-sm" style={{ color: '#000000', marginLeft: '0.5em' }}>
              <FormattedMessage id="choose-exercise-type" />
            </div>
            <hr />
            <div style={{ marginBottom: '0.5em' }}>
              {!noConcepts && (
                <span style={{ marginBottom: '0.5em', marginLeft: '0.5em' }}>
                  <Button
                    type="submit"
                    onClick={handleAddClozeExercise}
                    onKeyDown={handleAddClozeExercise}
                  >
                    <FormattedMessage id="choose-cloze-exercise" />
                  </Button>
                </span>
              )}
              <span style={{ marginBottom: '0.5em', marginLeft: '0.45em' }}>
                <Button
                  type="submit"
                  onClick={handleAddHearingExercise}
                  onKeyDown={handleAddHearingExercise}
                >
                  <FormattedMessage id="choose-listening-exercise" />
                </Button>
              </span>
              <span style={{ marginBottom: '0.5em', marginLeft: '0.45em' }}>
                <Button type="submit" onClick={handleOpenMCModal} onKeyDown={handleOpenMCModal}>
                  <FormattedMessage id="choose-multichoice-exercise" />
                </Button>
              </span>
            </div>
          </div>
        </Modal.Content>
      </Modal>
    </>
  )
}

export default SelectExerciseTypeModal
