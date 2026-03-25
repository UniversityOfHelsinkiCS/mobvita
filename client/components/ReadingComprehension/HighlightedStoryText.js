import React, { useMemo } from 'react'

const HighlightedStoryText = ({
  paragraphs = [],
  highlightedSentenceIds = [],
  highlightBgColor = 'rgba(10, 248, 66, 0.74)', // light yellowish-beige
  paragraphStyle = { marginBottom: 16, lineHeight: 1.7 },
}) => {
  const highlightedSet = useMemo(
    () => new Set(highlightedSentenceIds.map(Number)),
    [highlightedSentenceIds]
  )

  return (
    <>
      {paragraphs.map((paragraph, i) => (
        <p key={i} style={paragraphStyle}>
          {paragraph.map((token, j) => {
            const isHighlighted = highlightedSet.has(Number(token.sentence_id))
            return (
              <span
                key={j}
                style={
                  isHighlighted
                    ? {
                        background: highlightBgColor,
                        transition: 'background 0.2s',
                      }
                    : undefined
                }
              >
                {token.surface}
              </span>
            )
          })}
        </p>
      ))}
    </>
  )
}

export default HighlightedStoryText