import React, { useState } from 'react'
import { Modal, Popup, Icon, Form } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'

const MultipleChoiceModal = props => {
  const [chosenSet, setChosenSet] = useState('custom')
  const [customMultiChoice1, setCustomMultiChoice1] = useState('')
  const [customMultiChoice2, setCustomMultiChoice2] = useState('')
  const [customMultiChoice3, setCustomMultiChoice3] = useState('')

  const closeModal = () => {
    props.setOpen(false)
  }

  const handleSubmitChoices = async () => {
    if (chosenSet !== 'custom') {
      props.handleAddMultichoiceExercise(props.word.choices[chosenSet])
    } else {
      const customSet = [
        props.word.surface,
        customMultiChoice1,
        customMultiChoice2,
        customMultiChoice3,
      ]
      props.handleAddMultichoiceExercise(customSet.filter(word => word !== ''))
    }
  }

  return (
    <Modal
      basic
      open={props.open}
      size="small"
      centered={false}
      closeIcon={{ style: { top: '2.5rem', right: '2.5rem' }, color: 'black', name: 'close' }}
      onClose={closeModal}
    >
      <Modal.Content>
        <div className="encouragement">
          <div style={{ position: 'relative' }}>
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
          </div>
          <hr />
          <Form
            style={{
              marginBottom: '0.5em',
              marginTop: '0.5em',
            }}
            onSubmit={handleSubmitChoices}
          >
            {props.word.choices &&
              Object.keys(props.word.choices).map(key => (
                <div>
                  <Form.Group>
                    <Form.Input
                      style={{ marginTop: '0.9em', marginLeft: '0.5em', marginRight: '0.75em' }}
                      type="radio"
                      onChange={() => setChosenSet(key)}
                      checked={chosenSet === key}
                    />
                    <input
                      className="multi-choice-input"
                      type="text"
                      name="disable_field"
                      value={props.word.surface}
                      disabled
                    />
                    {props.word.choices[key]
                      .filter(choice => choice !== props.word.surface)
                      .map(choice => (
                        <input
                          className="multi-choice-input"
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
            <div>
              <Form.Group>
                <Form.Input
                  style={{ marginTop: '0.9em', marginLeft: '0.5em', marginRight: '0.75em' }}
                  type="radio"
                  onChange={() => setChosenSet('custom')}
                  checked={chosenSet === 'custom'}
                />
                <input
                  className="multi-choice-input"
                  type="text"
                  name="disable_field"
                  value={props.word.surface}
                  disabled
                />
                <input
                  className="multi-choice-input"
                  type="text"
                  value={customMultiChoice1}
                  onChange={({ target }) => setCustomMultiChoice1(target.value)}
                />
                <input
                  className="multi-choice-input"
                  type="text"
                  value={customMultiChoice2}
                  onChange={({ target }) => setCustomMultiChoice2(target.value)}
                />
                <input
                  className="multi-choice-input"
                  type="text"
                  value={customMultiChoice3}
                  onChange={({ target }) => setCustomMultiChoice3(target.value)}
                />
              </Form.Group>
              <hr />
              <Button style={{ marginBottom: '0.5em', marginLeft: '0.5em'}}type="submit">Submit</Button>
            </div>
          </Form>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default MultipleChoiceModal
