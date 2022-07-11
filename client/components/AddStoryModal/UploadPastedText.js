import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { postStory, setCustomUpload } from 'Utilities/redux/uploadProgressReducer'
import { FormControl, Spinner, Button } from 'react-bootstrap'
import { capitalize, learningLanguageSelector } from 'Utilities/common'
import { updateLibrarySelect } from 'Utilities/redux/userReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'

const UploadPastedText = ({ closeModal }) => {
  const intl = useIntl()
  const history = useHistory()
  const maxCharacters = 50000
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [charactersLeft, setCharactersLeft] = useState(maxCharacters)
  const [titleTaken, setTitleTaken] = useState(false)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { pending, storyId, progress } = useSelector(({ uploadProgress }) => uploadProgress)
  const { data } = useSelector(({ stories }) => stories)
  const dispatch = useDispatch()

  const handleTextChange = e => {
    setCharactersLeft(maxCharacters - e.target.value.length)
    setText(e.target.value)
  }

  const addText = async () => {
    const storyWithSameTitle = data.find(story => story.title === title)
    if (!storyWithSameTitle) {
      const combineTitleAndText = `${title}\n${text}`
      const newStory = {
        language: capitalize(learningLanguage),
        text: combineTitleAndText,
      }

      dispatch(updateLibrarySelect('private'))
      dispatch(setCustomUpload(true))
      await dispatch(postStory(newStory))
      dispatch(setNotification('processing-story', 'info'))
      closeModal()

      if (history.location.pathname !== 'library') history.push('/library')
    } else {
      setTitleTaken(true)
    }
  }

  useEffect(() => {
    if (progress) {
      if (progress === 1) setText('')
    }
  }, [progress])

  const textTooLong = charactersLeft < 0
  const submitDisabled =
    !text || pending || storyId || textTooLong || charactersLeft > 49950 || title.length < 3

  return (
    <div>
      <br />
      <span className="pb-sm upload-instructions">
        <FormattedHTMLMessage id="paste-text-upload-instructions" />
      </span>
      <FormControl
        as="input"
        value={title}
        style={{ marginTop: '1em', marginBottom: '1em' }}
        onChange={({ target }) => setTitle(target.value)}
        placeholder={intl.formatMessage({ id: 'story-title' })}
      />
      <FormControl
        as="textarea"
        rows={8}
        className="story-text-input"
        value={text}
        onChange={handleTextChange}
        style={{ marginTop: '1em', marginBottom: '1em' }}
      />
      <div>
        <div className="bold">
          <FormattedMessage id="characters-left" />
          {` ${charactersLeft}`}
        </div>
        <div className="row-flex">
          <Button onClick={addText} disabled={submitDisabled} style={{ marginTop: '1em' }}>
            {pending || storyId ? (
              <Spinner animation="border" variant="dark" size="lg" />
            ) : (
              <span>
                <FormattedMessage id="Confirm" />
              </span>
            )}
          </Button>
          {titleTaken && (
            <span style={{ marginLeft: '.5em', marginTop: '.75em', color: '#FF0000' }}>
              <FormattedMessage id="story-title-already-taken" />
            </span>
          )}
        </div>
      </div>
      {textTooLong && (
        <span className="additional-info" style={{ marginTop: '.5en' }}>
          <FormattedMessage id="this-text-is-too-long-maximum-50000-characters" />
        </span>
      )}
    </div>
  )
}

export default UploadPastedText
