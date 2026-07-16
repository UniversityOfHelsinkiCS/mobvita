import React from 'react'
import { Box, IconButton, Paper } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { FormattedMessage } from 'react-intl'

import CustomTooltip from 'Components/CustomTooltip'
import CorrectedWord from 'Components/EssayWritingView/CorrectedWord'
import SanitizedHTML from 'Components/SanitizedHTML'
import Spinner from 'Components/Spinner'
import { hiddenFeatures } from 'Utilities/common'
import { getWritingCorrectionWords } from 'Utilities/redux/writingCorrectionReducer'
import {
  getCorrectionGroupChatFeedbackText,
  getCorrectionGroupFeedbackText,
  getCorrectionGroupFocus,
  getCorrectionGroups,
  getCorrectionGroupType,
  getCorrectionText,
  isCorrectionDeletion,
  isCorrectionInsertion,
} from './utils/correctionTokens'

const getCorrectionSelectionRequest = (correctionRange, correctionFocus) => ({
  ...(correctionRange || {}),
  ...(correctionFocus || {}),
})

const CorrectionBubble = ({
  children,
  correctionFocus,
  correctionRange,
  correctionType,
  feedbackText,
  isActive,
  onSentenceSelect,
  sentence,
  showFeedbackIcon,
}) => (
  <Paper
    className={[
      'essay-writing-correction-bubble',
      correctionType ? `essay-writing-correction-bubble-${correctionType}` : '',
      isActive ? 'essay-writing-correction-bubble-active' : '',
    ]
      .filter(Boolean)
      .join(' ')}
    data-sentence={sentence}
    elevation={3}
    onClick={() =>
      onSentenceSelect?.(getCorrectionSelectionRequest(correctionRange, correctionFocus), 'click')
    }
    onMouseEnter={() =>
      onSentenceSelect?.(getCorrectionSelectionRequest(correctionRange, correctionFocus), 'hover')
    }
    onMouseLeave={() =>
      onSentenceSelect?.(getCorrectionSelectionRequest(correctionRange, correctionFocus), 'leave')
    }
    sx={{ cursor: onSentenceSelect ? 'pointer' : 'default' }}
  >
    {children}
    {showFeedbackIcon && feedbackText && !isActive && (
      <CustomTooltip
        placement="top"
        title={<SanitizedHTML html={feedbackText} tagName={Box} sx={{ whiteSpace: 'pre-line' }} />}
      >
        <IconButton
          aria-label="Correction feedback"
          className="essay-writing-correction-feedback-button"
          size="small"
        >
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </CustomTooltip>
    )}
  </Paper>
)

const rangesMatch = (firstRange, secondRange) =>
  firstRange &&
  secondRange &&
  firstRange.startOffset === secondRange.startOffset &&
  firstRange.endOffset === secondRange.endOffset

const CorrectionSuggestionPopper = ({
  correctionEntry,
  focusedSelection,
  renderOnlyFocused,
  sentence,
  onSentenceSelect,
}) => {
  if (!correctionEntry) {
    return null
  }

  if (correctionEntry.pending) {
    return (
      <CorrectionBubble sentence={sentence}>
        <Box className="essay-writing-correction-loading">
          <Spinner size={30} />
        </Box>
      </CorrectionBubble>
    )
  }

  if (correctionEntry.error) {
    return (
      <CorrectionBubble sentence={sentence}>
        <Box className="essay-writing-correction-content">
          {hiddenFeatures && (
            <Box component="span" className="essay-writing-correction-error-tag">
              <FormattedMessage id="error" />
            </Box>
          )}
        </Box>
      </CorrectionBubble>
    )
  }

  if (renderOnlyFocused && !focusedSelection) {
    return null
  }

  const corrections = getWritingCorrectionWords(correctionEntry.corrections)
  const allCorrectionGroups = getCorrectionGroups(sentence, corrections)
  const correctionGroups = renderOnlyFocused
    ? allCorrectionGroups.filter(group => rangesMatch(focusedSelection, group.range))
    : allCorrectionGroups

  if (!correctionGroups.length) {
    return null
  }

  return (
    <>
      {correctionGroups.map((correctionGroup, groupIndex) => {
        const hintText = getCorrectionGroupFeedbackText(correctionGroup)
        const groupType = getCorrectionGroupType(correctionGroup)
        const isChunk = correctionGroup.words.length > 1
        const displayedWords =
          isChunk && !hiddenFeatures
            ? correctionGroup.words.filter(
                word => !isCorrectionInsertion(word) && !isCorrectionDeletion(word),
              )
            : correctionGroup.words
        const showHintInline =
          !isChunk && (groupType === 'deletion' || groupType === 'insertion') && Boolean(hintText)
        const bubbleFeedbackText = getCorrectionGroupChatFeedbackText(correctionGroup)

        const correctionFocus = {
          ...getCorrectionGroupFocus(correctionGroup),
          feedbackText: bubbleFeedbackText,
        }
        const isSingleInsertionOrDeletion =
          !isChunk && (groupType === 'deletion' || groupType === 'insertion')
        // A single-token hint bubble renders nothing inline, so reveal its answer below (dev/staging).
        const devAnswerWords =
          hiddenFeatures && showHintInline
            ? correctionGroup.words.filter(
                word => isCorrectionInsertion(word) || isCorrectionDeletion(word),
              )
            : []

        return (
          <CorrectionBubble
            correctionFocus={correctionFocus}
            correctionRange={correctionGroup.range}
            correctionType={groupType}
            feedbackText={bubbleFeedbackText}
            isActive={rangesMatch(focusedSelection, correctionGroup.range)}
            key={`${correctionGroup.range?.startOffset ?? groupIndex}-${groupIndex}`}
            onSentenceSelect={onSentenceSelect}
            sentence={sentence}
            showFeedbackIcon={!isSingleInsertionOrDeletion}
          >
            <Box className="essay-writing-correction-content">
              {showHintInline ? (
                <SanitizedHTML
                  html={hintText}
                  tagName={Box}
                  className="essay-writing-correction-hint"
                  sx={{ whiteSpace: 'pre-line' }}
                />
              ) : (
                displayedWords.map((word, index) => {
                  // Dev/staging: show a chunk's insertion/deletion answers at their spot, greyed out
                  // (insertion underlined, deletion struck through) so they don't read as real text.
                  const isDevInsertion = hiddenFeatures && isCorrectionInsertion(word)
                  const isDevDeletion = hiddenFeatures && isCorrectionDeletion(word)

                  if (isDevInsertion || isDevDeletion) {
                    const answerText = isDevInsertion
                      ? getCorrectionText(word.corrected).trim()
                      : getCorrectionText(word.original).trim()

                    if (!answerText) return null

                    return (
                      <span
                        key={index}
                        className="essay-writing-corrected-word-dev-correction"
                        style={{ textDecoration: isDevDeletion ? 'line-through' : 'underline' }}
                      >
                        {answerText}
                      </span>
                    )
                  }

                  return <CorrectedWord key={index} word={word} showCorrection={hiddenFeatures} />
                })
              )}
              {devAnswerWords.map((word, index) => (
                <span
                  key={`dev-answer-${index}`}
                  className="essay-writing-corrected-word-dev-correction"
                  style={{
                    textDecoration: isCorrectionDeletion(word) ? 'line-through' : 'underline',
                  }}
                >
                  {isCorrectionInsertion(word)
                    ? `→ ${getCorrectionText(word.corrected).trim()}`
                    : getCorrectionText(word.original).trim()}
                </span>
              ))}
            </Box>
          </CorrectionBubble>
        )
      })}
    </>
  )
}

export default CorrectionSuggestionPopper
