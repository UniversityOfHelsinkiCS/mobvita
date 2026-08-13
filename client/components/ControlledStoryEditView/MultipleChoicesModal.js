/* eslint-disable no-nested-ternary */
import React, { useState } from 'react'
import Draggable from 'react-draggable'
import Box from '@mui/material/Box'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CloseIcon from '@mui/icons-material/Close'
import AppRadio from 'Components/ui/AppRadio'
import CustomTooltip from 'Components/CustomTooltip'
import { FormattedMessage } from 'react-intl'
import useWindowDimension from 'Utilities/windowDimensions'
import AppButton from 'Components/AppButton'
import MCFeedbackList from './MCFeedbackList'
import AddFeedbackInput from './AddFeedbackInput'

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
  const [feedbackList, setFeedbackList] = useState([])
  const [customFeedback, setCustomFeedback] = useState('')
  const bigScreen = useWindowDimension().width >= 650

  const addFeedback = () => {
    setFeedbackList(feedbackList.concat(customFeedback))
    setCustomFeedback('')
  }

  const removeFeedback = index =>
    setFeedbackList(feedbackList.filter((feedback, feedbackIndex) => feedbackIndex !== index))

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
        word.surface,
        'custom_concept_id',
        feedbackList
      )
    } else if (chosenSet === 'stress') {
      handleAddMultichoiceExercise(word.stress, word.stressed, 'Stress-*', feedbackList)
    } else {
      handleAddMultichoiceExercise(word.choices[chosenSet], word.surface, chosenSet, feedbackList)
    }
  }

  // semantic-ui's <Form> called preventDefault on submit itself; a plain <form> must do it here.
  const handleFormSubmit = event => {
    event.preventDefault()
    handleSubmitChoices()
  }

  const radioSx = {
    p: 0,
    alignSelf: 'flex-start',
    marginTop: '0.9em',
    marginLeft: '0.5em',
    marginRight: '0.75em',
  }

  if (open) {
    return (
      <Draggable cancel=".interactable">
        <div className="draggable-modal">
          <div>
            <div>
              <CustomTooltip
                permanent
                title={
                  <div style={{ padding: '0.75em' }}>
                    <FormattedMessage id="multiple-choice-tooltip" />
                  </div>
                }
              >
                <span className="interactable" style={{ display: 'inline-flex' }}>
                  <InfoOutlinedIcon
                    className="interactable"
                    sx={{
                      color: 'grey',
                      paddingRight: '0.75em',
                      marginBottom: '0.5em',
                      marginLeft: '0.75em',
                      marginTop: '0.75em',
                    }}
                  />
                </span>
              </CustomTooltip>
              <span className="pt-sm" style={{ color: '#000000' }}>
                <FormattedMessage id="pick-choices" />
              </span>
              <CloseIcon
                className="interactable"
                data-cy="mc-modal-close"
                sx={{
                  cursor: 'pointer',
                  paddingRight: '0.75em',
                  marginBottom: '0.5em',
                  marginLeft: '0.75em',
                  marginTop: '0.75em',
                }}
                fontSize="large"
                onClick={closeModal}
              />
            </div>
          </div>
          <hr />
          <div>
            <div style={{ marginRight: '0.5em' }}>
              <form
                className="interactable"
                style={{
                  marginBottom: '0.5em',
                  marginTop: '0.5em',
                }}
                onSubmit={handleFormSubmit}
              >
                {word.choices && bigScreen ? (
                  Object.keys(word.choices).map(key => (
                    <div>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <AppRadio
                          className="interactable"
                          slotProps={{ input: { 'data-cy': `mc-modal-choice-set-${key}` } }}
                          sx={radioSx}
                          onChange={() => setChosenSet(key)}
                          checked={chosenSet === key}
                        />
                        {word.choices[key]
                          .filter(choice => choice !== analyticChunkWord?.surface || word.surface)
                          .map(choice => (
                            <input
                              className={`${
                                containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'
                              } interactable`}
                              type="text"
                              name="disable_field"
                              disabled
                              value={choice}
                            />
                          ))}
                      </Box>
                      <hr />
                    </div>
                  ))
                ) : word.choices ? (
                  Object.keys(word.choices).map(key => (
                    <div className="flex" style={{ alignItems: 'center', marginTop: '.5em' }}>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        <AppRadio
                          className="interactable"
                          slotProps={{ input: { 'data-cy': `mc-modal-choice-set-${key}` } }}
                          sx={radioSx}
                          onChange={() => setChosenSet(key)}
                          checked={chosenSet === key}
                        />
                        <div className="flex-col" style={{ marginLeft: '.5em' }}>
                          {word.choices[key]
                            .filter(choice => choice !== analyticChunkWord?.surface || word.surface)
                            .map(choice => (
                              <input
                                className={`${
                                  containsLongInput
                                    ? 'multi-choice-long-input'
                                    : 'multi-choice-input'
                                } interactable`}
                                type="text"
                                name="disable_field"
                                disabled
                                value={choice}
                              />
                            ))}
                        </div>
                      </Box>
                      <hr />
                    </div>
                  ))
                ) : (
                  <></>
                )}
                {word.stress && word.stressed && bigScreen ? (
                  <div>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      <AppRadio
                        className="interactable"
                        slotProps={{ input: { 'data-cy': 'mc-modal-choice-set-stress' } }}
                        sx={radioSx}
                        onChange={() => setChosenSet('stress')}
                        checked={chosenSet === 'stress'}
                      />
                      {word.stress.map(choice => (
                        <input
                          className={`${
                            containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'
                          } interactable`}
                          type="text"
                          name="disable_field"
                          disabled
                          value={choice}
                        />
                      ))}
                    </Box>
                    <hr />
                  </div>
                ) : word.stress && word.stressed ? (
                  <div className="flex" style={{ alignItems: 'center', marginTop: '.5em' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      <AppRadio
                        className="interactable"
                        slotProps={{ input: { 'data-cy': 'mc-modal-choice-set-stress' } }}
                        sx={radioSx}
                        onChange={() => setChosenSet('stress')}
                        checked={chosenSet === 'stress'}
                      />
                      <div className="flex-col" style={{ marginLeft: '.5em' }}>
                        {word.stress.map(choice => (
                          <input
                            className={`${
                              containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'
                            } interactable`}
                            type="text"
                            name="disable_field"
                            disabled
                            value={choice}
                          />
                        ))}
                      </div>
                    </Box>
                    <hr />
                  </div>
                ) : (
                  <></>
                )}
                <div style={{ marginRight: '0.5em' }}>
                  {bigScreen ? (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      <AppRadio
                        className="interactable"
                        slotProps={{ input: { 'data-cy': 'mc-modal-choice-set-custom' } }}
                        sx={radioSx}
                        onChange={() => setChosenSet('custom')}
                        checked={chosenSet === 'custom'}
                      />
                      <input
                        className={`${
                          containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'
                        } interactable`}
                        type="text"
                        name="disable_field"
                        value={analyticChunkWord?.surface || word.surface}
                        disabled
                      />
                      <input
                        className={`${
                          containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'
                        } interactable`}
                        type="text"
                        data-cy="mc-modal-custom-choice-1"
                        value={customMultiChoice1}
                        onChange={({ target }) => setCustomMultiChoice1(target.value)}
                      />
                      <input
                        className={`${
                          containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'
                        } interactable`}
                        type="text"
                        data-cy="mc-modal-custom-choice-2"
                        value={customMultiChoice2}
                        onChange={({ target }) => setCustomMultiChoice2(target.value)}
                      />
                      <input
                        className={`${
                          containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'
                        } interactable`}
                        type="text"
                        data-cy="mc-modal-custom-choice-3"
                        value={customMultiChoice3}
                        onChange={({ target }) => setCustomMultiChoice3(target.value)}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                      <div className="flex" style={{ alignItems: 'center', marginTop: '.5em' }}>
                        <AppRadio
                          className="interactable"
                          slotProps={{ input: { 'data-cy': 'mc-modal-choice-set-custom' } }}
                          sx={radioSx}
                          onChange={() => setChosenSet('custom')}
                          checked={chosenSet === 'custom'}
                        />
                        <div className="col-flex" style={{ marginLeft: '.5em' }}>
                          <input
                            className={`${
                              containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'
                            } interactable`}
                            type="text"
                            name="disable_field"
                            value={analyticChunkWord?.surface || word.surface}
                            disabled
                          />
                          <input
                            className={`${
                              containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'
                            } interactable`}
                            type="text"
                            data-cy="mc-modal-custom-choice-1"
                            value={customMultiChoice1}
                            onChange={({ target }) => setCustomMultiChoice1(target.value)}
                          />
                          <input
                            className={`${
                              containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'
                            } interactable`}
                            type="text"
                            data-cy="mc-modal-custom-choice-2"
                            value={customMultiChoice2}
                            onChange={({ target }) => setCustomMultiChoice2(target.value)}
                          />
                          <input
                            className={`${
                              containsLongInput ? 'multi-choice-long-input' : 'multi-choice-input'
                            } interactable`}
                            type="text"
                            data-cy="mc-modal-custom-choice-3"
                            value={customMultiChoice3}
                            onChange={({ target }) => setCustomMultiChoice3(target.value)}
                          />
                        </div>
                      </div>
                    </Box>
                  )}
                  {showValidationMessage && (
                    <div
                      style={{ color: '#FF0000', marginLeft: '0.5em', marginBottom: '0.5em' }}
                      data-cy="mc-modal-validation-message"
                    >
                      <FormattedMessage id="multiple-choice-validation" />
                    </div>
                  )}
                  <AddFeedbackInput
                    addFeedback={addFeedback}
                    customFeedback={customFeedback}
                    setCustomFeedback={setCustomFeedback}
                  />
                  <MCFeedbackList feedbackList={feedbackList} removeFeedback={removeFeedback} />
                  <AppButton
                    className="interactable"
                    style={{ marginBottom: '0.5em', marginLeft: '0.5em', marginTop: '0.5em' }}
                    type="submit"
                    data-cy="mc-modal-submit"
                  >
                    Submit
                  </AppButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Draggable>
    )
  }

  return null
}

export default MultipleChoiceModal
