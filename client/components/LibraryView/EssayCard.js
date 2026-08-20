import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, IconButton } from '@mui/material'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { FormattedMessage } from 'react-intl'
import { capitalize, getTextStyle, images, learningLanguageSelector } from 'Utilities/common'
import {
  getWritingEssayId,
  getWritingEssaySavedDate,
  removeWritingEssay,
  removeEssayFromList,
} from 'Utilities/redux/writingCorrectionReducer'
import CustomTooltip from 'Components/CustomTooltip'
import ConfirmationWarning from 'Components/ConfirmationWarning'

// A single essay in the "My Essays" library: title (styled like a story) + save date + delete.
// Clicking the card opens the essay detail dialog (original + current versions).
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
  const [confirmationOpen, setConfirmationOpen] = useState(false)

  // Only the owner can delete an essay (the backend /remove is scoped to the authenticated user), so
  // hide Delete on essays a teacher is only viewing (e.g. a student's essay).
  const isOwnEssay = Boolean(userId) && essay.user === userId

  const essayId = getWritingEssayId(essay)
  const title = essay.title || essay.sentences?.[0]?.original_text || null
  const parsedDate = getWritingEssaySavedDate(essay)
  const formattedDate =
    parsedDate && !Number.isNaN(parsedDate.getTime())
      ? parsedDate.toLocaleDateString('en-GB')
      : null
  const sentenceCount = Array.isArray(essay.sentences) ? essay.sentences.length : 0

  const clickable = typeof onOpen === 'function'

  const handleKeyDown = event => {
    if (clickable && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      onOpen()
    }
  }

  const deleteEssay = () => {
    if (!essayId || !learningLanguage) return
    dispatch(removeWritingEssay(capitalize(learningLanguage), essayId))
    dispatch(removeEssayFromList(essayId))
  }

  return (
    <>
      <Card
        className={`library-item-card essay-card ${
          isDragging ? 'library-story-card-dragging' : ''
        }`}
        data-cy="essay-item"
        elevation={0}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        onClick={clickable ? onOpen : undefined}
        onKeyDown={handleKeyDown}
        draggable={draggable}
        onDragEnd={onDragEnd}
        onDragStart={event => {
          if (!draggable) return
          onDragStart(essayId, event)
        }}
        sx={clickable ? { cursor: 'pointer' } : undefined}
      >
        <div className="library-item-body">
          <img src={images.bookOpenGreen} alt="" className="library-item-icon" />
          <div className="library-item-main">
            <div className="library-item-toprow">
              <span className="library-item-title" style={getTextStyle(learningLanguage)}>
                {title || ''}
              </span>
              <div className="library-item-badges">
                {formattedDate && (
                  <span style={{ fontSize: 12, color: '#9d9b92', whiteSpace: 'nowrap' }}>
                    {formattedDate}
                  </span>
                )}
                {sentenceCount > 0 && (
                  <span style={{ fontSize: 12, color: '#9d9b92', whiteSpace: 'nowrap' }}>
                    {sentenceCount} <FormattedMessage id="essay-sentence-count" />
                  </span>
                )}
                {isOwnEssay && (
                  <CustomTooltip title={<FormattedMessage id="Delete" />}>
                    <IconButton
                      data-cy="essay-delete"
                      aria-label="Delete essay"
                      size="small"
                      onClick={event => {
                        event.stopPropagation()
                        setConfirmationOpen(true)
                      }}
                    >
                      <DeleteOutlineOutlinedIcon fontSize="small" />
                    </IconButton>
                  </CustomTooltip>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

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
