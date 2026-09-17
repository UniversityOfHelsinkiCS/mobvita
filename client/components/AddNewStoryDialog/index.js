import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useSelector } from 'react-redux'
import AppDialog from 'Components/ui/AppDialog'
import AppIcon from 'Components/ui/AppIcon'
import CustomTooltip from 'Components/CustomTooltip'
import { images, useIsAnonymous } from 'Utilities/common'
import { colors } from 'Assets/mui_theme/designTokens'
import { dialogSx } from 'Components/ui/dialogSx'
import NewStoryInputOptions from './NewStoryInputOptions'
import UploadFromWeb from './UploadFromWeb'
import UploadFromFile from './UploadFromFile'
import UploadPastedText from './UploadPastedText'
import GenerateStory from './GenerateStory'
import './AddNewStoryDialog.scss'

// Each story source: its upload form, dialog title, optional info tooltip, and lead-line flag.
const SOURCES = {
  web: { Form: UploadFromWeb, titleId: 'upload-from-web', infoId: 'upload-from-web-instructions' },
  file: { Form: UploadFromFile, titleId: 'upload-stories', lead: false },
  paste: {
    Form: UploadPastedText,
    titleId: 'paste-a-text',
    infoId: 'paste-text-upload-instructions',
    lead: false,
  },
  generate: {
    Form: GenerateStory,
    titleId: 'generate-story-title',
    infoId: 'generate-story-info',
    lead: false,
    // Figma: a wider card whose steps all share one height (capped to the viewport).
    paperSx: { width: 839, minHeight: 'min(734px, calc(100vh - 64px))' },
    // A flex column so the view can fill the card and centre its spinner in the free space.
    contentSx: { display: 'flex', flexDirection: 'column' },
  },
}

// The shared Figma dialog chrome; the generate source widens the card below.
const FIGMA_DIALOG_SX = dialogSx()

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
      maxWidth="md"
      title={title}
      subtitle={showLead && <FormattedMessage id="add-stories-assistant-lead" />}
      closeDataCy="add-story-dialog-close"
      data-cy="add-story-dialog"
      slotProps={{ transition: { onExited: backToMain } }}
      {...FIGMA_DIALOG_SX}
      paperSx={{ ...FIGMA_DIALOG_SX.paperSx, ...source?.paperSx }}
      contentSx={{ ...FIGMA_DIALOG_SX.contentSx, ...source?.contentSx }}
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
          lesson_topics={lesson_topics}
          userIsAnonymous={userIsAnonymous}
          setActiveComponent={showView}
        />
      )}
    </AppDialog>
  )
}

export default AddNewStoryDialog
