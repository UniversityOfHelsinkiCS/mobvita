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

// Dialog actions row: two pills sharing the width with a 20px gap.
export const dialogActionsSx = { display: 'flex', gap: '20px', '& > *': { flex: 1 } }
