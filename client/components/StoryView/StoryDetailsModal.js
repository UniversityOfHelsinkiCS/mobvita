import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box } from '@mui/material'
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { colors } from 'Assets/mui_theme/designTokens'
import AppButton from 'Components/AppButton'
import AppDialog from 'Components/ui/AppDialog'
import CustomTooltip from 'Components/CustomTooltip'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { images } from 'Utilities/common'
import { getStoryLoadingProgress } from 'Utilities/redux/storiesReducer'

const EMPTY_LOADING_PROGRESS = {}

// A full-width green "pill" action row: left-aligned icon + label, optionally wrapped in a router
// Link and/or a permanent tooltip (shown when the action is disabled to explain why).
const ActionPill = ({ to, onClick, icon, labelId, disabled, variant = 'tan', className, dataCy, tooltipId }) => {
  const button = (
    <AppButton
      variant={variant}
      block
      disabled={disabled}
      onClick={onClick}
      className={className}
      data-cy={dataCy}
      sx={{
        justifyContent: 'flex-start',
        gap: '0.75em',
        px: '1.1em',
        py: '0.55em',
        whiteSpace: 'nowrap',
        '& img, & > svg': { flexShrink: 0 },
      }}
    >
      {icon}
      <FormattedMessage id={labelId} />
    </AppButton>
  )

  const content =
    to && !disabled ? (
      <Link to={to} style={{ display: 'block', width: '100%' }}>
        {button}
      </Link>
    ) : (
      button
    )

  if (tooltipId && disabled) {
    return (
      <CustomTooltip keyId={tooltipId} permanent>
        <span style={{ display: 'block', width: '100%' }}>{content}</span>
      </CustomTooltip>
    )
  }

  return content
}

const StoryDetailsModal = ({
  trigger,
  story,
  setShareModalOpen,
  showShareButton,
  showDeleteButton,
  showCreateControlStoryButton,
  showCancelControlStoryButton,
  handleDelete,
  inGroupLibrary,
  isTeacher,
  currentGroup,
  handleControlledStoryCancel,
  hidden,
  setSharedStoryVisibility,
  user,
  savedLibrarySelection,
}) => {
  const dispatch = useDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const storyLoadingProgress = useSelector(
    ({ stories }) => stories.loadingProgress?.[story?._id] || EMPTY_LOADING_PROGRESS
  )
  const { title } = story

  const enableOnlyPractice = inGroupLibrary && !currentGroup?.is_teaching && story?.control_story

  const hadQuestions = Boolean(story?.has_questions)
  const rawLoadingProgress = Number(storyLoadingProgress.progress)
  const loadingProgressValue = Number.isFinite(rawLoadingProgress) ? rawLoadingProgress : 0
  const hasProcessingSignal =
    storyLoadingProgress.progress !== undefined || storyLoadingProgress.exercise_ready !== undefined
  const loadingReady =
    storyLoadingProgress.exercise_ready === true ||
    (Number.isFinite(loadingProgressValue) && loadingProgressValue >= 1)
  const disableDeleteButton =
    Boolean(story?.uploadUnfinished) || (hasProcessingSignal && !loadingReady)

  useEffect(() => {
    if (!isModalOpen || !showDeleteButton || !story?._id) return

    const shouldPoll = Boolean(story?.uploadUnfinished) || hasProcessingSignal
    if (!shouldPoll) return

    dispatch(getStoryLoadingProgress(story._id))
    if (loadingReady) return

    const interval = setInterval(() => {
      dispatch(getStoryLoadingProgress(story._id))
    }, 2000)

    return () => clearInterval(interval)
  }, [
    dispatch,
    hasProcessingSignal,
    isModalOpen,
    loadingReady,
    showDeleteButton,
    story?._id,
    story?.uploadUnfinished,
  ])

  const triggerEl = trigger
    ? React.cloneElement(trigger, { onClick: () => setIsModalOpen(true) })
    : null

  const deleteButton = (
    <AppButton
      variant="danger"
      data-cy="story-detail-modal-delete-button"
      onClick={handleDelete}
      disabled={disableDeleteButton}
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
  )

  // The teacher preview/review block and the controlled-story / reading-comprehension management rows.
  const showTeacherActions = !enableOnlyPractice && !story.flashcardsOnly && isTeacher
  const showManagementPills =
    showCreateControlStoryButton ||
    (isTeacher && savedLibrarySelection === 'private') ||
    showCancelControlStoryButton
  const showManageRow =
    showShareButton || story.user === user.oid || (inGroupLibrary && isTeacher) || showDeleteButton

  return (
    <>
      {triggerEl}
      <AppDialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="xs"
        title={title}
        sx={{
          // 530px content + 60px padding on each side = 650px paper, so the bottom
          // Share/Edit/Delete row fits on one line even with the longer Russian labels; anything
          // still too long wraps via the row's flexWrap rather than overflowing.
          '& .MuiDialog-paper': { width: 650, maxWidth: 650 },
          // 30px between the header and the first button group. MUI zeroes DialogContent's
          // top padding after a DialogTitle, so the gap lives on the title's bottom padding.
          '& .MuiDialogTitle-root': { padding: '40px 60px 20px 60px' },
          '& .MuiDialogContent-root': { padding: '0 60px 40px 60px' },
        }}
      >
        {/* 30px between the header and each button group (and between groups). Pills within a
            group keep their tight 0.75em spacing. */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          {/* Group 1 — learning actions */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.75em' }}>
            {/* Student */}
            {!isTeacher && !story.flashcardsOnly && (
              <ActionPill
                className="story-detail-modal-action-button library-tour-modal-practice-button"
                to={`/stories/${story._id}/${story.percent_cov > 0 ? 'review' : 'preview'}`}
                icon={<img src={images.bookOpen} alt="" />}
                labelId="practice"
              />
            )}
            {!enableOnlyPractice && !isTeacher && (
              <ActionPill
                to={`/flashcards/fillin/story/${story._id}/`}
                icon={<img src={images.cardsIcon} alt="" />}
                labelId="Flashcards"
                disabled={story.flashcard_count === 0}
                tooltipId={
                  story.flashcard_count === 0 ? 'disabled-flashcard-btn-explanation' : undefined
                }
              />
            )}
            {!enableOnlyPractice && !isTeacher && hadQuestions && (
              <ActionPill
                to={`/stories/${story._id}/reading_practice`}
                icon={<img src={images.fileCheck} alt="" />}
                labelId="reading-comprehension"
              />
            )}

            {/* Teacher: preview + review */}
            {showTeacherActions && (
              <>
                <ActionPill
                  className="story-detail-modal-action-button"
                  to={inGroupLibrary ? `/stories/${story._id}/group/preview` : `/stories/${story._id}/preview`}
                  icon={<VisibilityOutlinedIcon />}
                  labelId="preview"
                />
                <ActionPill
                  className="library-tour-modal-review-button"
                  to={inGroupLibrary ? `/stories/${story._id}/group/review` : `/stories/${story._id}/review`}
                  icon={<img src={images.fileCheck} alt="" />}
                  labelId="review"
                  disabled={!inGroupLibrary && story.percent_cov === 0}
                />
              </>
            )}
          </Box>

          {/* Group 2 — Compete / Crossword (student) */}
          {!isTeacher && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.75em' }}>
              <ActionPill
                to={`/stories/${story._id}/compete`}
                icon={<img src={images.flag01} alt="" />}
                labelId="compete"
                disabled={enableOnlyPractice}
              />
              <ActionPill
                to={`/crossword/${story._id}`}
                icon={<img src={images.grid01} alt="" />}
                labelId="Crossword"
                disabled={enableOnlyPractice}
              />
            </Box>
          )}

          {/* Controlled-story / reading-comprehension management pills */}
          {showManagementPills && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.75em' }}>
              {showCreateControlStoryButton && (
                <ActionPill
                  to={`/stories/${story._id}/controlled-story-editor`}
                  labelId="create-controlled-story"
                  icon={<img src={images.iconEdit} alt="" />}
                />
              )}
              {isTeacher && savedLibrarySelection === 'private' && (
                <ActionPill
                  to={`/stories/${story._id}/reading-comprehension-options`}
                  labelId="reading-comprehension"
                  icon={<img src={images.fileCheck} alt="" />}
                />
              )}
              {showCancelControlStoryButton && (
                <ActionPill
                  to={`/stories/${story._id}/controlled-story-editor`}
                  labelId="edit-controlled-story"
                  icon={<img src={images.iconEdit} alt="" />}
                />
              )}
              {showCancelControlStoryButton && (
                <ActionPill
                  onClick={handleControlledStoryCancel}
                  labelId="cancel-controlled-story"
                />
              )}
            </Box>
          )}

          {/* Group 3 — Manage row: Share / Edit / Delete */}
          {showManageRow && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                // Wrap (not nowrap) and never shrink the pills, so longer labels (e.g. Russian
                // "Поделиться / Редактировать / Удалить") keep their padding and move to the next
                // line instead of overflowing the buttons.
                flexWrap: 'wrap',
                gap: '0.75em',
                '& > *': { flexShrink: 0 },
                // Tighter left/right padding than the default pill so the three fit more compactly.
                '& button': { paddingLeft: '1em', paddingRight: '1em' },
              }}
            >
              {showShareButton && (
                <AppButton
                  variant="contrast-outline"
                  onClick={() => setShareModalOpen(true)}
                  sx={{ gap: '0.5em', whiteSpace: 'nowrap', '& > svg': { flexShrink: 0 } }}
                >
                  <IosShareOutlinedIcon />
                  <FormattedMessage id="Share" />
                </AppButton>
              )}
              {story.user === user.oid && (
                <Link to={`/stories/${story._id}/edit`}>
                  <AppButton
                    variant="contrast-outline"
                    sx={{ gap: '0.5em', whiteSpace: 'nowrap', '& img': { flexShrink: 0 } }}
                  >
                    <img src={images.iconEdit} alt="" />
                    <FormattedMessage id="edit-story" />
                  </AppButton>
                </Link>
              )}
              {inGroupLibrary && isTeacher && (
                <AppButton
                  variant="contrast-outline"
                  onClick={() => setSharedStoryVisibility(story._id, hidden === true)}
                >
                  <FormattedMessage id={(hidden && 'release-story') || 'hide-story'} />
                </AppButton>
              )}
              {showDeleteButton &&
                (disableDeleteButton ? (
                  <CustomTooltip keyId="story-detail-modal-disabled-delete-btn" permanent>
                    <span style={{ display: 'inline-block' }}>{deleteButton}</span>
                  </CustomTooltip>
                ) : (
                  deleteButton
                ))}
            </Box>
          )}
        </Box>
      </AppDialog>
    </>
  )
}

export default StoryDetailsModal
