import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

const HighlightedStoryText = ({
  paragraphs = [],
  highlightedSentenceIds = [],
  highlightBgColor = '#fdea3b',
  paragraphStyle = { marginBottom: 16, lineHeight: 1.7 },
  onWordClick,
  selectedBgColor = 'rgba(12, 159, 250, 0.25)',
  selectedAndHighlightedBgColor = 'rgba(12, 159, 250, 0.35)',
}) => {
  const highlightedSet = useMemo(
    () => new Set(highlightedSentenceIds.map(Number)),
    [highlightedSentenceIds]
  )

  // Reuse the same selection mechanism as PracticeView (annotations.highlightRange)
  const highlightRange = useSelector(({ annotations }) => annotations.highlightRange)
  const hasRange = highlightRange?.start != null && highlightRange?.end != null
  const rangeStart = hasRange ? Number(highlightRange.start) : null
  const rangeEnd = hasRange ? Number(highlightRange.end) : null

  return (
    <>
      {paragraphs.map((paragraph, i) => (
                <p key={i} style={paragraphStyle}>
          {paragraph.map((token, j) => {
            const isHighlighted = highlightedSet.has(Number(token.sentence_id))
            const tokenId = Number(token.ID)
            const isSelected =
              hasRange && Number.isFinite(tokenId) && tokenId >= rangeStart && tokenId <= rangeEnd

            // Only recognized words (those with lemmas) are clickable/translatable.
            const clickable = typeof onWordClick === 'function' && !!token.lemmas

            let style
            if (isHighlighted || isSelected) {
              style = {
                background: isSelected
                  ? isHighlighted
                    ? selectedAndHighlightedBgColor
                    : selectedBgColor
                  : highlightBgColor,
                transition: 'background 0.2s',
              }
            }

            return (
              <span
                key={j}
                data-cy={`story-token-p${i}-t${j}`}
                className={clickable ? 'word-interactive' : undefined}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? -1 : undefined}
                onClick={clickable ? () => onWordClick(token, paragraph) : undefined}
                onKeyDown={clickable ? () => onWordClick(token, paragraph) : undefined}
                style={style}
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