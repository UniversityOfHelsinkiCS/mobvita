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
  const [sentenceSelectionRequest, setSentenceSelectionRequest] = useState(null)

  const isHelperSidebarOpen = useSelector(state => state.helperSidebar?.isOpen ?? false)
  const showFooter = width > 640

  const requestSentenceSelection = selectionRequest => {
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
            <EssayTextInput sentenceSelectionRequest={sentenceSelectionRequest} />
          </Paper>

          <HelperSidebar>
            <EssayChatbot onSentenceSelect={requestSentenceSelection} />
          </HelperSidebar>

          <FeedbackInfoModal />
        </Box>
      </Box>
      {showFooter && <Footer />}
    </Box>
  )
}

export default EssayWritingView
