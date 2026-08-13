import React from 'react'
import StarBorderIcon from '@mui/icons-material/StarBorder'

// semantic-ui sizes → MUI SvgIcon `fontSize`; the oversized ones are done with `sx` instead.
// With no size semantic's `i.icon` inherited the surrounding font size, so map that to `inherit`
// rather than MUI's "medium" (a fixed 24px, which would render the stars ~50% larger than before).
const muiFontSize = size => {
  if (!size) return 'inherit'
  if (size === 'mini' || size === 'tiny' || size === 'small') return 'small'
  if (size === 'large') return 'large'
  return 'medium'
}

const oversizedSx = size =>
  size === 'big' || size === 'huge' || size === 'massive' ? { fontSize: 40 } : {}

// semantic's `i.icon` also carried `margin: 0 .25rem 0 0`; keep it so the stars don't run together.
const Star = ({ size, color }) => (
  <StarBorderIcon
    fontSize={muiFontSize(size)}
    sx={{ color, mr: '0.25rem', ...oversizedSx(size) }}
  />
)

export default ({ difficulty, size, ...props }) => {
  switch (difficulty) {
    case 3:
    case 'high':
      return (
        <div data-cy="difficulty-stars" {...props}>
          <Star size={size} color="red" />
          <Star size={size} color="red" />
          <Star size={size} color="red" />
        </div>
      )
    case 2:
    case 'average':
      return (
        <div data-cy="difficulty-stars" {...props}>
          <Star size={size} color="steelblue" />
          <Star size={size} color="steelblue" />
        </div>
      )
    case 1:
    case 'low':
      return (
        <div data-cy="difficulty-stars" {...props}>
          <Star size={size} color="forestgreen" />
        </div>
      )
    default:
      return (
        <div data-cy="difficulty-stars" {...props}>
          <Star size={size} color="#999" />
        </div>
      )
  }
}
