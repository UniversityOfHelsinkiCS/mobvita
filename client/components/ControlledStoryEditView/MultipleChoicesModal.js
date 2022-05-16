import React, { useState } from 'react'
import { Modal } from 'semantic-ui-react'
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
          <form onSubmit={handleSubmitChoices}>
            {props.word.choices &&
              Object.keys(props.word.choices).map(key => (
                <div>
                  <input type="text" value={props.word.surface} disabled />
                  {props.word.choices[key].map(choice => (
                    <input type="text" value={choice} disabled />
                  ))}
                  <input
                    type="radio"
                    onChange={() => setChosenSet(key)}
                    checked={chosenSet === key}
                  />
                  <hr />
                </div>
              ))}
            <div>
              <input type="text" value={props.word.surface} disabled />
              <input
                type="text"
                value={customMultiChoice1}
                onChange={({ target }) => setCustomMultiChoice1(target.value)}
              />
              <input
                type="text"
                value={customMultiChoice2}
                onChange={({ target }) => setCustomMultiChoice2(target.value)}
              />
              <input
                type="text"
                value={customMultiChoice3}
                onChange={({ target }) => setCustomMultiChoice3(target.value)}
              />
              <input
                type="radio"
                onChange={() => setChosenSet('custom')}
                checked={chosenSet === 'custom'}
              />
              <hr />
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default MultipleChoiceModal
