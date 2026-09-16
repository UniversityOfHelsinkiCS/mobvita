import { colors } from 'Assets/mui_theme/designTokens'

// Figma "Button M IconText": a 36px pill, 16px/500 ink label, in the given fill (green default).
export const pillButtonSx = (background = colors.green) => ({
  height: 36,
  padding: '8px 10px 8px 12px',
  gap: '10px',
  fontSize: 16,
  fontWeight: 500,
  color: colors.ink,
  backgroundColor: background,
  '&:hover': { backgroundColor: background, filter: 'brightness(0.96)' },
})

// Figma outline pill (Cancel / Back): the same metrics with a 2px green ring and no fill.
export const pillOutlineSx = () => ({
  height: 36,
  padding: '6px 10px 6px 12px',
  gap: '10px',
  fontSize: 16,
  fontWeight: 500,
  color: colors.ink,
  backgroundColor: 'transparent',
  border: `2px solid ${colors.green}`,
  '&:hover': { backgroundColor: '#E9F1EC', borderColor: colors.green },
})
