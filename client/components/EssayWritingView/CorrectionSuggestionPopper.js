import React from 'react'
import { Box, Paper } from '@mui/material'

import CorrectedWord from 'Components/DebugCorrectionView/CorrectedWord'
import Spinner from 'Components/Spinner'
import { hiddenFeatures } from 'Utilities/common'
import {
  getWritingCorrectionWords,
  writingCorrectionHasChanges,
} from 'Utilities/redux/writingCorrectionReducer'

const CorrectionSuggestionPopper = ({
  correctionEntry,
  highlightedWords,
  sentence,
  setHighLightedWords,
}) => {
  if (!correctionEntry) {
    return null
  }

  const renderCorrectionContent = () => {
    if (correctionEntry.pending) {
      return (
        <Box className="essay-writing-correction-loading">
          <Spinner size={30} />
        </Box>
      )
    }

    if (correctionEntry.error) {
      return (
        <Box className="essay-writing-correction-content">
          {hiddenFeatures && (
            <Box component="span" className="essay-writing-correction-error-tag">
              Error
            </Box>
          )}
        </Box>
      )
    }

    const corrections = getWritingCorrectionWords(correctionEntry.corrections)

    if (!writingCorrectionHasChanges(corrections)) {
      return null
    }

    return (
      <Box className="essay-writing-correction-content">
        {corrections.map((word, index) => (
          <CorrectedWord
            key={index}
            word={word}
            highlightedWords={highlightedWords}
            setHighLightedWords={setHighLightedWords}
          />
        ))}
      </Box>
    )
  }

  const correctionContent = renderCorrectionContent()

  if (!correctionContent) {
    return null
  }

  return (
    <Paper
      className="essay-writing-correction-bubble"
      data-sentence={sentence}
      elevation={3}
    >
      {correctionContent}
    </Paper>
  )
}

export default CorrectionSuggestionPopper
