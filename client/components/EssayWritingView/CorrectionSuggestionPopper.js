import React from 'react'
import { Box, Paper, Popper } from '@mui/material'

import CorrectedWord from 'Components/DebugCorrectionView/CorrectedWord'
import Spinner from 'Components/Spinner'
import { hiddenFeatures } from 'Utilities/common'
import { getWritingCorrectionWords } from 'Utilities/redux/writingCorrectionReducer'

const CorrectionSuggestionPopper = ({
  anchorEl,
  correctionEntry,
  highlightedWords,
  open,
  sentence,
  setHighLightedWords,
}) => {
  const renderCorrectionContent = () => {
    if (!correctionEntry || correctionEntry.pending) {
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

  return (
    <Popper
      open={open && Boolean(anchorEl)}
      anchorEl={anchorEl}
      placement="bottom-start"
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [0, 8],
          },
        },
      ]}
    >
      <Paper
        className="essay-writing-correction-bubble"
        data-sentence={sentence}
        elevation={3}
      >
        {renderCorrectionContent()}
      </Paper>
    </Popper>
  )
}

export default CorrectionSuggestionPopper
