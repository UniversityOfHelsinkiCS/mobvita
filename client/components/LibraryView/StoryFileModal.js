import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'semantic-ui-react'
import { Button, Spinner } from 'react-bootstrap'
import { FormattedMessage, FormattedHTMLMessage, useIntl } from 'react-intl'
import { learningLanguageSelector } from 'Utilities/common'
import { postStory, setCustomUpload } from 'Utilities/redux/uploadProgressReducer'
import { updateLibrarySelect } from 'Utilities/redux/userReducer'

const StoryFileModal = ({ trigger }) => {
  const intl = useIntl()

  const [file, setFile] = useState('')
  const [label, setLabel] = useState(intl.formatMessage({ id: 'choose-a-file' }))
  const [filename, setfFilename] = useState('')
  const [showModel, setShowModel] = useState(false)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { pending, storyId, progress } = useSelector(({ uploadProgress }) => uploadProgress)

  const dispatch = useDispatch()

  const containsOnlyLatinCharacters = filename => {
    if (filename) return /^[a-zA-Z0-9_\-\.]+$/.test(filename)
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
  }

  useEffect(() => {
    if (progress) {
      if (progress == 1) setFile('')
      setShowModel(false)
    }
  }, [progress])

  const storyUploading = pending || storyId

  const submitDisabled = !file || storyUploading || !containsOnlyLatinCharacters(filename)

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
        <FormattedMessage id="upload-stories" />
      </Modal.Header>
      <Modal.Content>
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
            disabled={submitDisabled}
            variant="primary"
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
      </Modal.Content>
    </Modal>
  )
}

export default StoryFileModal
