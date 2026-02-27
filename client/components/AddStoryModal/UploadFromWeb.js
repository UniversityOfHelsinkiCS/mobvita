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
      <div style={{ marginTop: '20px' }}>
        <Form id="url-upload">
          <Input
            fluid
            placeholder={intl.formatMessage({ id: 'enter-web-address' })}
            value={storyUrl}
            onChange={event => setStoryUrl(event.target.value)}
            data-cy="new-story-input"
          />
        </Form>
      </div>
  
      <div style={{ display: 'flex', marginTop: '24px' }}>
        <Button
          form="url-upload"
          type="submit"
          onClick={handleStorySubmit}
          data-cy="submit-story"
        >
          {storyUploading ? (
            <Spinner inline size={28}/>
          ) : (
            <FormattedMessage id="Confirm" />
          )}
        </Button>
      </div>
    </div>
  )
}

export default UploadFromWeb
