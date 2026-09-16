import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import AppButton from 'Components/AppButton'
import AppIcon from 'Components/ui/AppIcon'
import AppSelect from 'Components/ui/AppSelect'
import AppTabs from 'Components/ui/AppTabs'
import Spinner from 'Components/Spinner'
import { postStory, postFlashcard, setCustomUpload } from 'Utilities/redux/uploadProgressReducer'
import {
  images,
  learningLanguageSelector,
  dictionaryLanguageSelector,
  translatableLanguages,
} from 'Utilities/common'
import { colors } from 'Assets/mui_theme/designTokens'
import { pillButtonSx } from './styles'

// The backend reads .txt and .docx only (see the upload instruction texts).
const ACCEPT = ['.txt', '.docx']
const INFO_IDS = { story: 'file-upload-instructions', flashcard: 'flashcard-upload-instructions' }

const isAccepted = file => ACCEPT.some(ext => file.name.toLowerCase().endsWith(ext))

// Figma "Upload File": Story/Flashcards tabs, a drop zone, the flashcard target language, Submit.
const UploadFromFile = ({ closeModal, setActiveComponent, setInfoId }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const [mode, setMode] = useState('story')
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const learningLanguage = useSelector(learningLanguageSelector)
  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const [flashcardLanguage, setFlashcardLanguage] = useState(dictionaryLanguage)
  const { pending, storyId } = useSelector(({ uploadProgress }) => uploadProgress)

  // The dialog's info tooltip explains the active tab's file format.
  useEffect(() => {
    if (setInfoId) setInfoId(INFO_IDS[mode])
  }, [mode, setInfoId])

  const uploading = Boolean(pending || storyId)
  const dictionaryOptions = (translatableLanguages[learningLanguage] || []).map(language => ({
    value: language,
    label: intl.formatMessage({ id: language }),
  }))

  const pickFile = candidate => {
    if (candidate && isAccepted(candidate)) setFile(candidate)
  }

  const switchMode = nextMode => {
    setMode(nextMode)
    setFile(null)
  }

  const handleDrop = event => {
    event.preventDefault()
    setDragging(false)
    pickFile(event.dataTransfer.files[0])
  }

  const handleSubmit = () => {
    if (!file || uploading) return
    const data = new FormData()
    data.append('file', file)
    dispatch(setCustomUpload(true))
    if (mode === 'story') {
      data.append('language', learningLanguage)
      dispatch(postStory(data))
      setActiveComponent()
    } else {
      data.append('lan_in', learningLanguage)
      data.append('lan_out', flashcardLanguage)
      dispatch(postFlashcard(data))
    }
    closeModal()
  }

  const tabs = [
    {
      value: 'story',
      label: <FormattedMessage id="Story" />,
      icon: <AppIcon src={images.paste} size={20} />,
    },
    {
      value: 'flashcard',
      label: <FormattedMessage id="Flashcards" />,
      icon: <AppIcon src={images.cardsIcon} size={20} />,
    },
  ]

  return (
    <div className="upload-from-file">
      <AppTabs tabs={tabs} value={mode} onChange={switchMode} fullWidth variant="inner" />

      <div className="upload-drop-zone-wrap">
        <label
          htmlFor="upload-file-input"
          className={`upload-drop-zone${dragging ? ' upload-drop-zone-active' : ''}`}
          onDragOver={event => {
            event.preventDefault()
            setDragging(true)
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          data-cy="upload-drop-zone"
        >
          <input
            id="upload-file-input"
            type="file"
            accept={ACCEPT.join(',')}
            hidden
            data-cy="upload-file-input"
            onChange={event => {
              pickFile(event.target.files[0])
              event.target.value = ''
            }}
          />
          {file ? (
            <>
              <AppIcon src={mode === 'flashcard' ? images.cardsIcon : images.paste} size={24} />
              <span data-cy="upload-file-name">{file.name}</span>
            </>
          ) : (
            <>
              <AppIcon src={images.upload} size={24} />
              <span>
                <FormattedMessage id="upload-drop-hint" values={{ u: chunks => <u>{chunks}</u> }} />
              </span>
              <span className="upload-drop-zone-formats">
                ({ACCEPT.map(ext => ext.slice(1)).join(', ')})
              </span>
            </>
          )}
        </label>
        {file && (
          <button
            type="button"
            className="upload-drop-zone-clear"
            aria-label="remove file"
            data-cy="upload-file-clear"
            onClick={() => setFile(null)}
          >
            <AppIcon src={images.xClose} size={16} color={colors.muted} />
          </button>
        )}
      </div>

      {mode === 'flashcard' && (
        <div className="upload-target-language">
          <span>
            <FormattedMessage id="flashcard-translation-target-language" />
          </span>
          <AppSelect
            variant="contrast-outline"
            value={flashcardLanguage}
            onChange={setFlashcardLanguage}
            options={dictionaryOptions}
            disabled={dictionaryOptions.length <= 1}
            minWidth={0}
            matchTriggerWidth
          />
        </div>
      )}

      <AppButton
        block
        sx={pillButtonSx()}
        disabled={!file || uploading}
        onClick={handleSubmit}
        data-cy="upload-file-submit"
      >
        {uploading ? <Spinner inline size={20} /> : <FormattedMessage id="Submit" />}
      </AppButton>
    </div>
  )
}

export default UploadFromFile
