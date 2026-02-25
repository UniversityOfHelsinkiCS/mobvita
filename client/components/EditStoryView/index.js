/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { editStory, setCustomUpload } from 'Utilities/redux/uploadProgressReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import { FormControl, Button } from 'react-bootstrap'
import { capitalize, learningLanguageSelector } from 'Utilities/common'
import { Divider } from 'semantic-ui-react'
import Spinner from 'Components/Spinner'

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
  const { edited } = useSelector(({ uploadProgress }) => uploadProgress)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [titleMissing, setTitleMissing] = useState(false)
  const [initTitle, setInitTitle] = useState('')
  const [initContent, setInitContent] = useState('')
  const maxCharacters = 50000
  const [charactersLeft, setCharactersLeft] = useState(maxCharacters)
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
    }
    setContent(string)
    setInitContent(string)
  }

  const handleTextChange = e => {
    setContent(e.target.value)
  }

  const handleTitleTextChange = e => {
    setTitle(e.target.value)
    if (e.target.value.length < 3) {
      setTitleMissing(true)
    } else {
      setTitleMissing(false)
    }
  }

  const updateStory = () => {
    const combineTitleAndText = `${title}\n\n${content}`
    const newStory = {
      language: capitalize(learningLanguage),
      text: combineTitleAndText,
      original_id: id,
    }

    dispatch(editStory(newStory))
    dispatch(setCustomUpload(true))
    dispatch(setNotification('processing-story', 'info'))
  }

  useEffect(() => {
    dispatch(getStoryAction(id, 'preview'))
  }, [])

  useEffect(() => {
    setCharactersLeft(maxCharacters - content.length)
  }, [content])

  /*
  useEffect(() => {
    if (edited) {
      history.push('/library')
    }
  }, [edited])
*/
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

  const textTooLong = charactersLeft < 0
  const submitDisabled = !content || textTooLong || charactersLeft > 49950 || titleMissing

  if (!story || pending) {
    return (
      <Spinner
        fullHeight
        size={60}
        text={intl.formatMessage({ id: 'loading' })}
        textSize={20}
      />
    )
  }
  console.log('text too long ', textTooLong, ' missin title ', titleMissing)

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
                <Button variant="primary" onClick={updateStory} disabled={submitDisabled}>
                  <FormattedMessage id="save-story" />
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
              onChange={handleTitleTextChange}
              placeholder={intl.formatMessage({ id: 'story-title' })}
            />
            {submitDisabled && (
              <div>
                {titleMissing && (
                  <div style={{ color: '#ff0000', marginLeft: '.5rem' }}>
                    <FormattedMessage id="story-title-validation" />
                  </div>
                )}
                {textTooLong && (
                  <div style={{ color: '#ff0000', marginLeft: '.5rem' }}>
                    <FormattedMessage id="this-text-is-too-long-maximum-50000-characters" />
                  </div>
                )}
                {charactersLeft > 49950 && (
                  <div style={{ color: '#ff0000', marginLeft: '.5rem' }}>
                    <FormattedMessage id="this-text-is-too-short-minimum-50-characters" />
                  </div>
                )}
              </div>
            )}
          </div>
          <FormControl
            as="textarea"
            className="story-text-input"
            value={content}
            rows={story.paragraph?.length * 3}
            onChange={handleTextChange}
            style={{ marginTop: '1em', marginBottom: '1em' }}
          />
        </div>
      </div>
    </div>
  )
}

export default EditStoryView
