import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Icon, Accordion } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import { useIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import { Popup } from 'semantic-ui-react'
import { postStory } from 'Utilities/redux/uploadProgressReducer'
import { capitalize, learningLanguageSelector } from 'Utilities/common'
import { updateLibrarySelect } from 'Utilities/redux/userReducer'
import RecommendedSites from './RecommendedSites'
import Spinner from 'Components/Spinner'

const UploadFromWeb = ({ closeModal, setActiveComponent }) => {
  const intl = useIntl()
  const history = useHistory()
  const dispatch = useDispatch()
  const [storyUrl, setStoryUrl] = useState('')
  const learningLanguage = useSelector(learningLanguageSelector)
  const { pending, storyId } = useSelector(({ uploadProgress }) => uploadProgress)
  const [accordionState, setAccordionState] = useState(-1)

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
      setActiveComponent()
      closeModal()

      if (history.location.pathname !== 'library') history.push('/library')
    }
  }

  const handleClick = useCallback((e, { index }) => {
    setAccordionState(prev => (prev === index ? -1 : index))
  }, [])

  return (
    <div>
      <Popup
        content={<FormattedHTMLMessage id="upload-from-web-instructions" />}
        trigger={<Icon name="info circle" style={{ marginLeft: '4px' }} />}
      />
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

      <div style={{ display: 'flex', marginTop: '20px', justifyContent: 'space-between' }}>
        <Button form="url-upload" type="submit" onClick={handleStorySubmit} data-cy="submit-story">
          {storyUploading ? (
            <Spinner inline size={28} />
          ) : (
            <FormattedMessage id="upload-from-web-button" />
          )}
        </Button>
  
        <Button
          form="url-upload"
          onClick={() => setStoryUrl('')}
          tooltip={intl.formatMessage({ id: 'explain-recommended-sites' })}
          data-cy="add-to-recommended-sites-button"
        >
          <FormattedMessage id="add-recommended-sites-button" />
        </Button>
      </div>

      <div style={{ marginTop: '24px' }}>
        <Accordion styled fluid>
          <Accordion.Title active={accordionState === 0} index={0} onClick={handleClick}>
            <Icon name="dropdown" />
            <FormattedMessage id="recommended-sites" />
          </Accordion.Title>

          {accordionState === 0 && (
            <div style={{ padding: '.5em 1em 1.5em' }}>
              <div style={{ maxHeight: 170, overflowY: 'auto' }}>
                <RecommendedSites />
              </div>
            </div>
          )}
        </Accordion>
      </div>
    </div>
  )
}

export default UploadFromWeb
