import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { useIntl, FormattedMessage } from 'react-intl'
import AppMenu from 'Components/ui/AppMenu'
import { MenuRow } from 'Components/ui/menuRow'
import { colors, font } from 'Assets/mui_theme/designTokens'

/**
 * TopicsSelect — the header "All Topics In Text" control on the story preview (2026 design).
 *
 * A NEW, self-contained element that mirrors the behaviour of the assistant's `StoryView/StoryTopics`
 * block (which is left untouched): it reads the same `conceptCount` data, offers the same CEFR / name /
 * frequency sorting, and clicking a topic drives the shared `focusedConcept` highlight in the text.
 * It is NOT a value-select — the trigger label always stays "All Topics In Text"; the picked topic is
 * shown as the highlighted row, and the menu stays open so you can browse/sort/toggle live.
 */
const Trigger = styled('button')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  padding: '7px 16px',
  minWidth: 170,
  borderRadius: 999,
  fontFamily: font.family,
  fontWeight: 600,
  fontSize: 15,
  cursor: 'pointer',
  // Outline pill — the look the Start button used to have (Start is now solid green).
  backgroundColor: 'transparent',
  color: colors.ink,
  border: `1px solid ${colors.ink}`,
  transition: 'background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease',
  '&:hover': { backgroundColor: colors.green, borderColor: colors.green, color: colors.ink },
  '& .topics-chevron': { fontSize: 20, flexShrink: 0 },
})

const SortChip = styled('button', { shouldForwardProp: prop => prop !== 'active' })(({ active }) => ({
  border: 'none',
  cursor: 'pointer',
  padding: '3px 10px',
  borderRadius: 999,
  fontFamily: font.family,
  fontSize: 12,
  fontWeight: 600,
  color: colors.ink,
  backgroundColor: active ? colors.green : 'transparent',
  transition: 'background-color 0.15s ease',
  '&:hover': { backgroundColor: active ? colors.green : '#ECE3BE' },
}))

const stripName = name => name.split('—')[0].trim()

const SORTERS = {
  cefr: (a, b) => (b[1].level === a[1].level ? b[1].freq - a[1].freq : b[1].level - a[1].level),
  freq: (a, b) => (b[1].freq === a[1].freq ? b[1].level - a[1].level : b[1].freq - a[1].freq),
  name: (a, b) => (b[0] === a[0] ? b[1].level - a[1].level : b[0] < a[0] ? -1 : 1),
}

const TopicsSelect = ({ conceptCount = {}, focusedConcept, setFocusedConcept }) => {
  const intl = useIntl()
  const [sortBy, setSortBy] = useState('cefr')

  const entries = Object.entries(conceptCount)
  if (entries.length === 0) return null

  const topics = [...entries].sort(SORTERS[sortBy] || SORTERS.cefr)

  const sortOptions = [
    { key: 'cefr', label: intl.formatMessage({ id: 'sort-by-concept-cefr-short' }) },
    { key: 'name', label: intl.formatMessage({ id: 'sort-by-concept-name-short' }) },
    { key: 'freq', label: intl.formatMessage({ id: 'sort-by-concept-freq-short' }) },
  ]

  const trigger = (
    <Trigger type="button">
      <span style={{ whiteSpace: 'nowrap' }}>
        <FormattedMessage id="all-topics-in-text" />
      </span>
      <KeyboardArrowDownIcon className="topics-chevron" />
    </Trigger>
  )

  return (
    <AppMenu
      trigger={trigger}
      minWidth={250}
      // Close only via this arrow or an outside click — never on a topic (list-item) selection.
      closeIcon={<KeyboardArrowUpIcon sx={{ color: colors.ink }} />}
    >
      {/* Sort control (CEFR / name / frequency) — does not close the menu. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          padding: '2px 8px 8px',
        }}
      >
        <span style={{ fontFamily: font.family, fontSize: 12, color: colors.muted }}>
          <FormattedMessage id="LABEL-sort-by" />
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {sortOptions.map(option => (
            <SortChip
              key={option.key}
              type="button"
              active={sortBy === option.key}
              onClick={() => setSortBy(option.key)}
            >
              {option.label}
            </SortChip>
          ))}
        </div>
      </div>

      <div
        style={{
          borderTop: `1px solid ${colors.border}`,
          maxHeight: 240,
          overflowY: 'auto',
          paddingTop: 4,
        }}
      >
        {topics.map(([name, info]) => (
          <MenuRow
            key={name}
            selected={focusedConcept === name}
            onClick={() => setFocusedConcept(focusedConcept === name ? null : name)}
          >
            <span style={{ display: 'flex', justifyContent: 'space-between', gap: 16, minWidth: 200 }}>
              <span dangerouslySetInnerHTML={{ __html: stripName(name) }} />
              <span style={{ color: colors.muted }}>{info.freq}</span>
            </span>
          </MenuRow>
        ))}
      </div>
    </AppMenu>
  )
}

export default TopicsSelect
