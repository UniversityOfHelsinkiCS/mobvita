import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { postStory, postFlashcard, setCustomUpload } from 'Utilities/redux/uploadProgressReducer'
import { Spinner, Button, Dropdown } from 'react-bootstrap'
import { Divider } from 'semantic-ui-react'
import { learningLanguageSelector, dictionaryLanguageSelector, useCurrentUser, translatableLanguages } from 'Utilities/common'
import { updateLibrarySelect } from 'Utilities/redux/userReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'

const UploadFromFile = ({ closeModal }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const history = useHistory()
  const user = useCurrentUser()

  const [storyFile, setStoryFile] = useState('')
  const [storyLabel, setStoryLabel] = useState(intl.formatMessage({ id: 'choose-a-file' }))
  const [storyFilename, setStoryFilename] = useState('')
  const [flashcardFile, setFlashcardFile] = useState('')
  const [flashcardLabel, setFlashcardLabel] = useState(intl.formatMessage({ id: 'choose-a-file' }))
  const [flashcardFilename, setFlashcardFilename] = useState('')
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const [flashcardLanguage, setFlashcardLanguage] = useState(dictionaryLanguage)
  const { pending, storyId, progress } = useSelector(({ uploadProgress }) => uploadProgress)

  const dictionaryOptions = translatableLanguages[learningLanguage]
    ? translatableLanguages[learningLanguage].map(element => ({
        key: element,
        value: element,
        text: intl.formatMessage({ id: element }),
      }))
    : []

  const onStoryChange = e => {
    if (e.target.files[0]) {
      setStoryFile(e.target.files[0])
      setStoryLabel(e.target.files[0].name)
      setStoryFilename(e.target.files[0].name)
    }
  }

  const handleStorySubmit = () => {
    const data = new FormData()
    data.append('file', storyFile)
    data.append('language', learningLanguage)
    dispatch(setCustomUpload(true))
    dispatch(postStory(data))
    dispatch(updateLibrarySelect('private'))
    dispatch(setNotification('processing-story', 'info'))
    closeModal()

    if (history.location.pathname !== 'stories') history.push('/library')
  }

  const onFlashcardChange = e => {
    if (e.target.files[0]) {
      setFlashcardFile(e.target.files[0])
      setFlashcardLabel(e.target.files[0].name)
      setFlashcardFilename(e.target.files[0].name)
    }
  }

  const handleFlashcardSubmit = () => {
    const data = new FormData()
    data.append('file', flashcardFile)
    data.append('lan_in', learningLanguage)
    data.append('lan_out', flashcardLanguage)
    dispatch(setCustomUpload(true))
    dispatch(postFlashcard(data))
    dispatch(updateLibrarySelect('private'))
    dispatch(setNotification('processing-story', 'info'))
    closeModal()

    if (history.location.pathname !== 'stories') history.push('/library')
  }

  useEffect(() => {
    if (progress) {
      if (progress === 1) setStoryFile('')
    }
  }, [progress])

  const storyUploading = pending || storyId
  const submitStoryDisabled = !storyFile || storyUploading
  const submitFlashcardDisabled = !flashcardFile || storyUploading

  return (
    <div>
      <br />
      <span className="upload-instructions">
        <FormattedHTMLMessage id="file-upload-instructions" />
      </span>
      <div className="space-evenly pt-lg">
        <input id="story" name="story" type="file" accept=".docx, .txt" onChange={onStoryChange} />
        <label className="file-upload-btn" htmlFor="story">
          {storyLabel}
        </label>
        <Button disabled={submitStoryDisabled} onClick={handleStorySubmit} style={{ minWidth: '10em' }}>
          {storyUploading ? (
            <Spinner animation="border" variant="white" size="lg" />
          ) : (
            <FormattedMessage id="Submit" />
          )}
        </Button>
      </div>
      <Divider />
      <br />
      <span className="upload-instructions">
        <FormattedHTMLMessage id="flashcard-upload-instructions" />
      </span>
      <br />
      <div>
        <FormattedMessage id="flashcard-translation-target-language" />
        <select
          disabled={dictionaryOptions.length <= 1}
          defaultValue={flashcardLanguage}
          style={{
            marginLeft: '0.5em',
            border: 'none',
            color: 'darkSlateGrey',
            backgroundColor: 'white',
            marginBottom: '1em',
          }}
          onChange={e => setFlashcardLanguage(e.target.value)}
        >
          {dictionaryOptions.map(option => (
            <option key={option.key} value={option.value}>
              {option.text}
            </option>
          ))}
        </select>
      </div>
      <div className="space-evenly pt-lg">
        <input id="flashcard" name="flashcard" type="file" accept=".docx, .txt" onChange={onFlashcardChange} />
        <label className="file-upload-btn" htmlFor="flashcard">
          {flashcardLabel}
        </label>
        <Button disabled={submitFlashcardDisabled} onClick={handleFlashcardSubmit} style={{ minWidth: '10em' }}>
          {storyUploading ? (
            <Spinner animation="border" variant="white" size="lg" />
          ) : (
            <FormattedMessage id="Submit" />
          )}
        </Button>
      </div>
    </div>
  )
}

export default UploadFromFile
