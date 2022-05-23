import React, { useState } from 'react'
import { Modal } from 'semantic-ui-react'
import { Button } from 'react-bootstrap'
import { FormattedMessage } from 'react-intl'
import MultipleChoiceModal from './MultipleChoicesModal'

const SelectExerciseTypeModal = props => {
  const [showChoices, setShowChoices] = useState(false)

  const closeModal = () => {
    props.setShowExerciseOptionsModal(false)
  }

  return (
    <>
      <MultipleChoiceModal
        open={showChoices}
        setOpen={setShowChoices}
        handleAddMultichoiceExercise={props.handleAddMultichoiceExercise}
        word={props.word}
      />
      <Modal
        basic
        open={props.showExerciseOptionsModal}
        size="tiny"
        centered={false}
        closeIcon={{ style: { top: '2.5rem', right: '2.5rem' }, color: 'black', name: 'close' }}
        onClose={closeModal}
      >
        <Modal.Content>
          <div className="encouragement">
            <div className="pt-sm" style={{ color: '#000000' }}>
              <FormattedMessage id="choose-exercise-type" />
            </div>
            <hr />
            <div>
              <span style={{ margin: '0.25em' }}>
                <Button
                  type="submit"
                  onClick={props.handleAddClozeExercise}
                  onKeyDown={props.handleAddClozeExercise}
                >
                  <FormattedMessage id="choose-cloze-exercise" />
                </Button>
              </span>
              <span style={{ margin: '0.25em' }}>
                <Button
                  type="submit"
                  onClick={props.handleAddHearingExercise}
                  onKeyDown={props.handleAddHearingExercise}
                >
                  <FormattedMessage id="choose-listening-exercise" />
                </Button>
              </span>
              <span style={{ margin: '0.25em' }}>
                <Button
                  type="submit"
                  onClick={() => setShowChoices(true)}
                  onKeyDown={() => setShowChoices(true)}
                >
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
