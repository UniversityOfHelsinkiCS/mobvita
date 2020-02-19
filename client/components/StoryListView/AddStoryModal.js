import React, { useState, useRef } from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from 'react-bootstrap'
import { learningLanguageSelector, capitalize } from 'Utilities/common'
import { postStory } from 'Utilities/redux/uploadProgressReducer'

const AddStoryModal = ({ trigger }) => {
  const intl = useIntl()
  const [text, setText] = useState('')
  const fileInput = useRef()


  const learningLanguage = useSelector(learningLanguageSelector)
  const dispatch = useDispatch()

  const addText = () => {
    const newStory = {
      language: capitalize(learningLanguage),
      text,
    }
    dispatch(postStory(newStory))
  }

  const addFile = () => {
    fileInput.current.files[0].text().then((text) => {
      const newStory = {
        language: capitalize(learningLanguage),
        text,
      }
      dispatch(postStory(newStory))
    })
  }

  return (
    <Modal
      dimmer="inverted"
      closeIcon
      trigger={trigger}
    >
      <Modal.Header><FormattedMessage id="add-your-stories" /></Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <FormattedMessage id="choose-a-file" />
        <div>
          <input type="file" ref={fileInput} />
          <Button variant="primary" onClick={addFile}><FormattedMessage id="Confirm" /></Button>
        </div>
        <hr />
        <FormattedMessage id="or-paste-a-text" />
        <textarea
          placeholder={intl.formatMessage({ id: 'title-on-first-line-text-after-an-empty-line-f2c9245edf5d0379b77008c6db1fd5a9' })}
          className="story-text-input"
          value={text}
          onChange={e => setText(e.target.value)}
        />
        <Button variant="primary" onClick={addText}><FormattedMessage id="Confirm" /></Button>
      </Modal.Content>

    </Modal>
  )
}

export default AddStoryModal
