import { colors, shadow, shape } from 'Assets/mui_theme/designTokens'

// The reading-practice question card: cream, 30px radius, Shadow Mid, 20px inside.
export const quizCardSx = {
  backgroundColor: colors.quizCard,
  color: colors.ink,
  borderRadius: `${shape.cardRadius}px`,
  boxShadow: shadow.mid,
  padding: '20px',
}

// The card's three blocks (question row, options, actions) stacked 30px apart.
export const quizStackSx = { display: 'flex', flexDirection: 'column', gap: '30px' }

// Question row: the text takes the width, the gear sits 20px to its right.
export const quizHeaderSx = { display: 'flex', alignItems: 'flex-start', gap: '20px' }

// Design "H4": 22px/22px medium; the counter shares the run.
export const quizQuestionSx = {
  flex: 1,
  minWidth: 0,
  fontSize: 22,
  lineHeight: '22px',
  fontWeight: 500,
}

// The option list: 8px between rows.
export const quizOptionsSx = { display: 'flex', flexDirection: 'column', gap: '8px' }

// Design "Quiz question" fills by state; default is a muted ring over the card's own colour.
const OPTION_STATES = {
  default: { backgroundColor: 'transparent', borderColor: colors.muted },
  correct: { backgroundColor: colors.quizCorrect, borderColor: colors.quizCorrectBorder },
  wrong: { backgroundColor: colors.quizWrong, borderColor: colors.quizWrongBorder },
  alert: { backgroundColor: colors.quizAlert, borderColor: colors.quizAlertBorder },
}

// One option as a plain <button>: a 2px-ringed 12px box that grows with its text, never clipping.
export const quizOptionSx = (state = 'default') => {
  const stateSx = OPTION_STATES[state] || OPTION_STATES.default
  // Only the unanswered row darkens its ring on hover; a coloured state keeps its own.
  const hoverRing = stateSx === OPTION_STATES.default ? colors.ink : stateSx.borderColor

  return {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    width: '100%',
    minHeight: 56,
    padding: '8px 10px 8px 12px',
    border: '2px solid',
    borderRadius: '12px',
    fontFamily: 'inherit',
    fontSize: 16,
    fontWeight: 500,
    lineHeight: '20px',
    textAlign: 'left',
    color: colors.ink,
    cursor: 'pointer',
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
    transition: 'background-color 0.15s ease, border-color 0.15s ease',
    ...stateSx,
    '&:hover:not(:disabled)': { borderColor: hoverRing },
    '&:focus-visible': { outline: `2px solid ${colors.ink}`, outlineOffset: 2 },
    '&:disabled': { cursor: 'default' },
  }
}

// Actions row: the pills share the width 12px apart; a lone one spans it, two wrap when cramped.
export const quizActionsSx = { display: 'flex', gap: '12px', flexWrap: 'wrap' }
export const quizActionButtonSx = { flex: '1 1 140px', minWidth: 0 }
