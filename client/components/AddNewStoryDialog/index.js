import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import AppDialog from 'Components/ui/AppDialog'
import { useIsAnonymous } from 'Utilities/common'
import { colors, font, shadow } from 'Assets/mui_theme/designTokens'
import NewStoryInputOptions from './NewStoryInputOptions'
import UploadFromWeb from './UploadFromWeb'
import UploadFromFile from './UploadFromFile'
import UploadPastedText from './UploadPastedText'
import './AddNewStoryDialog.scss'

// Each story source's upload form, and the dialog title shown while that form is open.
const SOURCES = {
  web: { Form: UploadFromWeb, titleId: 'upload-from-web' },
  file: { Form: UploadFromFile, titleId: 'upload-stories' },
  paste: { Form: UploadPastedText, titleId: 'paste-a-text' },
}

// Card padding per Figma "40px 60px" (sm and up); the phone-width values are derived.
const PAD_X = { xs: 3, sm: 7.5 }
const PAD_Y = { xs: 4, sm: 5 }

// Figma "pick a story" chrome over AppDialog's defaults: 568px card, Shadow Mid, H2 title, 16px
// lead gap, 30px to the content, and a muted X 20px from the corner.
const FIGMA_DIALOG_SX = {
  paperSx: { width: 568, boxShadow: shadow.mid },
  titleSx: {
    pl: PAD_X,
    pr: { xs: 7, sm: 7.5 },
    pt: PAD_Y,
    pb: 3.75,
    fontSize: font.h2,
    fontWeight: 400,
    lineHeight: 1,
    letterSpacing: 0,
  },
  subtitleSx: { mt: 2 },
  contentSx: { px: PAD_X, pb: PAD_Y },
  closeSx: { right: 12, top: 12, color: colors.ink },
}

// AddNewStoryDialog — Figma "pick a story": the story-source pills, or the chosen upload form.
// Controlled via `open`/`onClose`; the view returns to the pills once the close transition ends.
const AddNewStoryDialog = ({ open, onClose, ...rest }) => {
  const { lesson_topics } = useSelector(({ metadata }) => metadata)
  const userIsAnonymous = useIsAnonymous()
  const [view, setView] = useState('main')
  const source = SOURCES[view]
  const UploadForm = source?.Form

  const backToMain = () => setView('main')

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title={<FormattedMessage id={source ? source.titleId : 'add-new-story'} />}
      subtitle={!source && <FormattedMessage id="add-stories-assistant-lead" />}
      closeDataCy="add-story-dialog-close"
      data-cy="add-story-dialog"
      slotProps={{ transition: { onExited: backToMain } }}
      {...FIGMA_DIALOG_SX}
      {...rest}
    >
      {UploadForm ? (
        <div className="add-story-dialog-form">
          <button type="button" className="add-story-dialog-back" onClick={backToMain}>
            <ChevronLeftIcon fontSize="small" />
            <FormattedMessage id="Back" />
          </button>
          <UploadForm closeModal={onClose} setActiveComponent={backToMain} />
        </div>
      ) : (
        <NewStoryInputOptions
          closeModal={onClose}
          lesson_topics={lesson_topics}
          userIsAnonymous={userIsAnonymous}
          setActiveComponent={setView}
        />
      )}
    </AppDialog>
  )
}

export default AddNewStoryDialog
