/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'
import Draggable from 'react-draggable'
import { Popup, Icon, Form } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import useWindowDimension from 'Utilities/windowDimensions'
import { Button } from 'react-bootstrap'

const MultipleChoiceModal = ({
  open,
  setOpen,
  handleAddMultichoiceExercise,
  word,
  analyticChunkWord,
  showValidationMessage,
}) => {
  const [customMultiChoice1, setCustomMultiChoice1] = useState('')
  const [customMultiChoice2, setCustomMultiChoice2] = useState('')
  const [customMultiChoice3, setCustomMultiChoice3] = useState('')
  const [chosenSet, setChosenSet] = useState(word.choices ? Object.keys(word.choices)[0] : 'custom')
  const bigScreen = useWindowDimension().width >= 650

  const longInput = () => {
    let max = word.surface.length
    if (word.choices) {
      Object.keys(word.choices).map(key =>
        word.choices[key].forEach(option => (max = Math.max(max, option.length)))
      )
    }
    if (word.stress && word.stressed) {
      word.stress.forEach(stressOption => (max = Math.max(max, stressOption.length)))
    }

    if (max > 15) {
      return true
    }

    return false
  }

  const containsLongInput = longInput()

  const closeModal = () => {
    setOpen(false)
  }

  const handleSubmitChoices = async () => {
    if (chosenSet === 'custom') {
      const customSet = [
        analyticChunkWord?.surface || word.surface,
        customMultiChoice1,
        customMultiChoice2,
        customMultiChoice3,
      ]
      handleAddMultichoiceExercise(
        customSet.filter(word => word !== ''),
        word.surface
      )
    } else if (chosenSet === 'stress') {
      handleAddMultichoiceExercise(word.stress, word.stressed)
    } else {
      handleAddMultichoiceExercise(word.choices[chosenSet], word.surface)
    }
  }

  if (open) {
    return (
      <Draggable cancel=".interactable">
        <div className="draggable-modal">
          <div>
            <div>
              <Popup
                className="interactable"
                content={
                  <div style={{ padding: '0.75em' }}>
                    <FormattedMessage id="multiple-choice-tooltip" />
                  </div>
                }
                trigger={
                  <Icon
                    className="interactable"
                    style={{
                      paddingRight: '0.75em',
                      marginBottom: '0.5em',
                      marginLeft: '0.75em',
                      marginTop: '0.75em',
                    }}
                    name="info circle"
                    color="grey"
                  />
                }
              />
              <span className="pt-sm" style={{ color: '#000000' }}>
                <FormattedMessage id="pick-choices" />
              </span>
              <Icon
                className="interactable"
                style={{
                  cursor: 'pointer',
                  paddingRight: '0.75em',
                  marginBottom: '0.5em',
                  marginLeft: '0.75em',
                  marginTop: '0.75em',
                }}
                size="large"
                name="close"
                onClick={closeModal}
              />
            </div>
          </div>
          <hr />
          <div>
            <div style={{ marginRight: '0.5em' }}>
              <Form
                className="interactable"
                style={{
                  marginBottom: '0.5em',
                  marginTop: '0.5em',
                }}
                onSubmit={handleSubmitChoices}
              >
                {word.choices && bigScreen ? (
                  Object.keys(word.choices).map(key => (
                    <div>
                      <Form.Group>
                        <Form.Input
                          className="interactable"
                          style={{ marginTop: '0.9em', marginLeft: '0.5em', marginRight: '0.75em' }}
                          type="radio"
                          onChange={() => setChosenSet(key)}
                          checked={chosenSet === key}
                        />
                        {word.choices[key]
                          .filter(choice => choice !== analyticChunkWord?.surface || word.surface)
                          .map(choice => (
                            <input
                              className={`${containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'} interactable`}
                              type="text"
                              name="disable_field"
                              disabled
                              value={choice}
                            />
                          ))}
                      </Form.Group>
                      <hr />
                    </div>
                  ))
                ) : word.choices ? (
                  Object.keys(word.choices).map(key => (
                    <div className="flex" style={{ alignItems: 'center', marginTop: '.5em' }}>
                      <Form.Group>
                        <Form.Input
                          className="interactable"
                          style={{ marginTop: '0.9em', marginLeft: '0.5em', marginRight: '0.75em' }}
                          type="radio"
                          onChange={() => setChosenSet(key)}
                          checked={chosenSet === key}
                        />
                        <div className="flex-col" style={{ marginLeft: '.5em' }}>
                          {word.choices[key]
                            .filter(choice => choice !== analyticChunkWord?.surface || word.surface)
                            .map(choice => (
                              <input
                                className={`${containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'} interactable`}
                                type="text"
                                name="disable_field"
                                disabled
                                value={choice}
                              />
                            ))}
                        </div>
                      </Form.Group>
                      <hr />
                    </div>
                  ))
                ) : (
                  <></>
                )}
                {word.stress && word.stressed && bigScreen ? (
                  <div>
                    <Form.Group> 
                      <Form.Input
                        className="interactable"
                        style={{ marginTop: '0.9em', marginLeft: '0.5em', marginRight: '0.75em' }}
                        type="radio"
                        onChange={() => setChosenSet('stress')}
                        checked={chosenSet === 'stress'}
                      />
                      {word.stress.map(choice => (
                        <input
                          className={`${containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'} interactable`}
                          type="text"
                          name="disable_field"
                          disabled
                          value={choice}
                        />
                      ))}
                    </Form.Group>
                    <hr />
                  </div>
                ) : word.stress && word.stressed ? (
                  <div className="flex" style={{ alignItems: 'center', marginTop: '.5em' }}>
                    <Form.Group>
                      <Form.Input
                        className="interactable"
                        style={{ marginTop: '0.9em', marginLeft: '0.5em', marginRight: '0.75em' }}
                        type="radio"
                        onChange={() => setChosenSet('stress')}
                        checked={chosenSet === 'stress'}
                      />
                      <div className="flex-col" style={{ marginLeft: '.5em' }}>
                        {word.stress.map(choice => (
                          <input
                            className={`${containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'} interactable`}
                            type="text"
                            name="disable_field"
                            disabled
                            value={choice}
                          />
                        ))}
                      </div>
                    </Form.Group>
                    <hr />
                  </div>
                ) : (
                  <></>
                )}
                <div style={{ marginRight: '0.5em' }}>
                  {bigScreen ? (
                    <Form.Group>
                      <Form.Input
                        className="interactable"
                        style={{ marginTop: '0.9em', marginLeft: '0.5em', marginRight: '0.75em' }}
                        type="radio"
                        onChange={() => setChosenSet('custom')}
                        checked={chosenSet === 'custom'}
                      />
                      <input
                        className={`${containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'} interactable`}
                        type="text"
                        name="disable_field"
                        value={analyticChunkWord?.surface || word.surface}
                        disabled
                      />
                      <input
                        className={`${containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'} interactable`}
                        type="text"
                        value={customMultiChoice1}
                        onChange={({ target }) => setCustomMultiChoice1(target.value)}
                      />
                      <input
                        className={`${containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'} interactable`}
                        type="text"
                        value={customMultiChoice2}
                        onChange={({ target }) => setCustomMultiChoice2(target.value)}
                      />
                      <input
                        className={`${containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'} interactable`}
                        type="text"
                        value={customMultiChoice3}
                        onChange={({ target }) => setCustomMultiChoice3(target.value)}
                      />
                    </Form.Group>
                  ) : (
                    <Form.Group>
                      <div className="flex" style={{ alignItems: 'center', marginTop: '.5em' }}>
                        <Form.Input
                          className="interactable"
                          style={{ marginTop: '0.9em', marginLeft: '0.5em', marginRight: '0.75em' }}
                          type="radio"
                          onChange={() => setChosenSet('custom')}
                          checked={chosenSet === 'custom'}
                        />
                        <div className="col-flex" style={{ marginLeft: '.5em' }}>
                          <input
                            className={`${containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'} interactable`}
                            type="text"
                            name="disable_field"
                            value={analyticChunkWord?.surface || word.surface}
                            disabled
                          />
                          <input
                            className={`${containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'} interactable`}
                            type="text"
                            value={customMultiChoice1}
                            onChange={({ target }) => setCustomMultiChoice1(target.value)}
                          />
                          <input
                            className={`${containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'} interactable`}
                            type="text"
                            value={customMultiChoice2}
                            onChange={({ target }) => setCustomMultiChoice2(target.value)}
                          />
                          <input
                            className={`${containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'} interactable`}
                            type="text"
                            value={customMultiChoice3}
                            onChange={({ target }) => setCustomMultiChoice3(target.value)}
                          />
                        </div>
                      </div>
                    </Form.Group>
                  )}
                  {showValidationMessage && (
                    <div style={{ color: '#FF0000', marginLeft: '0.5em', marginBottom: '0.5em' }}>
                      <FormattedMessage id="multiple-choice-validation" />
                    </div>
                  )}
                  <Button
                    className="interactable"
                    style={{ marginBottom: '0.5em', marginLeft: '0.5em', marginTop: '0.5em' }}
                    type="submit"
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </Draggable>
    )
  }

  return null
}

export default MultipleChoiceModal
