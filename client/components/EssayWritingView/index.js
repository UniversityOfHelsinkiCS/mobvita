import React from 'react'
import { useSelector } from 'react-redux'
import { Box, Divider, Paper, Typography } from '@mui/material'
import useWindowDimensions from 'Utilities/windowDimensions'
import FeedbackInfoModal from 'Components/CommonStoryTextComponents/FeedbackInfoModal'
import Footer from '../Footer'
import CombinedChatbot from 'Components/PracticeView/CombinedChatbot'
import HelperSidebar from 'Components/PracticeView/HelperSidebar'
import EssayTextInput from './EssayTextInput'

import './EssayWritingStyles.scss'

const EssayWritingView = () => {
  const { width } = useWindowDimensions()

  const isChatbotOpen = useSelector(state => state.helperSidebar?.isOpen ?? false)
  const showFooter = width > 640

  return (
    <Box className="essay-writing-page">
      <Box className="essay-writing-main">
        <Box
          className={`essay-writing-container ${
            isChatbotOpen ? 'essay-writing-container-sidebar-pushed' : ''
          }`}
        >
          <Paper
            data-cy="essay-writing-text"
            className="essay-writing-panel"
            elevation={1}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography component="h1" variant="h5" className="essay-writing-title">
                Essay writing mode
              </Typography>
            </Box>
            <Divider sx={{ mt: 2 }} />
            <EssayTextInput />
          </Paper>

          <HelperSidebar>
            <CombinedChatbot />
          </HelperSidebar>

          <FeedbackInfoModal />
        </Box>
      </Box>
      {showFooter && <Footer />}
    </Box>
  )
}

export default EssayWritingView
