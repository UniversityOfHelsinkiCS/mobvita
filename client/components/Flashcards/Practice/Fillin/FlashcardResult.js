import React from 'react'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined'

const FlashcardResult = ({ answerCorrect }) => {
  if (answerCorrect === null) return null

  const ResultIcon = answerCorrect ? ThumbUpAltOutlinedIcon : ThumbDownAltOutlinedIcon

  return (
    <div className="flashcard-result">
      <ResultIcon sx={{ fontSize: 48 }} />
    </div>
  )
}

export default FlashcardResult
