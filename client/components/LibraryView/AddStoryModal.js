import React, { useState, useEffect } from 'react'
import { Modal } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { Button, FormControl, Spinner } from 'react-bootstrap'
import { learningLanguageSelector, capitalize } from 'Utilities/common'
import { postStory, setCustomUpload } from 'Utilities/redux/uploadProgressReducer'

const AddStoryModal = ({ trigger }) => {
  const maxCharacters = 50000

  const [text, setText] = useState('')
  const [charactersLeft, setCharactersLeft] = useState(maxCharacters)
  const [showModel, setShowModel] = useState(false)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { pending, storyId, progress } = useSelector(({ uploadProgress }) => uploadProgress)

  const dispatch = useDispatch()

  const handleTextChange = e => {
    setCharactersLeft(maxCharacters - e.target.value.length)
    setText(e.target.value)
  }

  const addText = async () => {
    const newStory = {
      language: capitalize(learningLanguage),
      text,
    }
    await dispatch(setCustomUpload(true))
    dispatch(postStory(newStory))
  }

  useEffect(() => {
    if (progress) {
      if (progress == 1) setText('')
      setShowModel(false)
    }
  }, [progress])

  const textTooLong = charactersLeft < 0

  const submitDisabled = !text || pending || storyId || textTooLong || charactersLeft > 49950

  return (
    <Modal
      dimmer="inverted"
      closeIcon
      trigger={trigger}
      onClose={() => setShowModel(false)}
      onOpen={() => setShowModel(true)}
      open={showModel}
    >
      <Modal.Header>
        <FormattedMessage id="add-your-stories" />
      </Modal.Header>
      <Modal.Content style={{ display: 'flex', flexDirection: 'column' }}>
        <span className="bold pb-sm">
          <FormattedMessage id="paste-the-raw-text-you-want-to-add-as-a-story-we-will-use-the-first-sentence-before-an-empty-line-as" />
        </span>
        <span className="bold">
          <FormattedMessage id="characters-left" />
          {` ${charactersLeft}`}
        </span>
        <FormControl
          as="textarea"
          rows={8}
          className="story-text-input"
          value={text}
          onChange={handleTextChange}
        />
        <Button variant="primary" onClick={addText} disabled={submitDisabled}>
          {pending || storyId ? (
            <Spinner animation="border" variant="dark" size="lg" />
          ) : (
            <span>
              <FormattedMessage id="Confirm" />
            </span>
          )}
        </Button>
        {textTooLong && (
          <span className="additional-info">
            <FormattedMessage id="this-text-is-too-long-maximum-50000-characters" />
          </span>
        )}
      </Modal.Content>
    </Modal>
  )
}

export default AddStoryModal
