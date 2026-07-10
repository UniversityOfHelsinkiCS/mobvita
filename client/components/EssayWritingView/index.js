import React, { useEffect, useRef, useState } from 'react'
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
  // The bubble the user clicked; hovering another bubble previews it, and leaving reverts to this one.
  const selectedSelectionRef = useRef(null)

  const isHelperSidebarOpen = useSelector(state => state.helperSidebar?.isOpen ?? false)
  const showFooter = width > 640

  useEffect(() => {
    const handleDocumentMouseDown = event => {
      if (!(event.target instanceof Element)) return

      if (event.target.closest('.essay-writing-input-area, .essay-writing-correction-bubble, .chatbot-input-area .chatbot-input-form')) {
        return
      }

      clearEssaySelection()
    }

    document.addEventListener('mousedown', handleDocumentMouseDown)

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown)
    }
  }, [])

  const clearEssaySelection = () => {
    selectedSelectionRef.current = null
    setEssayFocus(null)
    setSentenceSelectionRequest({
      action: 'clear',
      requestId: Date.now(),
    })
  }

  const isSameSelection = (first, second) =>
    first &&
    second &&
    first.sentenceId === second.sentenceId &&
    first.startOffset === second.startOffset &&
    first.endOffset === second.endOffset

  const requestSentenceSelection = selectionRequest => {
    // Leaving a hovered bubble reverts the preview to the currently selected bubble (or clears it).
    if (selectionRequest?.interactionType === 'leave') {
      setSentenceSelectionRequest(
        selectedSelectionRef.current
          ? { ...selectedSelectionRef.current, requestId: Date.now() }
          : { action: 'clear', requestId: Date.now() },
      )
      return
    }

    if (selectionRequest?.interactionType === 'click') {
      // Clicking the already-selected bubble toggles it off.
      if (isSameSelection(selectedSelectionRef.current, selectionRequest)) {
        clearEssaySelection()
        return
      }

      selectedSelectionRef.current = selectionRequest
      setSentenceSelectionRequest(selectionRequest)

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
      return
    }

    // Hover preview.
    setSentenceSelectionRequest(selectionRequest)
  }

  return (
    <Box
      className="essay-writing-page"
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
