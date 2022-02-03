import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { postStory, setCustomUpload } from 'Utilities/redux/uploadProgressReducer'
import { Spinner, Button } from 'react-bootstrap'
import { learningLanguageSelector, useCurrentUser } from 'Utilities/common'
import { updateLibrarySelect } from 'Utilities/redux/userReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'

const UploadFromFile = ({ closeModal }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const history = useHistory()
  const user = useCurrentUser()

  const [file, setFile] = useState('')
  const [label, setLabel] = useState(intl.formatMessage({ id: 'choose-a-file' }))
  const [filename, setFilename] = useState('')
  const learningLanguage = useSelector(learningLanguageSelector)
  const { pending, storyId, progress } = useSelector(({ uploadProgress }) => uploadProgress)

  const onChange = e => {
    if (e.target.files[0]) {
      setFile(e.target.files[0])
      setLabel(e.target.files[0].name)
      setFilename(e.target.files[0].name)
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
  const submitDisabled = !file || storyUploading

  return (
    <div>
      <br />
      <span className="upload-instructions">
        <FormattedHTMLMessage id="file-upload-instructions" />
        <div>test</div>
      </span>
      <div className="space-evenly pt-lg">
        <input id="file" name="file" type="file" accept=".docx, .txt" onChange={onChange} />
        <label className="file-upload-btn" htmlFor="file">
          {label}
        </label>
        <Button disabled={submitDisabled} onClick={handleSubmit} style={{ minWidth: '10em' }}>
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
