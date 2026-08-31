import React from 'react'

// Split a sentence into word tokens (letter runs incl. Finnish diacritics / apostrophes / hyphens)
// and separator runs (whitespace + punctuation), preserving everything so it renders unchanged.
const WORD_TOKEN_RE = /\p{L}[\p{L}\p{M}’'-]*|[^\p{L}]+/gu
const normalizeWord = word => (word || '').normalize('NFC').toLowerCase()
const isWordToken = token => /\p{L}/u.test(token?.[0] || '')

// Renders one essay version — a list of { key, text } sentences — with per-word interaction.
// Hovering anywhere in a sentence reports its key+index+side (parent highlights the sentence the key
// pairs it with on the OTHER side); clicking a word also reports the word (parent highlights it
// here + the paired sentence on the other side). Sentences are matched by key rather than by
// position: the two versions hold different sentences wherever one was deleted, split or merged, so
// the same index is not the same sentence.
const EssayVersionText = ({ sentences = [], side, pointer, selection, onHover, onLeave, onSelect }) => (
  <>
    {sentences.map((sentence, sentenceIndex) => {
      const sentenceHighlighted =
        Boolean(pointer) && pointer.side !== side && pointer.key === sentence.key
      const tokens = (sentence?.text || '').match(WORD_TOKEN_RE) || []

      return (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={sentenceIndex}>
          <span
            className={`essay-sentence${sentenceHighlighted ? ' essay-sentence-highlighted' : ''}`}
            data-cy="essay-version-sentence"
            onMouseEnter={() => onHover?.(sentenceIndex, sentence.key)}
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
                  onClick={() => onSelect?.(sentenceIndex, sentence.key, wordNorm)}
                  onKeyDown={event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSelect?.(sentenceIndex, sentence.key, wordNorm)
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
