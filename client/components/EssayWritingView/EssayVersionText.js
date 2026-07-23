import React from 'react'

// Split a sentence into word tokens (letter runs incl. Finnish diacritics / apostrophes / hyphens)
// and separator runs (whitespace + punctuation), preserving everything so it renders unchanged.
const WORD_TOKEN_RE = /\p{L}[\p{L}\p{M}’'-]*|[^\p{L}]+/gu
const normalizeWord = word => (word || '').normalize('NFC').toLowerCase()
const isWordToken = token => /\p{L}/u.test(token?.[0] || '')

// Renders one essay version (a list of sentences) with per-word interaction. Hovering anywhere in a
// sentence reports its index+side (parent highlights the aligned sentence on the OTHER side);
// clicking a word reports its index+word+side (parent highlights that word here + the sentence on the
// other side). A sentence is highlighted when the active pointer comes from the other side; a word is
// highlighted when it is the current selection on this side.
const EssayVersionText = ({ sentences = [], side, pointer, selection, onHover, onLeave, onSelect }) => (
  <>
    {sentences.map((sentence, sentenceIndex) => {
      const sentenceHighlighted =
        Boolean(pointer) && pointer.side !== side && pointer.index === sentenceIndex
      const tokens = (sentence || '').match(WORD_TOKEN_RE) || []

      return (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={sentenceIndex}>
          <span
            className={`essay-sentence${sentenceHighlighted ? ' essay-sentence-highlighted' : ''}`}
            onMouseEnter={() => onHover?.(sentenceIndex)}
            onMouseLeave={() => onLeave?.()}
          >
            {tokens.map((token, tokenIndex) => {
              if (!isWordToken(token)) {
                // eslint-disable-next-line react/no-array-index-key
                return <React.Fragment key={tokenIndex}>{token}</React.Fragment>
              }

              const wordNorm = normalizeWord(token)
              const wordHighlighted =
                Boolean(selection) &&
                selection.side === side &&
                selection.index === sentenceIndex &&
                selection.word === wordNorm

              return (
                <span
                  // eslint-disable-next-line react/no-array-index-key
                  key={tokenIndex}
                  className={`essay-word${wordHighlighted ? ' essay-word-highlighted' : ''}`}
                  role="button"
                  tabIndex={-1}
                  onClick={() => onSelect?.(sentenceIndex, wordNorm)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSelect?.(sentenceIndex, wordNorm)
                    }
                  }}
                >
                  {token}
                </span>
              )
            })}
          </span>{' '}
        </React.Fragment>
      )
    })}
  </>
)

export default EssayVersionText
