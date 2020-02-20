import React, { useState } from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { learningLanguageSelector, capitalize } from 'Utilities/common'
import { postStory } from 'Utilities/redux/uploadProgressReducer'

const AddStoryModal = ({ trigger }) => {
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')


  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()

  const addText = () => {
    const combinedText = `${title}\n\n${text}`
    const newStory = {
      language: capitalize(learningLanguage),
      text: combinedText,
    }
    dispatch(postStory(newStory))
  }


  return (
    <Modal
      dimmer="inverted"
      closeIcon
      trigger={trigger}
    >
      <Modal.Header><FormattedMessage id="add-your-stories" /></Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <FormattedMessage id="Subject" />
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          className="story-text-input"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <Button
          variant="primary"
          onClick={addText}
          disabled={!title || !text}
        >
          <FormattedMessage id="Confirm" />
        </Button>
      </Modal.Content>

    </Modal>
  )
}

export default AddStoryModal
