import React from 'react'
import { styled } from '@mui/material/styles'
import { colors } from 'Assets/mui_theme/designTokens'

/**
 * AppPagination — the 2026 numbered pagination: round page "coins". The active page is filled with
 * the sage-green; the others are outlined and fill tan on hover. For long ranges it windows around
 * the current page (1 … n-1 n n+1 … last).
 *
 * The ellipsis coins are clickable and halve the distance to the end they point at — click the
 * right one on page 1 of 100 and you land on 51, then 76, and so on; the left one halves toward 1.
 * Without it the window only ever offers page ±1, so reaching the middle of a long range means
 * clicking through every page in between.
 *
 * Controlled: `page` (1-indexed) + `count` (total pages) + `onChange(page)`.
 */
const Coin = styled('button', {
  shouldForwardProp: prop => prop !== 'active' && prop !== 'ellipsis',
})(({ active, ellipsis }) => ({
  width: 40,
  height: 40,
  flexShrink: 0,
  borderRadius: '50%',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 15,
  fontWeight: 600,
  color: colors.ink,
  cursor: 'pointer',
  border: ellipsis ? '1.5px solid transparent' : `1.5px solid ${active ? colors.green : colors.border}`,
  backgroundColor: active ? colors.green : 'transparent',
  transition: 'background-color 0.15s ease, border-color 0.15s ease',
  '&:hover': { backgroundColor: active ? colors.greenHover : '#ECE3BE' },
}))

const GAP_BEFORE = 'gap-before'
const GAP_AFTER = 'gap-after'

// 1 … (page-1) page (page+1) … count — collapse long ranges with ellipsis. A gap is tagged with the
// side of the current page it sits on, so its coin knows which way to jump.
const buildRange = (page, count) => {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)

  const wanted = [1, count, page, page - 1, page + 1].filter(p => p >= 1 && p <= count)
  const sorted = [...new Set(wanted)].sort((a, b) => a - b)

  const range = []
  let prev = 0
  sorted.forEach(p => {
    if (p - prev > 1) range.push(p <= page ? GAP_BEFORE : GAP_AFTER)
    range.push(p)
    prev = p
  })
  return range
}

// Halve what is left in that direction, so any page is a handful of clicks away rather than a walk.
const gapTarget = (gap, page, count) => {
  const half = gap === GAP_AFTER ? page + Math.ceil((count - page) / 2) : page - Math.ceil(page / 2)

  return Math.min(count, Math.max(1, half))
}

const AppPagination = ({ page, count, onChange }) => {
  if (!count || count <= 1) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} role="navigation" aria-label="pagination">
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
            …
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
        )
      )}
    </div>
  )
}

export default AppPagination
