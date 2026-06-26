import React from 'react'
import { Box, Paper } from '@mui/material'
import { FormattedMessage } from 'react-intl'

import CorrectedWord from 'Components/EssayWritingView/CorrectedWord'
import Spinner from 'Components/Spinner'
import { hiddenFeatures } from 'Utilities/common'
import { getWritingCorrectionWords } from 'Utilities/redux/writingCorrectionReducer'
import { getCorrectionGroups } from './utils/correctionTokens'

const CorrectionBubble = ({
  children,
  correctionRange,
  onSentenceSelect,
  sentence,
}) => (
  <Paper
    className="essay-writing-correction-bubble"
    data-sentence={sentence}
    elevation={3}
    onClick={() => onSentenceSelect?.(correctionRange)}
    onMouseEnter={() => onSentenceSelect?.(correctionRange)}
    sx={{ cursor: onSentenceSelect ? 'pointer' : 'default' }}
  >
    {children}
  </Paper>
)

const CorrectionSuggestionPopper = ({
  correctionEntry,
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
      {correctionGroups.map((correctionGroup, groupIndex) => (
        <CorrectionBubble
          correctionRange={correctionGroup.range}
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
      ))}
    </>
  )
}

export default CorrectionSuggestionPopper
