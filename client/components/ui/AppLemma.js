// eslint-disable-next-line no-unused-vars
import React from 'react'
import { FormattedMessage } from 'react-intl'
import CustomTooltip from 'Components/CustomTooltip'
import { images } from 'Utilities/common'
import { colors, font } from 'Assets/mui_theme/designTokens'

const DEFAULT_BG = '#C9E7C0'
const DICTIONARY_PILL_BG = '#C1DCE6'
const WORDNEST_PILL_BG = '#CACAE0'

// `tooltip` is an i18n key id rendered (with HTML support) through CustomTooltip.
const withTooltip = (node, tooltip) =>
  tooltip ? (
    <CustomTooltip keyId={tooltip} placement="top">
      <span style={{ display: 'inline-flex', flexShrink: 0 }}>{node}</span>
    </CustomTooltip>
  ) : (
    node
  )

const IconButton = ({ src, label, onClick, tooltip }) =>
  withTooltip(
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'inline-flex',
        flexShrink: 0,
      }}
    >
      <img src={src} alt="" style={{ width: 24, height: 24, display: 'block' }} />
    </button>,
    tooltip,
  )

const Pill = ({ icon, children, onClick, href, bg, tooltip }) => {
  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '5px 11px',
    borderRadius: 999,
    border: 'none',
    cursor: 'pointer',
    flexShrink: 0,
    width: 'auto',
    backgroundColor: bg,
    color: colors.ink,
    // Names the UI token back: pill labels are chrome, but would inherit the card's content font.
    fontFamily: font.family,
    fontWeight: 600,
    fontSize: 12,
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  }
  const inner = (
    <>
      <img src={icon} alt="" style={{ width: 15, height: 15, display: 'block' }} />
      <span>{children}</span>
    </>
  )
  const pill = href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
      {inner}
    </a>
  ) : (
    <button type="button" style={style} onClick={onClick}>
      {inner}
    </button>
  )
  return withTooltip(pill, tooltip)
}

// Presentational lemma card: speaker + headword, action pills and translations. Props-only, so it
// renders standalone on /design; the consumer wires up every handler.
const AppLemma = ({
  lemma,
  lemmaHref,
  translations = [],
  speaker,
  onSpeak,
  onKnow,
  onDontKnow,
  onDictionary,
  dictionaryHref,
  onWordNest,
  background = DEFAULT_BG,
  style,
  className = '',
}) => {
  const uniqueTranslations = [...new Set(translations || [])]
  const hasPills = onDictionary || dictionaryHref || onWordNest

  return (
    <div
      className={`app-lemma ${className}`.trim()}
      style={{
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: background,
        borderRadius: 16,
        padding: '14px 18px',
        // `languageContent`, not `content`: no call site wraps this card in a getTextStyle()
        // container, so the headword needs a face that follows the learner's script on its own.
        fontFamily: font.languageContent,
        color: colors.ink,
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        {speaker ||
          (onSpeak && <IconButton src={images.speaker} label="listen" onClick={onSpeak} />)}
        {lemmaHref ? (
          <CustomTooltip keyId="explain-lemma-goto-dictionary" placement="top">
            <a
              href={lemmaHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                minWidth: 0,
                overflowWrap: 'anywhere',
                wordBreak: 'break-word',
                fontSize: '1.2rem',
                fontWeight: 600,
                color: colors.ink,
                textDecoration: 'none',
              }}
            >
              {lemma}
            </a>
          </CustomTooltip>
        ) : (
          <span
            style={{
              flex: 1,
              minWidth: 0,
              overflowWrap: 'anywhere',
              wordBreak: 'break-word',
              fontSize: '1.2rem',
              fontWeight: 600,
            }}
          >
            {lemma}
          </span>
        )}
        {onKnow && (
          <IconButton
            src={images.checkCircle}
            label="I know this word"
            onClick={onKnow}
            tooltip="explain-i-know-word"
          />
        )}
        {onDontKnow && (
          <IconButton
            src={images.question}
            label="I don't know this word"
            onClick={onDontKnow}
            tooltip="explain-i-dont-know-word"
          />
        )}
      </div>

      {hasPills && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
          {(onDictionary || dictionaryHref) && (
            <Pill
              icon={images.bookmark}
              onClick={onDictionary}
              href={dictionaryHref}
              bg={DICTIONARY_PILL_BG}
              tooltip="explain-goto-inflection-table"
            >
              <FormattedMessage id="Dictionary" defaultMessage="Dictionary" />
            </Pill>
          )}
          {onWordNest && (
            <Pill
              icon={images.wordnest}
              onClick={onWordNest}
              bg={WORDNEST_PILL_BG}
              tooltip="display-word-nest"
            >
              <FormattedMessage id="display-word-nest" defaultMessage="Word Nest" />
            </Pill>
          )}
        </div>
      )}

      {/* `translation-glosses` is kept for the dictionary cypress selectors; the inline styles
          deliberately override that legacy class. */}
      {uniqueTranslations.length > 0 && (
        <ul
          className="translation-glosses"
          style={{
            margin: '10px 0 0',
            paddingLeft: '1.2em',
            lineHeight: 1.6,
            listStyle: 'disc',
            color: colors.ink,
            fontStyle: 'normal',
            fontFamily: font.content,
          }}
        >
          {uniqueTranslations.map((t, i) => (
            <li key={`${t}-${i}`} style={{ color: colors.ink, fontStyle: 'normal' }}>
              {t}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AppLemma
