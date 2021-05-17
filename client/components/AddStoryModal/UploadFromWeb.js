import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Button } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import { useIntl, FormattedMessage } from 'react-intl'
import { Spinner } from 'react-bootstrap'
import { postStory } from 'Utilities/redux/uploadProgressReducer'
import { capitalize, learningLanguageSelector } from 'Utilities/common'
import { updateLibrarySelect } from 'Utilities/redux/userReducer'

const UploadFromWeb = ({ closeModal }) => {
  const intl = useIntl()
  const history = useHistory()
  const dispatch = useDispatch()
  const [storyUrl, setStoryUrl] = useState('')
  const learningLanguage = useSelector(learningLanguageSelector)
  const { pending, storyId } = useSelector(({ uploadProgress }) => uploadProgress)

  const storyUploading = pending || storyId
  const submitDisabled = storyUploading

  const handleStorySubmit = event => {
    event.preventDefault()

    const newStory = {
      language: capitalize(learningLanguage),
      url: storyUrl,
    }

    if (storyUrl) {
      dispatch(postStory(newStory))
      dispatch(updateLibrarySelect('private'))
      setStoryUrl('')
      closeModal()

      if (history.location.pathname !== 'library') history.push('/library')
    }
  }

  return (
    <div>
      <Form id="url-upload">
        <Input
          fluid
          placeholder={intl.formatMessage({ id: 'enter-web-address' })}
          value={storyUrl}
          onChange={event => setStoryUrl(event.target.value)}
          data-cy="new-story-input"
          style={{ marginTop: '1.5em' }}
        />
      </Form>
      <div className="flex pb-sm">
        <Button
          primary
          form="url-upload"
          disabled={submitDisabled}
          type="submit"
          onClick={handleStorySubmit}
          data-cy="submit-story"
          style={{ marginTop: '1em' }}
        >
          {storyUploading ? (
            <Spinner animation="border" variant="white" size="lg" />
          ) : (
            <FormattedMessage id="upload-from-web" />
          )}
        </Button>
      </div>
    </div>
  )
}

export default UploadFromWeb
