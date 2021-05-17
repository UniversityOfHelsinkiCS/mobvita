import React, { useState, useEffect } from 'react'
import { Button } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { postStory, setCustomUpload } from 'Utilities/redux/uploadProgressReducer'
import { FormControl, Spinner } from 'react-bootstrap'
import { capitalize, learningLanguageSelector } from 'Utilities/common'
import { updateLibrarySelect } from 'Utilities/redux/userReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'

const UploadPastedText = ({ closeModal }) => {
  const history = useHistory()
  const maxCharacters = 50000
  const [text, setText] = useState('')
  const [charactersLeft, setCharactersLeft] = useState(maxCharacters)
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
    dispatch(updateLibrarySelect('private'))
    dispatch(setCustomUpload(true))
    await dispatch(postStory(newStory))
    dispatch(setNotification('processing-story', 'info'))
    closeModal()

    if (history.location.pathname !== 'library') history.push('/library')
  }

  useEffect(() => {
    if (progress) {
      if (progress === 1) setText('')
    }
  }, [progress])

  const textTooLong = charactersLeft < 0
  const submitDisabled = !text || pending || storyId || textTooLong || charactersLeft > 49950

  return (
    <div>
      <br />
      <span className="pb-sm">
        <FormattedHTMLMessage id="paste-text-upload-instructions" />
      </span>
      <FormControl
        as="textarea"
        rows={8}
        className="story-text-input"
        value={text}
        onChange={handleTextChange}
        style={{ marginTop: '1em' }}
      />
      <span className="bold" style={{ marginRight: '1em' }}>
        <FormattedMessage id="characters-left" />
        {` ${charactersLeft}`}
      </span>
      <Button primary onClick={addText} disabled={submitDisabled} style={{ margin: '1em' }}>
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
    </div>
  )
}

export default UploadPastedText
