import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Box, Divider, Paper, Typography } from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { Button } from 'react-bootstrap'
import useWindowDimensions from 'Utilities/windowDimensions'
import FeedbackInfoModal from 'Components/CommonStoryTextComponents/FeedbackInfoModal'
import Footer from '../Footer'
import EssayChatbot from 'Components/ChatBot/EssayChatbot'
import HelperSidebar from 'Components/PracticeView/HelperSidebar'
import EssayTextInput from './EssayTextInput'

import './EssayWritingStyles.scss'

const EssayWritingView = () => {
  const { width } = useWindowDimensions()
  const [essayFocus, setEssayFocus] = useState(null)
  const [essayText, setEssayText] = useState('')
  const [sentenceSelectionRequest, setSentenceSelectionRequest] = useState(null)

  const isHelperSidebarOpen = useSelector(state => state.helperSidebar?.isOpen ?? false)
  const showFooter = width > 640

  const clearEssaySelection = () => {
    setEssayFocus(null)
    setSentenceSelectionRequest({
      action: 'clear',
      requestId: Date.now(),
    })
  }

  const requestSentenceSelection = selectionRequest => {
    setSentenceSelectionRequest(selectionRequest)

    if (selectionRequest?.interactionType !== 'click') return

    setEssayFocus(selectionRequest?.sentence ? {
      correctedText: selectionRequest.correctedText || null,
      focusedSentence: selectionRequest.sentence,
      focusedWord: selectionRequest.focusedWord || null,
      focusedWordId: selectionRequest.focusedWordId ?? null,
      focusedWordIds: selectionRequest.focusedWordIds || [],
      originalText: selectionRequest.originalText || selectionRequest.sentence,
      sentenceId: selectionRequest.sentenceId,
      selection: {
        endOffset: selectionRequest.endOffset,
        isDeletion: selectionRequest.isDeletion,
        isInsertion: selectionRequest.isInsertion,
        sentenceId: selectionRequest.sentenceId,
        startOffset: selectionRequest.startOffset,
      },
    } : null)
  }

  const handleEssayMouseDownCapture = event => {
    if (
      event.target instanceof Element &&
      event.target.closest('.essay-writing-input-area, .essay-writing-correction-bubble')
    ) {
      return
    }

    clearEssaySelection()
  }

  return (
    <Box
      className="essay-writing-page"
      onMouseDownCapture={handleEssayMouseDownCapture}
    >
      <Box className="essay-writing-main">
        <Box
          className={`essay-writing-container ${
            isHelperSidebarOpen ? 'essay-writing-container-sidebar-pushed' : ''
          }`}
        >
          <Paper data-cy="essay-writing-text" className="essay-writing-panel" elevation={1}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography component="h1" variant="h5" className="essay-writing-title">
                <FormattedMessage id="essay-writing-title" />
              </Typography>
              <Button
                form="url-upload"
                type="submit"
                onClick={() => console.log('story uploaded')}
                data-cy="submit-essay"
              >
                <FormattedMessage id="upload-from-web-button" />
              </Button>
            </Box>
            <Divider sx={{ mt: 2 }} />
            <EssayTextInput
              onEssayFocusChange={setEssayFocus}
              onEssayTextChange={setEssayText}
              sentenceSelectionRequest={sentenceSelectionRequest}
            />
          </Paper>

          <HelperSidebar>
            <EssayChatbot
              essayFocus={essayFocus}
              essayText={essayText}
              onSentenceSelect={requestSentenceSelection}
            />
          </HelperSidebar>

          <FeedbackInfoModal />
        </Box>
      </Box>
      {showFooter && <Footer />}
    </Box>
  )
}

export default EssayWritingView
