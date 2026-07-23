import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { FormattedMessage } from 'react-intl'
import { capitalize, getTextStyle, learningLanguageSelector } from 'Utilities/common'
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
const EssayListItem = ({
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
        className={`card mui-story-card essay-card ${
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
        <CardContent className="story-card-title-cont">
          <Box
            component="span"
            className="flex"
            sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden', width: '100%' }}
          >
            <MoreVertIcon className="story-item-dots" color="action" fontSize="small" />
            <Typography
              component="h5"
              className="story-item-title"
              sx={{ fontSize: '1.15rem', flex: 1, minWidth: 0, ...getTextStyle(learningLanguage) }}
            >
              {title || ''}
            </Typography>
          </Box>
        </CardContent>
        <CardContent className="story-card-actions-cont essay-card-meta">
          {(formattedDate || sentenceCount > 0) && (
            <Box className="essay-card-meta-info">
              {formattedDate && (
                <Typography variant="caption" component="span">
                  {formattedDate}
                </Typography>
              )}
              {sentenceCount > 0 && (
                <Typography variant="caption" component="span">
                  {sentenceCount}{' '}
                  <FormattedMessage id="essay-sentence-count" />
                </Typography>
              )}
            </Box>
          )}
          {isOwnEssay && (
            <CustomTooltip title={<FormattedMessage id="Delete" />}>
              <IconButton
                data-cy="essay-delete"
                aria-label="Delete essay"
                size="small"
                sx={{ ml: 'auto' }}
                onClick={event => {
                  event.stopPropagation()
                  setConfirmationOpen(true)
                }}
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </IconButton>
            </CustomTooltip>
          )}
        </CardContent>
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

export default EssayListItem
