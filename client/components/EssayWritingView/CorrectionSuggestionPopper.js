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
  getCorrectionFeedbackText,
  getCorrectionGroupFocus,
  getCorrectionGroups,
  getCorrectionGroupType,
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
}) => (
  <Paper
    className={[
      'essay-writing-correction-bubble',
      correctionType ? `essay-writing-correction-bubble-${correctionType}` : '',
      isActive ? 'essay-writing-correction-bubble-active' : '',
    ].filter(Boolean).join(' ')}
    data-sentence={sentence}
    elevation={3}
    onClick={() => onSentenceSelect?.(
      getCorrectionSelectionRequest(correctionRange, correctionFocus),
      'click',
    )}
    onMouseEnter={() => onSentenceSelect?.(
      getCorrectionSelectionRequest(correctionRange, correctionFocus),
      'hover',
    )}
    onMouseLeave={() => onSentenceSelect?.(
      getCorrectionSelectionRequest(correctionRange, correctionFocus),
      'leave',
    )}
    sx={{ cursor: onSentenceSelect ? 'pointer' : 'default' }}
  >
    {children}
    {feedbackText && (
      <CustomTooltip
        placement="top"
        title={(
          <SanitizedHTML
            html={feedbackText}
            tagName={Box}
            sx={{ whiteSpace: 'pre-line' }}
          />
        )}
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

const getCorrectionGroupFeedbackText = correctionGroup => (
  correctionGroup.words
    .map(word => getCorrectionFeedbackText(word.feedback))
    .filter(feedbackText => feedbackText && !['Added', 'Removed'].includes(feedbackText))
    .join('\n')
)

const rangesMatch = (firstRange, secondRange) => (
  firstRange &&
  secondRange &&
  firstRange.startOffset === secondRange.startOffset &&
  firstRange.endOffset === secondRange.endOffset
)

const CorrectionSuggestionPopper = ({
  correctionEntry,
  focusedSelection,
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

  const corrections = getWritingCorrectionWords(correctionEntry.corrections)
  const correctionGroups = getCorrectionGroups(sentence, corrections)

  if (!correctionGroups.length) {
    return null
  }

  return (
    <>
      {correctionGroups.map((correctionGroup, groupIndex) => {
        const correctionFocus = getCorrectionGroupFocus(correctionGroup)

        return (
          <CorrectionBubble
            correctionFocus={correctionFocus}
            correctionRange={correctionGroup.range}
            correctionType={getCorrectionGroupType(correctionGroup)}
            feedbackText={getCorrectionGroupFeedbackText(correctionGroup)}
            isActive={rangesMatch(focusedSelection, correctionGroup.range)}
            key={`${correctionGroup.range?.startOffset ?? groupIndex}-${groupIndex}`}
            onSentenceSelect={onSentenceSelect}
            sentence={sentence}
          >
            <Box className="essay-writing-correction-content">
              {correctionGroup.words.map((word, index) => (
                <CorrectedWord
                  key={index}
                  word={word}
                />
              ))}
            </Box>
          </CorrectionBubble>
        )
      })}
    </>
  )
}

export default CorrectionSuggestionPopper
