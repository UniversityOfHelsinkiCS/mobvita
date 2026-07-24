import React from 'react'
import { styled } from '@mui/material/styles'
import CloseIcon from '@mui/icons-material/Close'
import { colors, font } from 'Assets/mui_theme/designTokens'

/**
 * ChatBubble — a single chat message bubble, shared across the chatbots.
 *
 * variant:
 *   'bot'       - assistant reply (left, white)
 *   'user'      - the user's message (right, sage green)
 *   'note'      - feedback / system note (left, blue panel tint)
 *   'user-note' - the user's own note (right, warm cream tint)
 *   'hint'      - a hint bubble (left, warm yellow)
 *
 * Pass `onRemove` to show a small close button (top-right) for removable messages.
 */
const VARIANT_STYLES = {
  bot: { alignSelf: 'flex-start', backgroundColor: '#FFFFFF', color: colors.ink },
  user: { alignSelf: 'flex-end', backgroundColor: colors.green, color: colors.ink },
  note: { alignSelf: 'flex-start', backgroundColor: colors.panel, color: colors.ink },
  'user-note': { alignSelf: 'flex-end', backgroundColor: '#FFF6DA', color: colors.ink },
  hint: { alignSelf: 'flex-start', backgroundColor: '#FFEECE', color: colors.ink },
}

const Bubble = styled('div', {
  shouldForwardProp: prop => prop !== 'variant',
})(({ variant }) => ({
  position: 'relative',
  maxWidth: '85%',
  padding: '10px 14px',
  borderRadius: 18,
  fontFamily: font.family,
  fontSize: 15,
  lineHeight: 1.5,
  wordBreak: 'break-word',
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
  ...(VARIANT_STYLES[variant] || VARIANT_STYLES.bot),
  // markdown children shouldn't add outer margins inside the bubble
  '& p:first-of-type': { marginTop: 0 },
  '& p:last-of-type': { marginBottom: 0 },
}))

const RemoveButton = styled('button')({
  position: 'absolute',
  top: 4,
  right: 6,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: colors.muted,
  opacity: 0.6,
  transition: 'opacity 0.15s ease',
  '&:hover': { opacity: 1 },
  '& svg': { fontSize: 16 },
})

const ChatBubble = React.forwardRef(({ variant = 'bot', onRemove, children, ...rest }, ref) => (
  <Bubble ref={ref} variant={variant} {...rest}>
    {onRemove && (
      <RemoveButton type="button" aria-label="Remove message" onClick={onRemove}>
        <CloseIcon />
      </RemoveButton>
    )}
    {children}
  </Bubble>
))

ChatBubble.displayName = 'ChatBubble'

export default ChatBubble
