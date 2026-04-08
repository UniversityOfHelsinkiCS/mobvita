import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { postStory, postFlashcard, setCustomUpload } from 'Utilities/redux/uploadProgressReducer'
import { Button } from 'react-bootstrap'
import { Divider, Popup, Icon } from 'semantic-ui-react'
import {
  learningLanguageSelector,
  dictionaryLanguageSelector,
  useCurrentUser,
  translatableLanguages,
} from 'Utilities/common'
import Spinner from 'Components/Spinner'
import LibraryTabs from 'Components/LibraryTabs'

const UploadFromFile = ({ closeModal, setActiveComponent }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const user = useCurrentUser()

  const [mode, setMode] = useState('story')
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
    setActiveComponent()
    closeModal()
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
    closeModal()
  }

  useEffect(() => {
    if (progress) {
      if (progress === 1) setStoryFile('')
    }
  }, [progress])

  const storyUploading = pending || storyId
  const submitStoryDisabled = !storyFile || storyUploading
  const submitFlashcardDisabled = !flashcardFile || storyUploading

  const tabValues = {
    story: mode === 'story',
    flashcards: mode === 'flashcard',
  }

  return (
    <div>
      <Popup
        hoverable
        positionFixed
        content={mode === 'story' ? <FormattedHTMLMessage id="file-upload-instructions" /> : <FormattedHTMLMessage id="flashcard-upload-instructions" />}
        trigger={<Icon name="info circle" style={{ marginLeft: '4px' }} />}
      />

      <LibraryTabs
        values={tabValues}
        reverse
        onClick={key => {
          setMode(key === 'flashcards' ? 'flashcard' : 'story')
        }}
        additionalClass="library-tabs-white-bg"
        style={{ marginTop: '4px' }}
      />

      <br />

      {mode === 'story' ? (
        <div>
          <input
            id="story"
            name="story"
            type="file"
            accept=".docx, .txt"
            onChange={onStoryChange}
            style={{ display: 'none' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {storyFilename && (
              <div style={{ marginBottom: '6px', fontSize: '0.9em' }}>{storyFilename}</div>
            )}
          </div>

          <div className="upload-from-file-button">
            <Button as="label" htmlFor="story" style={{ minWidth: '10em', margin: 0 }}>
              <FormattedMessage id="choose-a-file" />
            </Button>

            <Button
              disabled={submitStoryDisabled}
              onClick={handleStorySubmit}
              style={{ minWidth: '10em' }}
            >
              {storyUploading ? <Spinner inline /> : <FormattedMessage id="Submit" />}
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div>
            <FormattedMessage id="flashcard-translation-target-language" />
            <select
              disabled={dictionaryOptions.length <= 1}
              value={flashcardLanguage}
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

          <input
            id="flashcard"
            name="flashcard"
            type="file"
            accept=".docx, .txt"
            onChange={onFlashcardChange}
            style={{ display: 'none', marginTop: '16px' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {flashcardFilename && (
              <div style={{ marginBottom: '6px', fontSize: '0.9em' }}>{flashcardFilename}</div>
            )}
          </div>

          <div className="upload-from-file-button">
            <Button as="label" htmlFor="flashcard" style={{ minWidth: '10em', margin: 0 }}>
              <FormattedMessage id="choose-a-file" />
            </Button>

            <Button
              disabled={submitFlashcardDisabled}
              onClick={handleFlashcardSubmit}
              style={{ minWidth: '10em' }}
            >
              {storyUploading ? <Spinner inline /> : <FormattedMessage id="Submit" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadFromFile
