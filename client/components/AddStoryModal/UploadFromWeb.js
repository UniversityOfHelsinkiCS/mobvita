import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import { useIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import { postStory } from 'Utilities/redux/uploadProgressReducer'
import { capitalize, learningLanguageSelector } from 'Utilities/common'
import { updateLibrarySelect } from 'Utilities/redux/userReducer'
import Spinner from 'Components/Spinner'

const UploadFromWeb = ({ closeModal }) => {
  const intl = useIntl()
  const history = useHistory()
  const dispatch = useDispatch()
  const [storyUrl, setStoryUrl] = useState('')
  const learningLanguage = useSelector(learningLanguageSelector)
  const { pending, storyId } = useSelector(({ uploadProgress }) => uploadProgress)

  const storyUploading = pending || storyId

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
      <br />
      <span className="pb-sm upload-instructions">
        <FormattedHTMLMessage id="upload-from-web-instructions" />
      </span>
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
          form="url-upload"
          type="submit"
          onClick={handleStorySubmit}
          data-cy="submit-story"
          style={{ marginTop: '1em' }}
        >
          {storyUploading ? (
            <Spinner inline variant="white" />
          ) : (
            <FormattedMessage id="Confirm" />
          )}
        </Button>
      </div>
    </div>
  )
}

export default UploadFromWeb
