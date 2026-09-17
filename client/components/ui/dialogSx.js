import { colors, font, shadow } from 'Assets/mui_theme/designTokens'

// Card padding per the 2026 design ("40px 60px" from sm up); the phone-width values are derived.
const PAD_X = { xs: 3, sm: 7.5 }
const PAD_Y = { xs: 4, sm: 5 }

// The 2026 dialog chrome as AppDialog overrides: a `width`px card, Shadow Mid, H2 title, 16px
// lead gap, 30px to the content, and the X 20px from the corner. Spread onto <AppDialog>.
export const dialogSx = (width = 568) => ({
  paperSx: { width, boxShadow: shadow.mid },
  titleSx: {
    pl: PAD_X,
    pr: { xs: 7, sm: 7.5 },
    pt: PAD_Y,
    pb: 3.75,
    fontSize: font.h2,
    fontWeight: 400,
    lineHeight: 1,
    letterSpacing: 0,
  },
  subtitleSx: { mt: 2 },
  contentSx: { px: PAD_X, pb: PAD_Y },
  closeSx: { right: 12, top: 12, color: colors.ink },
})

// Design "Button M IconText": a 36px pill, 16px/500 ink label, in the given fill (green default).
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

// Outline pill (Cancel / Back): the same metrics with a 2px green ring and no fill.
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

// Field label: muted, inset 10px from the pill's edge, and 2px above the pill.
export const fieldLabelSx = { color: colors.muted, pl: '10px', mb: '2px' }

// Dialog actions row: two pills sharing the width with a 20px gap.
export const dialogActionsSx = { display: 'flex', gap: '20px', '& > *': { flex: 1 } }
