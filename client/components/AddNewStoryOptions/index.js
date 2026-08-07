import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import CloseIcon from '@mui/icons-material/Close'
import { useCurrentUser } from 'Utilities/common'
import StoryInputOptions from './StoryInputOptions'
import UploadFromWeb from './UploadFromWeb'
import UploadFromFile from './UploadFromFile'
import UploadPastedText from './UploadPastedText'
import './AddNewStoryOptions.scss'

const UPLOAD_COMPONENTS = {
  web: UploadFromWeb,
  file: UploadFromFile,
  paste: UploadPastedText,
}

// The add-story flow shown INLINE in the library assistant — as the Figma "Answer" block (a heading + the
// story-source pills), NOT a chat bubble. `main` lists the options; picking one swaps in that upload form.
const AddNewStoryOptions = ({ onClose }) => {
  const { lesson_topics } = useSelector(({ metadata }) => metadata)
  const user = useCurrentUser()
  const userIsAnonymous = user.email === 'anonymous_email'
  const [activeComponent, setActiveComponent] = useState('main')

  const backToMain = () => setActiveComponent('main')

  if (activeComponent !== 'main') {
    const UploadComponent = UPLOAD_COMPONENTS[activeComponent]
    return (
      <div className="add-story-options">
        <button type="button" className="add-story-options-back" onClick={backToMain}>
          <ChevronLeftIcon fontSize="small" />
          <FormattedMessage id="back" defaultMessage="Back" />
        </button>
        <UploadComponent closeModal={onClose} setActiveComponent={backToMain} />
      </div>
    )
  }

  return (
    <div className="add-story-options">
      <div className="add-story-options-lead-row">
        <h4 className="add-story-options-lead">
          <FormattedMessage id="add-stories-assistant-lead" />
        </h4>
        {onClose && (
          <IconButton
            size="small"
            aria-label="close"
            className="add-story-options-close"
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </div>
      <StoryInputOptions
        closeModal={onClose}
        lesson_topics={lesson_topics}
        userIsAnonymous={userIsAnonymous}
        setActiveComponent={setActiveComponent}
      />
    </div>
  )
}

export default AddNewStoryOptions
