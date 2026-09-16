import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import AppDialog from 'Components/ui/AppDialog'
import AppIcon from 'Components/ui/AppIcon'
import CustomTooltip from 'Components/CustomTooltip'
import { images, useIsAnonymous } from 'Utilities/common'
import { colors, font, shadow } from 'Assets/mui_theme/designTokens'
import NewStoryInputOptions from './NewStoryInputOptions'
import UploadFromWeb from './UploadFromWeb'
import UploadFromFile from './UploadFromFile'
import UploadPastedText from './UploadPastedText'
import './AddNewStoryDialog.scss'

// Each story source: its upload form, dialog title, optional info tooltip, and lead-line flag.
const SOURCES = {
  web: { Form: UploadFromWeb, titleId: 'upload-from-web', infoId: 'upload-from-web-instructions' },
  file: { Form: UploadFromFile, titleId: 'upload-stories', lead: false },
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

// AddNewStoryDialog — Figma "pick a story": the story-source pills, or the chosen upload form under
// a Back row. Controlled via `open`/`onClose`; the view returns to the pills after the close fades.
const AddNewStoryDialog = ({ open, onClose, ...rest }) => {
  const { lesson_topics } = useSelector(({ metadata }) => metadata)
  const userIsAnonymous = useIsAnonymous()
  const [view, setView] = useState('main')
  // A form may swap the title's info tooltip (Upload File explains the active tab's format).
  const [infoOverride, setInfoOverride] = useState(null)
  const source = SOURCES[view]
  const UploadForm = source?.Form
  const infoId = infoOverride ?? source?.infoId
  const showLead = !source || source.lead !== false

  const showView = nextView => {
    setInfoOverride(null)
    setView(nextView)
  }
  const backToMain = () => showView('main')

  // Figma header: a muted Back row above the H2 (sub-views only) and an info icon by the title.
  const title = (
    <>
      {source && (
        <button type="button" className="add-story-dialog-back" onClick={backToMain}>
          <AppIcon src={images.flipBackward} size={24} color={colors.muted} />
          <FormattedMessage id="Back" />
        </button>
      )}
      <span className="add-story-dialog-title">
        <FormattedMessage id={source ? source.titleId : 'add-new-story'} />
        {infoId && (
          <CustomTooltip keyId={infoId} permanent>
            <span className="add-story-dialog-info">
              <AppIcon src={images.alertCircle} size={20} />
            </span>
          </CustomTooltip>
        )}
      </span>
    </>
  )

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title={title}
      subtitle={showLead && <FormattedMessage id="add-stories-assistant-lead" />}
      closeDataCy="add-story-dialog-close"
      data-cy="add-story-dialog"
      slotProps={{ transition: { onExited: backToMain } }}
      {...FIGMA_DIALOG_SX}
      {...rest}
    >
      {UploadForm ? (
        <UploadForm
          closeModal={onClose}
          setActiveComponent={backToMain}
          setInfoId={setInfoOverride}
        />
      ) : (
        <NewStoryInputOptions
          closeModal={onClose}
          lesson_topics={lesson_topics}
          userIsAnonymous={userIsAnonymous}
          setActiveComponent={showView}
        />
      )}
    </AppDialog>
  )
}

export default AddNewStoryDialog
