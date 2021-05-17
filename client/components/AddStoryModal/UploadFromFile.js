import React, { useState, useEffect } from 'react'
import { Button } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { postStory, setCustomUpload } from 'Utilities/redux/uploadProgressReducer'
import { Spinner } from 'react-bootstrap'
import { learningLanguageSelector } from 'Utilities/common'
import { updateLibrarySelect } from 'Utilities/redux/userReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'

const UploadFromFile = ({ closeModal }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const history = useHistory()

  const [file, setFile] = useState('')
  const [label, setLabel] = useState(intl.formatMessage({ id: 'choose-a-file' }))
  const [filename, setfFilename] = useState('')
  const learningLanguage = useSelector(learningLanguageSelector)
  const { pending, storyId, progress } = useSelector(({ uploadProgress }) => uploadProgress)

  const containsOnlyLatinCharacters = filename => {
    if (filename) return /^[a-zA-Z0-9_\-.]+$/.test(filename)
    return true
  }

  const onChange = e => {
    if (e.target.files[0]) {
      setFile(e.target.files[0])
      setLabel(e.target.files[0].name)
      setfFilename(e.target.files[0].name)
    }
  }

  const handleSubmit = () => {
    const data = new FormData()
    data.append('file', file)
    data.append('language', learningLanguage)
    dispatch(setCustomUpload(true))
    dispatch(postStory(data))
    dispatch(updateLibrarySelect('private'))
    dispatch(setNotification('processing-story', 'info'))
    closeModal()

    if (history.location.pathname !== 'stories') history.push('/library')
  }

  useEffect(() => {
    if (progress) {
      if (progress === 1) setFile('')
    }
  }, [progress])

  const storyUploading = pending || storyId
  const submitDisabled = !file || storyUploading || !containsOnlyLatinCharacters(filename)

  return (
    <div>
      <br />
      <span className="normal">
        <FormattedHTMLMessage id="file-upload-instructions" />
      </span>
      {!containsOnlyLatinCharacters(filename) && (
        <div style={{ color: 'red' }}>
          <FormattedMessage id="check-for-non-latin-characters" />
        </div>
      )}
      <div className="space-evenly pt-lg">
        <input id="file" name="file" type="file" accept=".docx, .txt" onChange={onChange} />
        <label htmlFor="file">{label}</label>
        <Button
          primary
          disabled={submitDisabled}
          onClick={handleSubmit}
          style={{ minWidth: '10em' }}
        >
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
