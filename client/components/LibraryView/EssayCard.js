import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Card } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { capitalize, getTextStyle, images, learningLanguageSelector } from 'Utilities/common'
import {
  getWritingEssayId,
  removeWritingEssay,
  removeEssayFromList,
} from 'Utilities/redux/writingCorrectionReducer'
import { colors } from 'Assets/mui_theme/designTokens'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import ConfirmationWarning from 'Components/ConfirmationWarning'

// A single essay in the "My Essays" library: icon + title + sentence count. Clicking the card opens
// a details dialog with Edit and Delete, mirroring how a story card opens StoryDetailsModal rather
// than jumping straight into the text. A teacher gets Review instead of Edit, because opening an
// essay in teacher view lands on the read-only original/current split, not the writing editor.
const EssayCard = ({
  essay,
  onOpen,
  draggable = false,
  isDragging = false,
  onDragEnd = () => {},
  onDragStart = () => {},
}) => {
  const dispatch = useDispatch()
  const learningLanguage = useSelector(learningLanguageSelector)
  const userId = useSelector(({ user }) => user.data?.user?.oid)
  const teacherView = useSelector(({ user }) => user.data?.teacherView)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const isOwnEssay = Boolean(userId) && essay.user === userId
  const essayId = getWritingEssayId(essay)
  const title = essay.title || essay.sentences?.[0]?.original_text || null
  const sentenceCount = Array.isArray(essay.sentences) ? essay.sentences.length : 0

  const canEdit = typeof onOpen === 'function'

  const handleKeyDown = event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      setDetailsOpen(true)
    }
  }

  const handleEdit = () => {
    setDetailsOpen(false)
    if (canEdit) onOpen()
  }

  const deleteEssay = () => {
    if (!essayId || !learningLanguage) return
    dispatch(removeWritingEssay(capitalize(learningLanguage), essayId))
    dispatch(removeEssayFromList(essayId))
    setDetailsOpen(false)
  }

  return (
    <>
      <Card
        className={`library-item-card essay-card ${
          isDragging ? 'library-story-card-dragging' : ''
        }`}
        data-cy="essay-item"
        elevation={0}
        role="button"
        tabIndex={0}
        onClick={() => setDetailsOpen(true)}
        onKeyDown={handleKeyDown}
        draggable={draggable}
        onDragEnd={onDragEnd}
        onDragStart={event => {
          if (!draggable) return
          onDragStart(essayId, event)
        }}
        sx={{ cursor: 'pointer' }}
      >
        <div className="library-item-body">
          <img src={images.letterGreen} alt="" className="library-item-icon" />
          <div className="library-item-main">
            <div className="library-item-toprow">
              <span className="library-item-title" style={getTextStyle(learningLanguage)}>
                {title || ''}
              </span>
              <div className="library-item-badges">
                {sentenceCount > 0 && (
                  <span style={{ fontSize: 12, color: '#9d9b92', whiteSpace: 'nowrap' }}>
                    {sentenceCount} <FormattedMessage id="essay-sentence-count" />
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <AppDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="xs"
        title={title || ''}
        closeDataCy="essay-detail-modal-close"
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.75em',
            '& > *': { flexShrink: 0 },
          }}
        >
          {canEdit && (
            <AppButton
              variant="primary"
              data-cy="essay-detail-modal-edit-button"
              onClick={handleEdit}
              sx={{ gap: '0.5em', whiteSpace: 'nowrap', '& img': { flexShrink: 0 } }}
            >
              <img src={images.iconEdit} alt="" />
              <FormattedMessage id={teacherView ? 'review' : 'edit'} />
            </AppButton>
          )}
          {isOwnEssay && (
            <AppButton
              variant="danger"
              data-cy="essay-detail-modal-delete-button"
              onClick={() => setConfirmationOpen(true)}
              sx={{
                gap: '0.5em',
                whiteSpace: 'nowrap',
                backgroundColor: colors.alert,
                color: '#fff',
                '& img': { flexShrink: 0, filter: 'brightness(0) invert(1)' },
                '&:hover': { backgroundColor: colors.alertHover },
              }}
            >
              <img src={images.trash03} alt="" />
              <FormattedMessage id="Delete" />
            </AppButton>
          )}
        </Box>
      </AppDialog>

      <ConfirmationWarning
        open={confirmationOpen}
        setOpen={setConfirmationOpen}
        action={deleteEssay}
      >
        <FormattedMessage id="essay-remove-confirm" />
      </ConfirmationWarning>
    </>
  )
}

export default EssayCard
