import React, { useEffect, useRef, useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { styled } from '@mui/material/styles'
import { useIntl } from 'react-intl'
import { colors, font } from 'Assets/mui_theme/designTokens'
import { images } from 'Utilities/common'
import AppMenu, { AppMenuItem } from './AppMenu'

/**
 * ChatBubble — a single chat message bubble, shared across the chatbots.
 *
 * variant:
 *   'bot'       - assistant reply (left, white)
 *   'user'      - the user's message (right, sage green)
 *   'note'      - feedback / system note (left, blue panel tint)
 *   'user-note' - the user's own note (right, warm cream tint)
 *   'hint'      - a hint bubble (left, warm yellow)
 *   'options'   - see-through, full-width bubble that holds action content (e.g. the add-story options):
 *                 left-aligned like a bot reply but no background, shadow, or padding
 *
 * Correction variants carry an essay correction type's colour, so a bubble about a correction reads
 * as the same thing as the correction. A multi-token correction uses 'correction-replacement'.
 *   'correction-replacement' - a word swapped for another (also multi-token corrections)
 *   'correction-insertion'   - a missing word to add
 *   'correction-deletion'    - a word to remove
 *
 * Pass `onEdit` and/or `onRemove` to show Design System edit/delete actions in the top-right.
 */
// The conversation column deliberately has no left/right padding, so lemma cards can span the full
// panel width (see .chatbot-messages). Bubbles therefore carry their own gutter, or a bot reply
// would sit flush against the left edge and the user's own message flush against the right. It
// matches the bubble's horizontal padding, so the inset reads as one consistent rhythm.
const BUBBLE_GUTTER = 14

export const CORRECTION_COLORS = {
  replacement: '#C1DCE6',
  insertion: '#D1E5B0',
  deletion: '#FFDCCA',
}

const VARIANT_STYLES = {
  bot: { alignSelf: 'flex-start', backgroundColor: colors.card, color: colors.ink },
  user: { alignSelf: 'flex-end', backgroundColor: '#E8E5DC', color: colors.ink, borderRadius: 18, borderTopRightRadius: 2, paddingRight: 16 },
  note: { alignSelf: 'flex-start', backgroundColor: colors.panel, color: colors.ink, borderRadius: 18, borderTopLeftRadius: 2, paddingRight: 16 },
  'user-note': { alignSelf: 'flex-end', backgroundColor: '#FFF6DA', color: colors.ink },
  'controlled-note': {
    alignSelf: 'flex-end',
    backgroundColor: '#ECE3BE',
    color: colors.ink,
    borderRadius: 18,
    borderTopRightRadius: 2,
    paddingLeft: 42,
    paddingRight: 16,
  },
  hint: { alignSelf: 'flex-start', backgroundColor: '#ECE3BE', color: colors.ink, borderRadius: 18, borderTopLeftRadius: 2, paddingRight: 16 },
  'correction-replacement': {
    alignSelf: 'flex-start',
    backgroundColor: CORRECTION_COLORS.replacement,
    color: colors.ink,
  },
  'correction-insertion': {
    alignSelf: 'flex-start',
    backgroundColor: CORRECTION_COLORS.insertion,
    color: colors.ink,
  },
  'correction-deletion': {
    alignSelf: 'flex-start',
    backgroundColor: CORRECTION_COLORS.deletion,
    color: colors.ink,
  },
  options: {
    alignSelf: 'flex-start',
    backgroundColor: 'transparent',
    color: colors.ink,
    boxShadow: 'none',
    maxWidth: '100%',
    width: '100%',
    padding: 0,
    // Full-bleed by design — it holds action content, not a message, so it keeps no gutter.
    marginLeft: 0,
    marginRight: 0,
  },
}

const Bubble = styled('div', {
  shouldForwardProp: prop => prop !== 'variant' && prop !== 'hasActions',
})(({ variant, hasActions }) => ({
  position: 'relative',
  maxWidth: '85%',
  marginLeft: BUBBLE_GUTTER,
  marginRight: BUBBLE_GUTTER,
  padding: '10px 14px',
  ...(hasActions && { paddingRight: '58px' }),
  borderRadius: 18,
  // A bubble holds what the user is reading or wrote themselves — language content, not chrome —
  // so it names the content token rather than inheriting the UI font from <body>.
  fontFamily: font.ui,
  fontSize: 15,
  lineHeight: 1.2,
  '& p': {
    margin: '4px 0',
  },

  '& blockquote': {
    margin: '6px 0',
    paddingLeft: 10,
  },

  '& h3': {
    margin: '8px 0 4px',
  },

  '& ul': {
    margin: '4px 0',
    paddingLeft: 28,
  },

  '& li': {
    margin: '2px 0',
  },
  wordBreak: 'break-word',
  //boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
  ...(VARIANT_STYLES[variant] || VARIANT_STYLES.bot),
  // markdown children shouldn't add outer margins inside the bubble
  '& p:first-of-type': { marginTop: 0 },
  '& p:last-of-type': { marginBottom: 0 },
  '& a': {
    color: '#2A68DD',
  },
}))

const BubbleContent = styled('div', {
  shouldForwardProp: prop => prop !== 'collapsed',
})(({ collapsed }) => ({
  position: 'relative',

  ...(collapsed && {
    maxHeight: '6em', // 4 lines × 1.5 line-height
    overflow: 'hidden',
  }),
}))

const BubbleFade = styled('div')({
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  height: '2.5em',
  pointerEvents: 'none',
  background: 'linear-gradient(to bottom, transparent, #E8E5DC)',
})

const BubbleActions = styled('div')({
  position: 'absolute',
  top: 4,
  right: 6,
  display: 'inline-flex',
  gap: 4,
})

const BubbleMenu = styled('div')({
  position: 'absolute',
  top: 4,
  right: 6,
})

const BubbleLeftIcon = styled('div')({
  position: 'absolute',
  left: 16,
  top: 16,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 18,
  height: 18,
  '& img': { display: 'block', width: 18, height: 18 },
})

const ActionButton = styled('button')({
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
  '& img': { display: 'block', width: 16, height: 16 },
})

const BubbleMenuTrigger = styled('button')({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 0,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  color: colors.muted,
  opacity: 0.7,
  transition: 'opacity 0.15s ease',
  '&:hover': { opacity: 1 },
})

const ChatBubble = React.forwardRef(
  (
    {
      variant = 'bot',
      onEdit,
      onRemove,
      editDataCy,
      removeDataCy,
      children,
      ...rest
    },
    ref,
  ) => {
    const contentRef = useRef(null)
    const intl = useIntl()
    const [expanded, setExpanded] = useState(false)
    const [isLong, setIsLong] = useState(false)

    useEffect(() => {
      if (variant !== 'user') return

      const element = contentRef.current

      if (!element) return

      const lineHeight = parseFloat(getComputedStyle(element).lineHeight)
      const maxHeight = lineHeight * 4

      setIsLong(element.scrollHeight > maxHeight + 1)
    }, [children, variant])

    const collapsed = variant === 'user' && isLong && !expanded

    return (
      <Bubble
        ref={ref}
        variant={variant}
        hasActions={Boolean(onEdit || onRemove)}
        {...rest}
      >
        {variant === 'controlled-note' && (
          <BubbleLeftIcon aria-hidden="true">
            <img src={images.paste} alt="" />
          </BubbleLeftIcon>
        )}

        {variant === 'controlled-note' && (onEdit || onRemove) && (
          <BubbleMenu>
            <AppMenu
              trigger={
                <BubbleMenuTrigger type="button" aria-label="More actions">
                  <MoreVertIcon fontSize="small" />
                </BubbleMenuTrigger>
              }
              minWidth={180}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              disableScrollLock
            >
              {onEdit && (
                <AppMenuItem
                  icon={<img src={images.edit03} alt="" style={{ width: 24, height: 24 }} />}
                  onClick={onEdit}
                  data-cy={editDataCy}
                >
                  {intl.formatMessage({ id: 'edit', defaultMessage: 'Edit' })}
                </AppMenuItem>
              )}

              {onRemove && (
                <AppMenuItem
                  icon={<img src={images.trash03} alt="" style={{ width: 24, height: 24 }} />}
                  onClick={onRemove}
                  data-cy={removeDataCy}
                >
                  {intl.formatMessage({ id: 'Delete', defaultMessage: 'Delete' })}
                </AppMenuItem>
              )}
            </AppMenu>
          </BubbleMenu>
        )}

        {variant !== 'controlled-note' && (onEdit || onRemove) && (
          <BubbleActions>
            {onEdit && (
              <ActionButton
                type="button"
                aria-label="Edit message"
                onClick={onEdit}
                data-cy={editDataCy}
              >
                <img src={images.edit03} alt="" />
              </ActionButton>
            )}

            {onRemove && (
              <ActionButton
                type="button"
                aria-label="Remove message"
                onClick={onRemove}
                data-cy={removeDataCy}
              >
                <img src={images.xClose} alt="" />
              </ActionButton>
            )}
          </BubbleActions>
        )}

        <BubbleContent
          ref={contentRef}
          collapsed={collapsed}
          onClick={
            variant === 'user' && isLong
              ? () => setExpanded(value => !value)
              : undefined
          }
          style={{
            cursor: variant === 'user' && isLong ? 'pointer' : 'default',
          }}
        >
          {children}

          {collapsed && <BubbleFade />}
        </BubbleContent>
      </Bubble>
    )
  },
)

ChatBubble.displayName = 'ChatBubble'

export default ChatBubble
