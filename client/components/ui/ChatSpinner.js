// eslint-disable-next-line no-unused-vars
import React from 'react'
import Spinner from 'Components/Spinner'

/**
 * ChatSpinner — the assistant's "waiting" spinner: one size, one alignment, for every chatbot
 * panel. Before this each panel picked its own, so they drifted apart in both.
 *
 * 48px is the design system's second AppSpinner size (the gallery shows 24 / 48 / 72), and the
 * ring is centred in whatever row it sits in.
 *
 *   padding – override the surrounding space when the spinner sits inside a tighter container.
 */
export const CHAT_SPINNER_SIZE = 48

const ChatSpinner = ({ padding = '16px 0 8px' }) => (
  <div style={{ display: 'flex', justifyContent: 'center', padding }}>
    <Spinner inline size={CHAT_SPINNER_SIZE} />
  </div>
)

export default ChatSpinner
