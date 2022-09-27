import React, { useState, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { postStory, setCustomUpload } from 'Utilities/redux/uploadProgressReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import { FormControl, Spinner, Button } from 'react-bootstrap'
import { capitalize, learningLanguageSelector } from 'Utilities/common'
import { Divider } from 'semantic-ui-react'

const EditStoryView = ({ match }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const history = useHistory()
  const { width } = useWindowDimensions()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { id } = match.params
  const { story, pending } = useSelector(({ stories, locale }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
    locale,
  }))
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const [initTitle, setInitTitle] = useState('')
  const [initContent, setInitContent] = useState('')
  const [modified, setModified] = useState(false)
  const bigScreen = width > 700

  const initialSettings = () => {
    let string = ''
    setTitle(story.title)
    setInitTitle(story.title)
    for (let i = 0; i < story.paragraph?.length; i++) {
      for (let j = 0; j < story.paragraph[i]?.length; j++) {
        string = string.concat(story.paragraph[i][j].surface)
      }
      string = string.concat('\n')
    }
    setContent(string)
    setInitContent(string)
  }

  const updateStory = () => {
    const combineTitleAndText = `${title}\n\n${content}`
    const newStory = {
      language: capitalize(learningLanguage),
      text: combineTitleAndText,
      original_id: id,
    }

    dispatch(postStory(newStory))
    dispatch(setCustomUpload(true))
    dispatch(setNotification('processing-story', 'info'))
  }

  useEffect(() => {
    dispatch(getStoryAction(id, 'preview'))
  }, [])

  useEffect(() => {
    if (content !== initContent || title !== initTitle) {
      setModified(true)
    } else {
      setModified(false)
    }
  }, [content, title])

  useEffect(() => {
    if (story) {
      initialSettings()
    }
  }, [story])

  if (!story || pending) {
    return <Spinner />
  }

  return (
    <div className="cont-tall pt-sm flex-col space-between">
      <div className="justify-center">
        <div className="cont borders-light-grey">
          <div className="flex space-between">
            <Button variant="primary" onClick={() => history.push('/library')}>
              <FormattedMessage id="return-to-library" />
            </Button>
            {modified && (
              <div>
                <Button variant="primary" onClick={updateStory}>
                  <FormattedMessage id="submit-changes" />
                </Button>
                <Button
                  variant="secondary"
                  style={{ marginLeft: '.5rem' }}
                  onClick={initialSettings}
                >
                  <FormattedMessage id="undo-changes" />
                </Button>
              </div>
            )}
          </div>
          <Divider />
          <div className="flex align-center">
            <span style={{ marginRight: '.5rem' }}>
              <FormattedMessage id="story-title" />:
            </span>
            <FormControl
              className={bigScreen ? 'story-title-input' : 'story-title-input-mobile'}
              as="input"
              value={title}
              style={{ marginTop: '1em', marginBottom: '1em' }}
              onChange={({ target }) => setTitle(target.value)}
              placeholder={intl.formatMessage({ id: 'story-title' })}
            />
          </div>
          <FormControl
            as="textarea"
            className="story-text-input"
            value={content}
            rows={story.paragraph?.length * 3}
            onChange={({ target }) => setContent(target.value)}
            style={{ marginTop: '1em', marginBottom: '1em' }}
          />
        </div>
      </div>
    </div>
  )
}

export default EditStoryView
