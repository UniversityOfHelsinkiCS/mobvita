import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import { FormattedMessage, useIntl } from 'react-intl'
import { Button } from 'react-bootstrap'
import useWindowDimensions from 'Utilities/windowDimensions'
import { capitalize, hiddenFeatures, useLearningLanguage } from 'Utilities/common'
import {
  buildWritingEssaySentences,
  clearWritingCorrectionData,
  getWritingCorrectionKey,
  saveWritingEssay,
} from 'Utilities/redux/writingCorrectionReducer'
import { setHelperSidebarOpen } from 'Utilities/redux/helperSidebarReducer'
import { saveSelfIntermediate, updateLibrarySelect } from 'Utilities/redux/userReducer'
import FeedbackInfoModal from 'Components/CommonStoryTextComponents/FeedbackInfoModal'
import Footer from '../Footer'
import EssayChatbot from 'Components/ChatBot/EssayChatbot'
import HelperSidebar from 'Components/PracticeView/HelperSidebar'
import EssayTextInput from './EssayTextInput'
import { getCompletedSentences } from './utils/essaySentences'
import { clearStoredEssayText } from './utils/essayDraftStorage'

import './EssayWritingStyles.scss'

const EssayWritingView = () => {
  const { width } = useWindowDimensions()
  const intl = useIntl()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const learningLanguage = useLearningLanguage()
  const [essayFocus, setEssayFocus] = useState(null)
  const [essayText, setEssayText] = useState('')
  const [sentenceSelectionRequest, setSentenceSelectionRequest] = useState(null)
  const [essayResetKey, setEssayResetKey] = useState(0)
  const [topicDialogOpen, setTopicDialogOpen] = useState(false)
  const [topic, setTopic] = useState('')
  const [topicTaken, setTopicTaken] = useState(false)
  const selectedSelectionRef = useRef(null)
  const uploadInFlightRef = useRef(false)

  const isHelperSidebarOpen = useSelector(state => state.helperSidebar?.isOpen ?? false)
  const correctionsByKey = useSelector(state => state.writingCorrection.correctionsByKey)
  const writingSessionId = useSelector(state => state.writingCorrection.sessionId)
  const savePending = useSelector(state => state.writingCorrection.savePending)
  const saveError = useSelector(state => state.writingCorrection.saveError)
  const showFooter = width > 640

  // Don't let the user upload while a sentence's correction is still in flight — its payload entry
  // would be empty.
  const hasPendingCorrection = useMemo(
    () =>
      getCompletedSentences(essayText).some(
        sentence => correctionsByKey[getWritingCorrectionKey(sentence)]?.pending,
      ),
    [essayText, correctionsByKey],
  )

  const clearEssaySelection = () => {
    selectedSelectionRef.current = null
    setEssayFocus(null)
    setSentenceSelectionRequest({
      action: 'clear',
      requestId: Date.now(),
    })
  }

  // Selecting a word/correction in the essay text drives the chatbot focus; open the sidebar so the
  // chatbot (and its feedback) is visible when the user does so with it collapsed.
  const handleEssayTextFocusChange = focus => {
    setEssayFocus(focus)

    if (focus?.selection && !isHelperSidebarOpen) {
      dispatch(setHelperSidebarOpen(true))
    }
  }

  // Drop the saved draft and remount the editor so it starts empty (after upload / clear cache).
  const resetEssayDraft = () => {
    clearStoredEssayText()
    setEssayText('')
    setEssayFocus(null)
    setSentenceSelectionRequest(null)
    selectedSelectionRef.current = null
    setEssayResetKey(key => key + 1)
  }

  // Save the essay as its current list of sentences, each with the backend-id edit history + cached
  // corrections, under the topic the user entered.
  const handleConfirmUpload = () => {
    setTopicTaken(false)
    uploadInFlightRef.current = true
    dispatch(
      saveWritingEssay({
        language: capitalize(learningLanguage),
        sessionId: writingSessionId,
        sentences: buildWritingEssaySentences(getCompletedSentences(essayText), correctionsByKey),
        title: topic.trim(),
      }),
    )
  }

  // Dev/staging only: wipe the cached corrections + session and the draft.
  const handleClearCache = () => {
    dispatch(clearWritingCorrectionData())
    resetEssayDraft()
  }

  // When the save settles: on success close the dialog and clear the cache/session + draft; on failure
  // keep the dialog open with a message so the user can retry.
  useEffect(() => {
    if (!uploadInFlightRef.current || savePending) return

    uploadInFlightRef.current = false

    if (saveError) {
      setTopicTaken(true)
      return
    }

    setTopicDialogOpen(false)
    setTopic('')
    setTopicTaken(false)
    dispatch(clearWritingCorrectionData())
    resetEssayDraft()
    dispatch(saveSelfIntermediate({ last_selected_library: 'essays' }))
    dispatch(updateLibrarySelect('essays'))
    navigate('/library')
  }, [savePending, saveError])

  const isSameSelection = (first, second) =>
    first &&
    second &&
    first.sentenceId === second.sentenceId &&
    first.startOffset === second.startOffset &&
    first.endOffset === second.endOffset

  const requestSentenceSelection = selectionRequest => {
    if (selectionRequest?.interactionType === 'leave') {
      setSentenceSelectionRequest(
        selectedSelectionRef.current
          ? { ...selectedSelectionRef.current, requestId: Date.now() }
          : { action: 'clear', requestId: Date.now() },
      )
      return
    }

    if (selectionRequest?.interactionType === 'click') {
      if (isSameSelection(selectedSelectionRef.current, selectionRequest)) {
        clearEssaySelection()
        return
      }

      selectedSelectionRef.current = selectionRequest
      setSentenceSelectionRequest(selectionRequest)

      setEssayFocus(
        selectionRequest?.sentence
          ? {
              correctedText: selectionRequest.correctedText || null,
              feedbackText: selectionRequest.feedbackText || null,
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
            }
          : null,
      )
      return
    }

    setSentenceSelectionRequest(selectionRequest)
  }

  return (
    <Box className="essay-writing-page">
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {hiddenFeatures && (
                  <Button
                    variant="outline-secondary"
                    onClick={handleClearCache}
                    data-cy="essay-clear-cache"
                  >
                    Clear cache
                  </Button>
                )}
                <Button
                  onClick={() => setTopicDialogOpen(true)}
                  disabled={
                    savePending || hasPendingCorrection || !essayText.trim() || !writingSessionId
                  }
                  data-cy="submit-essay"
                >
                  <FormattedMessage id="upload-to-my-essays" />
                </Button>
              </Box>
            </Box>
            <Divider sx={{ mt: 2 }} />
            <EssayTextInput
              key={essayResetKey}
              focusLocked={Boolean(essayFocus?.selection)}
              onEssayFocusChange={handleEssayTextFocusChange}
              onEssayTextChange={setEssayText}
              sentenceSelectionRequest={sentenceSelectionRequest}
            />
          </Paper>

          <HelperSidebar>
            <EssayChatbot
              essayFocus={essayFocus}
              essayText={essayText}
              onClearFocus={clearEssaySelection}
              onSentenceSelect={requestSentenceSelection}
            />
          </HelperSidebar>

          <FeedbackInfoModal />
        </Box>
      </Box>
      {showFooter && <Footer />}

      <Dialog
        open={topicDialogOpen}
        onClose={() => setTopicDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <FormattedMessage id="upload-from-web-button" />
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            value={topic}
            error={topicTaken}
            onChange={event => {
              setTopic(event.target.value)
              setTopicTaken(false)
            }}
            onKeyDown={event => {
              if (event.key === 'Enter' && topic.trim() && !savePending) {
                event.preventDefault()
                handleConfirmUpload()
              }
            }}
            placeholder={intl.formatMessage({
              id: 'topic-singular',
            })}
            data-cy="essay-topic-input"
            sx={{ mt: 1 }}
          />
          {topicTaken && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }} data-cy="essay-topic-taken">
              <FormattedMessage id="essay-upload-topic-taken" />
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outline-secondary"
            onClick={() => {
              setTopicDialogOpen(false)
              setTopicTaken(false)
            }}
          >
            <FormattedMessage id="cancel" defaultMessage="Cancel" />
          </Button>
          <Button
            onClick={handleConfirmUpload}
            disabled={!topic.trim() || savePending}
            data-cy="essay-topic-confirm"
          >
            <FormattedMessage id="upload-from-web-button" />
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default EssayWritingView
