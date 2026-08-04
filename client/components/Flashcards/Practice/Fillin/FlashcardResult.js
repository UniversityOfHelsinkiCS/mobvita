import React from 'react'
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined'
import ThumbDownAltOutlinedIcon from '@mui/icons-material/ThumbDownAltOutlined'

const FlashcardResult = ({ answerCorrect }) => {
  if (answerCorrect === null) return null

  const ResultIcon = answerCorrect ? ThumbUpAltOutlinedIcon : ThumbDownAltOutlinedIcon

  return (
    <div className="flashcard-result">
      {/* `thumbs up` / `thumbs down` classes are kept for flashcards_spec.js selectors. */}
      <ResultIcon className={answerCorrect ? 'thumbs up' : 'thumbs down'} sx={{ fontSize: 48 }} />
    </div>
  )
}

export default FlashcardResult
