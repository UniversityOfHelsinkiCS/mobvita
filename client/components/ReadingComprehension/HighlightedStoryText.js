import React, { useMemo } from 'react'

const HighlightedStoryText = ({
  paragraphs = [],
  highlightedSentenceIds = [],
  highlightColor = '#21ba45',
  normalWeight = 400,
  highlightWeight = 700,
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
                style={{
                  color: isHighlighted ? highlightColor : undefined,
                  fontWeight: isHighlighted ? highlightWeight : normalWeight,
                }}
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