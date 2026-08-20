import React from 'react'
import { styled } from '@mui/material/styles'
import { colors } from 'Assets/mui_theme/designTokens'

/**
 * AppPagination — the 2026 numbered pagination: round page "coins". The active page is filled with
 * the sage-green; the others are outlined and fill tan on hover. For long ranges it windows around
 * the current page (1 … n-1 n n+1 … last) with non-interactive ellipsis coins.
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
  cursor: ellipsis ? 'default' : 'pointer',
  border: ellipsis ? '1.5px solid transparent' : `1.5px solid ${active ? colors.green : colors.border}`,
  backgroundColor: active ? colors.green : 'transparent',
  transition: 'background-color 0.15s ease, border-color 0.15s ease',
  '&:hover': ellipsis ? {} : { backgroundColor: active ? colors.greenHover : '#ECE3BE' },
}))

// 1 … (page-1) page (page+1) … count — collapse long ranges with ellipsis.
const buildRange = (page, count) => {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1)

  const wanted = [1, count, page, page - 1, page + 1].filter(p => p >= 1 && p <= count)
  const sorted = [...new Set(wanted)].sort((a, b) => a - b)

  const range = []
  let prev = 0
  sorted.forEach(p => {
    if (p - prev > 1) range.push('ellipsis')
    range.push(p)
    prev = p
  })
  return range
}

const AppPagination = ({ page, count, onChange }) => {
  if (!count || count <= 1) return null

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} role="navigation" aria-label="pagination">
      {buildRange(page, count).map((item, index) =>
        item === 'ellipsis' ? (
          // eslint-disable-next-line react/no-array-index-key
          <Coin key={`ellipsis-${index}`} type="button" ellipsis disabled>
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
