import React, { useState, useEffect } from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'

const MultipleChoiceModal = props => {
  const [setOfChoices, setSetOfChoices] = useState([])
  const [customMultiChoice1, setCustomMultiChoice1] = useState('')
  const [customMultiChoice2, setCustomMultiChoice2] = useState('')
  const [customMultiChoice3, setCustomMultiChoice3] = useState('')

  const closeModal = () => {
    props.setOpen(false)
  }

  useEffect(() => {
    if (props.word.choices) {
      console.log('PASS')
      Object.keys(props.word.choices).map(key => console.log(props.word.choices[key][0]))
    }
  }, [])

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
        <div onClick={props.handleAddMultichoiceExercise}>
          {props.word.surface}
          {props.word.choices &&
            Object.keys(props.word.choices).map(key => (
              <div>
                {props.word.choices[key].map(choice => (
                  <input type="text" value={choice} disabled />
                ))}
                <hr />
              </div>
            ))}
          <div>
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
          </div>
        </div>
      </Modal.Content>
    </Modal>
  )
}

export default MultipleChoiceModal
