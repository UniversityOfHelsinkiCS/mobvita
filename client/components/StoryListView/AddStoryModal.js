import React, { useState } from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { learningLanguageSelector, capitalize } from 'Utilities/common'
import { postStory } from 'Utilities/redux/uploadProgressReducer'
import { useIntl } from 'react-intl'


const AddStoryModal = ({ trigger }) => {
  const intl = useIntl()
  const [text, setText] = useState('')

  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()

  const addStory = () => {
    const newStory = {
      language: capitalize(learningLanguage),
      text,
    }
    dispatch(postStory(newStory))
  }

  return (
    <Modal
      dimmer="inverted"
      closeIcon
      trigger={trigger}
    >
      <Modal.Header><FormattedMessage id="add-story" /></Modal.Header>
      <Modal.Content>
        <span>Add a text</span>
        <textarea
          placeholder={intl.formatMessage({ id: 'title-on-first-line-text-after-an-empty-line-f2c9245edf5d0379b77008c6db1fd5a9' })}
          className="story-text-input"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <Button variant="primary" onClick={addStory}><FormattedMessage id="Confirm" /></Button>
      </Modal.Content>

    </Modal>
  )
}

export default AddStoryModal
