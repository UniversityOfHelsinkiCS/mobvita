import React from 'react'

const PlainWord = ({ surface, lemmas, wordId, handleWordClick }) => {
  if (surface === '\n\n') {
    return (
      <div style={{ lineHeight: '50%' }}>
        <br />
      </div>
    )
  }

  if (!lemmas) return surface

  return (
    <span
      role="button"
      tabIndex={-1}
      onKeyDown={() => handleWordClick(surface, lemmas, wordId)}
      onClick={() => handleWordClick(surface, lemmas, wordId)}
      className="word-interactive"
    >
      {surface}
    </span>
  )
}

export default PlainWord
