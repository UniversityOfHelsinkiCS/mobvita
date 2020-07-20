import React from 'react'

const PlainWord = ({ surface, lemmas, wordId, handleWordClick, ...props }) => {
  if (surface === '\n\n') {
    return (
      <div style={{ lineHeight: '50%' }}>
        <br />
      </div>
    )
  }

  if (!lemmas) return <span {...props}>{surface}</span>

  return (
    <span
      role="button"
      tabIndex={-1}
      onKeyDown={() => handleWordClick(surface, lemmas, wordId)}
      onClick={() => handleWordClick(surface, lemmas, wordId)}
      className="word-interactive"
      {...props}
    >
      {surface}
    </span>
  )
}

export default PlainWord
