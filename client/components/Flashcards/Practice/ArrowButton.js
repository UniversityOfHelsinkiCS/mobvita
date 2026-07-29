import React from 'react'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'

const ArrowButton = ({ disabled, onClick, hidden = false }) => {
  if (hidden) return null

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flashcard-arrow-button"
      style={{ marginLeft: 0 }}
    >
      <KeyboardDoubleArrowRightIcon sx={{ fontSize: 48 }} />
    </button>
  )
}

export default ArrowButton
