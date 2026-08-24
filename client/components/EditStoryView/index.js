/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getStoryAction } from 'Utilities/redux/storiesReducer'
import { editStory, setCustomUpload } from 'Utilities/redux/uploadProgressReducer'
import { setNotification } from 'Utilities/redux/notificationReducer'
import useWindowDimensions from 'Utilities/windowDimensions'
import { Box, Divider } from '@mui/material'
import AppButton from 'Components/AppButton'
import AppTextField from 'Components/ui/AppTextField'
import { colors } from 'Assets/mui_theme/designTokens'
import { capitalize, learningLanguageSelector } from 'Utilities/common'
import Spinner from 'Components/Spinner'

const EditStoryView = ({ match }) => {
  const dispatch = useDispatch()
  const intl = useIntl()
  const navigate = useNavigate()
  const { width } = useWindowDimensions()
  const learningLanguage = useSelector(learningLanguageSelector)
  const { id } = match.params
  const { story, pending } = useSelector(({ stories, locale }) => ({
    story: stories.focused,
    pending: stories.focusedPending,
    locale }), shallowEqual)
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
      original_id: id }

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
  const submitDisabled =
    !content || textTooLong || charactersLeft > 49950 || titleMissing || !modified

  if (!story || pending) {
    return <Spinner fullHeight spinnerColor={colors.ink} size={60} />
  }

  return (
    <div className="cont-tall flex-col space-between">
      <div className="justify-center">
        <Box
          sx={{
            backgroundColor: colors.card,
            color: colors.ink,
            border: `1px solid ${colors.border}`,
            borderRadius: '20px',
            width: '100%',
            maxWidth: 1024,
            mx: 'auto',
            my: '2rem',
            p: { xs: '16px', sm: '24px' },
          }}
        >
          <div className="flex space-between">
            <AppButton variant="card" onClick={() => navigate('/library')}>
              <FormattedMessage id="return-to-library" />
            </AppButton>

            <div>
              <AppButton variant="primary" onClick={updateStory} disabled={submitDisabled}>
                <FormattedMessage id="save-story" />
              </AppButton>
              <AppButton
                variant="secondary"
                style={{ marginLeft: '.5rem' }}
                onClick={initialSettings}
                disabled={!modified}
              >
                <FormattedMessage id="undo-changes" />
              </AppButton>
            </div>
          </div>
          <Divider sx={{ my: '1em', borderColor: colors.border }} />
          <div className="flex align-center">
            <span style={{ marginRight: '.5rem', color: colors.ink }}>
              <FormattedMessage id="story-title" />:
            </span>
            <AppTextField
              fullWidth={false}
              value={title}
              sx={{ width: bigScreen ? 500 : 250, my: '1em' }}
              onChange={handleTitleTextChange}
              placeholder={intl.formatMessage({ id: 'story-title' })}
            />
            {submitDisabled && (
              <div>
                {titleMissing && (
                  <div style={{ color: colors.error, marginLeft: '.5rem' }}>
                    <FormattedMessage id="story-title-validation" />
                  </div>
                )}
                {textTooLong && (
                  <div style={{ color: colors.error, marginLeft: '.5rem' }}>
                    <FormattedMessage id="this-text-is-too-long-maximum-50000-characters" />
                  </div>
                )}
                {charactersLeft > 49950 && (
                  <div style={{ color: colors.error, marginLeft: '.5rem' }}>
                    <FormattedMessage id="this-text-is-too-short-minimum-50-characters" />
                  </div>
                )}
              </div>
            )}
          </div>
          <AppTextField
            multiline
            value={content}
            rows={(story.paragraph?.length ?? 4) * 3}
            onChange={handleTextChange}
            sx={{
              my: '1em',
              // Fixed box that scrolls — 800px with room to spare on a big screen, 20vh on mobile
              // (what the old `.story-text-input` gave). `rows` only keeps MUI on a plain
              // <textarea> instead of the auto-sizing one.
              '& .MuiOutlinedInput-root': {
                height: bigScreen ? '500px' : '20vh',
                alignItems: 'flex-start',
              },
              '& textarea': { height: '100% !important', overflowY: 'auto !important' },
            }}
          />
        </Box>
      </div>
    </div>
  )
}

export default EditStoryView
