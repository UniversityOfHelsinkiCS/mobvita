import React from 'react'
import { styled } from '@mui/material/styles'
import { colors, font } from 'Assets/mui_theme/designTokens'
import { images } from 'Utilities/common'

/**
 * AppPagination — the 2026 numbered pagination: round page "coins" between first/previous and
 * next/last steps. The active page is filled with the sage-green; the others are outlined and fill
 * tan on hover. For long ranges it shows a window of five pages around the current one, pinned
 * between the first page and the last (1 … 6 7 8 9 10 … 20).
 *
 * The ellipsis coins are clickable and halve the distance to the end they point at — click the
 * right one on page 1 of 100 and you land on 51, then 76, and so on; the left one halves toward 1.
 * Without it the window only ever offers page ±1, so reaching the middle of a long range means
 * clicking through every page in between.
 *
 * The step buttons draw no ring of their own: each is one tinted icon that carries its circle, the
 * forward pair being the same artwork turned around.
 *
 * Controlled: `page` (1-indexed) + `count` (total pages) + `onChange(page)`.
 */
const SIZE = 36

const Coin = styled('button', {
  shouldForwardProp: prop => prop !== 'active' && prop !== 'ellipsis',
})(({ active, ellipsis }) => ({
  width: SIZE,
  height: SIZE,
  flexShrink: 0,
  padding: 0,
  borderRadius: '360px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: font.family,
  fontSize: 16,
  lineHeight: '20px',
  fontWeight: 500,
  textTransform: 'capitalize',
  color: colors.ink,
  cursor: 'pointer',
  border: ellipsis ? '2px solid transparent' : `2px solid ${active ? colors.green : colors.border}`,
  backgroundColor: active ? colors.green : 'transparent',
  transition: 'background-color 0.15s ease, border-color 0.15s ease',
  '&:hover': { backgroundColor: active ? colors.greenHover : '#ECE3BE' },
}))

const Step = styled('button')({
  width: SIZE,
  height: SIZE,
  flexShrink: 0,
  padding: 0,
  border: 'none',
  borderRadius: '360px',
  backgroundColor: 'transparent',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:not(:disabled)': { cursor: 'pointer' },
})

// The tinted artwork points left; the forward pair is the same icon turned around.
const STEPS = {
  first: { icon: images.chevronCircleColorDouble, back: true },
  prev: { icon: images.chevronCircleColor, back: true },
  next: { icon: images.chevronCircleColor, back: false },
  last: { icon: images.chevronCircleColorDouble, back: false },
}

const GAP_BEFORE = 'gap-before'
const GAP_AFTER = 'gap-after'

// A window of five consecutive pages, pinned between the first and the last: 1 2 3 4 5 … 20 at the
// start, 1 … 6 7 8 9 10 … 20 in the middle, 1 … 16 17 18 19 20 at the end. A gap is tagged with the
// side of the current page it sits on, so its coin knows which way to jump.
const WINDOW = 5

const buildRange = (page, count) => {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)

  const start = Math.max(1, Math.min(page - Math.floor(WINDOW / 2), count - WINDOW + 1))
  const end = Math.min(count, start + WINDOW - 1)

  const range = []
  if (start > 1) {
    range.push(1)
    // Only when a page is actually hidden — a gap standing for page 2 alone would cost more than it
    // saves.
    if (start > 2) range.push(GAP_BEFORE)
  }
  for (let p = start; p <= end; p += 1) range.push(p)
  if (end < count) {
    if (end < count - 1) range.push(GAP_AFTER)
    range.push(count)
  }
  return range
}

// Halve what is left in that direction, so any page is a handful of clicks away rather than a walk.
const gapTarget = (gap, page, count) => {
  const half = gap === GAP_AFTER ? page + Math.ceil((count - page) / 2) : page - Math.ceil(page / 2)

  return Math.min(count, Math.max(1, half))
}

const AppPagination = ({ page, count, onChange }) => {
  if (!count || count <= 1) return null

  // One step of the row. A step that leads nowhere keeps the same icon but stops responding.
  const renderStep = (key, target, label) => {
    const { icon, back } = STEPS[key]

    return (
      <Step
        type="button"
        aria-label={label}
        disabled={target === page}
        onClick={() => onChange(target)}
      >
        <img
          src={icon}
          alt=""
          style={{
            width: SIZE,
            height: SIZE,
            display: 'block',
            transform: back ? 'none' : 'rotate(180deg)',
          }}
        />
      </Step>
    )
  }

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      role="navigation"
      aria-label="pagination"
    >
      {renderStep('first', 1, 'First page')}
      {renderStep('prev', Math.max(1, page - 1), 'Previous page')}
      {buildRange(page, count).map((item, index) =>
        item === GAP_BEFORE || item === GAP_AFTER ? (
          <Coin
            // eslint-disable-next-line react/no-array-index-key
            key={`${item}-${index}`}
            type="button"
            ellipsis
            aria-label={`Jump to page ${gapTarget(item, page, count)}`}
            onClick={() => onChange(gapTarget(item, page, count))}
          >
            <img
              src={images.threeDotsHorizontal}
              alt=""
              style={{ width: SIZE, height: SIZE, display: 'block' }}
            />
          </Coin>
        ) : (
          <Coin
            key={item}
            type="button"
            active={item === page}
            aria-current={item === page ? 'page' : undefined}
            onClick={() => onChange(item)}
          >
            {item}
          </Coin>
        ),
      )}
      {renderStep('next', Math.min(count, page + 1), 'Next page')}
      {renderStep('last', count, 'Last page')}
    </div>
  )
}

export default AppPagination
