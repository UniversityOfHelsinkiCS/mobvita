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
  const [chosenSet, setChosenSet] = useState('custom')
  const [customMultiChoice1, setCustomMultiChoice1] = useState('')
  const [customMultiChoice2, setCustomMultiChoice2] = useState('')
  const [customMultiChoice3, setCustomMultiChoice3] = useState('')

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
      <Draggable>
        <div className="draggable-modal">
          <div>
            <div>
              <Popup
                content={
                  <div style={{ padding: '0.75em' }}>
                    <FormattedMessage id="multiple-choice-tooltip" />
                  </div>
                }
                trigger={
                  <Icon
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
                style={{
                  marginBottom: '0.5em',
                  marginTop: '0.5em',
                }}
                onSubmit={handleSubmitChoices}
              >
                {word.choices &&
                  Object.keys(word.choices).map(key => (
                    <div>
                      <Form.Group>
                        <Form.Input
                          style={{ marginTop: '0.9em', marginLeft: '0.5em', marginRight: '0.75em' }}
                          type="radio"
                          onChange={() => setChosenSet(key)}
                          checked={chosenSet === key}
                        />
                        {word.choices[key]
                          .filter(choice => choice !== analyticChunkWord?.surface || word.surface)
                          .map(choice => (
                            <input
                              className={
                                bigScreen && containsLongInput
                                ? 'multi-choice-long-input'
                                : bigScreen
                                ? 'multi-choice-input'
                                : 'multi-choice-input-mobile'
                              }
                              type="text"
                              name="disable_field"
                              disabled
                              value={choice}
                            />
                          ))}
                      </Form.Group>
                      <hr />
                    </div>
                  ))}
                {word.stress && word.stressed && (
                  <Form.Group>
                    <Form.Input
                      style={{ marginTop: '0.9em', marginLeft: '0.5em', marginRight: '0.75em' }}
                      type="radio"
                      onChange={() => setChosenSet('stress')}
                      checked={chosenSet === 'stress'}
                    />
                    {word.stress.map(choice => (
                      <input
                        className={
                          bigScreen && containsLongInput
                            ? 'multi-choice-long-input'
                            : bigScreen
                            ? 'multi-choice-input'
                            : 'multi-choice-input-mobile'
                        }
                        type="text"
                        name="disable_field"
                        disabled
                        value={choice}
                      />
                    ))}
                  </Form.Group>
                )}
                <div style={{ marginRight: '0.5em' }}>
                  <Form.Group>
                    <Form.Input
                      style={{ marginTop: '0.9em', marginLeft: '0.5em', marginRight: '0.75em' }}
                      type="radio"
                      onChange={() => setChosenSet('custom')}
                      checked={chosenSet === 'custom'}
                    />
                    <input
                      className={
                        bigScreen && containsLongInput
                          ? 'multi-choice-long-input'
                          : bigScreen
                          ? 'multi-choice-input'
                          : 'multi-choice-input-mobile'
                      }
                      type="text"
                      name="disable_field"
                      value={analyticChunkWord?.surface || word.surface}
                      disabled
                    />
                    <input
                      className={
                        bigScreen && containsLongInput
                          ? 'multi-choice-long-input'
                          : bigScreen
                          ? 'multi-choice-input'
                          : 'multi-choice-input-mobile'
                      }
                      type="text"
                      value={customMultiChoice1}
                      onChange={({ target }) => setCustomMultiChoice1(target.value)}
                    />
                    <input
                      className={
                        bigScreen && containsLongInput
                          ? 'multi-choice-long-input'
                          : bigScreen
                          ? 'multi-choice-input'
                          : 'multi-choice-input-mobile'
                      }
                      type="text"
                      value={customMultiChoice2}
                      onChange={({ target }) => setCustomMultiChoice2(target.value)}
                    />
                    <input
                      className={
                        bigScreen && containsLongInput
                          ? 'multi-choice-long-input'
                          : bigScreen
                          ? 'multi-choice-input'
                          : 'multi-choice-input-mobile'
                      }
                      type="text"
                      value={customMultiChoice3}
                      onChange={({ target }) => setCustomMultiChoice3(target.value)}
                    />
                  </Form.Group>
                  {showValidationMessage && (
                    <div style={{ color: '#FF0000', marginLeft: '0.5em', marginBottom: '0.5em' }}>
                      <FormattedMessage id="multiple-choice-validation" />
                    </div>
                  )}
                  <Button
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
