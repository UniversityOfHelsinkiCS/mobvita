import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FormattedMessage, useIntl } from 'react-intl'
import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import AppButton from 'Components/AppButton'
import AppTextField from 'Components/ui/AppTextField'
import Spinner from 'Components/Spinner'
import { postStory, setCustomUpload } from 'Utilities/redux/uploadProgressReducer'
import { capitalize, learningLanguageSelector } from 'Utilities/common'
import { fieldLabelSx, pillButtonSx } from 'Components/ui/dialogSx'

// Backend limits (also stated in the info tooltip): 3+ character title, 50–50 000 character text.
const MAX_CHARACTERS = 50000
const MIN_CHARACTERS = 50
const MIN_TITLE_LENGTH = 3

// Figma "Paste Text": labelled title and text fields with a character counter, then Submit.
const UploadPastedText = ({ closeModal, setActiveComponent }) => {
  const intl = useIntl()
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [titleTaken, setTitleTaken] = useState(false)
  const learningLanguage = useSelector(learningLanguageSelector)
  const { pending, storyId } = useSelector(({ uploadProgress }) => uploadProgress)
  const stories = useSelector(({ stories }) => stories.data)

  const uploading = Boolean(pending || storyId)
  const textTooLong = text.length > MAX_CHARACTERS
  const submitDisabled =
    uploading ||
    textTooLong ||
    text.length < MIN_CHARACTERS ||
    title.trim().length < MIN_TITLE_LENGTH

  const handleTitleChange = event => {
    setTitle(event.target.value)
    setTitleTaken(false)
  }

  // The title becomes the story's first line; a title already in the library is refused.
  const submit = async () => {
    if (submitDisabled) return
    if (stories.some(story => story.title === title)) {
      setTitleTaken(true)
      return
    }
    dispatch(setCustomUpload(true))
    await dispatch(
      postStory({ language: capitalize(learningLanguage), text: `${title}\n\n${text}` }),
    )
    setActiveComponent()
    closeModal()
  }

  return (
    <div className="paste-text">
      <div className="paste-text-fields">
        <div>
          <AppTextField
            label={intl.formatMessage({ id: 'Title' })}
            labelSx={fieldLabelSx}
            placeholder={intl.formatMessage({ id: 'paste-title-placeholder' })}
            value={title}
            onChange={handleTitleChange}
            error={titleTaken}
            data-cy="paste-story-title-input"
          />
          {titleTaken && (
            <div className="add-story-dialog-error">
              <FormattedHTMLMessage id="story-title-already-taken" />
            </div>
          )}
        </div>
        <div>
          <AppTextField
            label={intl.formatMessage({ id: 'paste-text-label' })}
            labelSx={fieldLabelSx}
            placeholder={intl.formatMessage({ id: 'paste-text-placeholder' })}
            multiline
            minRows={6}
            value={text}
            onChange={event => setText(event.target.value)}
            error={textTooLong}
            data-cy="paste-story-text-input"
          />
          <div className="add-story-dialog-counter">
            {text.length}/{MAX_CHARACTERS}
          </div>
          {textTooLong && (
            <div className="add-story-dialog-error">
              <FormattedMessage id="this-text-is-too-long-maximum-50000-characters" />
            </div>
          )}
        </div>
      </div>

      <AppButton
        block
        sx={pillButtonSx()}
        disabled={submitDisabled}
        onClick={submit}
        data-cy="paste-story-confirm"
      >
        {uploading ? <Spinner inline size={20} /> : <FormattedMessage id="paste-submit" />}
      </AppButton>
    </div>
  )
}

export default UploadPastedText
