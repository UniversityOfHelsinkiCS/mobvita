// eslint-disable-next-line no-unused-vars
import React from 'react'
import { Box } from '@mui/material'
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl'
import AppDialog from 'Components/ui/AppDialog'
import AppDescriptionList from 'Components/ui/AppDescriptionList'
import AppIcon from 'Components/ui/AppIcon'
import AppProgressBar from 'Components/ui/AppProgressBar'
import { cefrNum2Cefr, images } from 'Utilities/common'
import { colors } from 'Assets/mui_theme/designTokens'

// Category names are i18n ids only sometimes; otherwise show the raw text.
const translateIfKnown = (intl, value) =>
  value && intl.messages[value] ? intl.formatMessage({ id: value }) : value

// Hostname for display; the raw string when it is not a parseable URL.
const sourceHost = url => {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

// The date arrives as an RFC 1123 string; an unparseable one hides the row instead of throwing.
const formattedDate = date => {
  const parsed = new Date(date)
  if (!date || Number.isNaN(parsed.getTime())) return null
  return <FormattedDate value={parsed} year="numeric" month="long" day="numeric" />
}

// Integer 0–100 from the backend's percentage, or null when it is missing.
const toPercent = value => (Number.isFinite(Number(value)) ? Math.round(Number(value)) : null)

// Source link: hostname plus an external-link glyph; the full URL sits in the title attribute.
const SourceLink = ({ url }) => (
  <a
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    title={url}
    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: colors.ink }}
  >
    {sourceHost(url)}
    <AppIcon src={images.external} size={14} color="currentColor" />
  </a>
)

// A percentage as a short bar with the number beside it.
const PercentBar = ({ value }) => (
  <>
    <AppProgressBar
      value={value}
      height="10px"
      fillColor={colors.green}
      trackColor={colors.progressEmpty}
      style={{ flex: '1 1 120px', maxWidth: 220 }}
    />
    <span>{value}%</span>
  </>
)

// StoryInfoDialog — the story card's "i" dialog: title, description, then the core metadata rows.
// Pure/controlled; rows without data are dropped by AppDescriptionList.
const StoryInfoDialog = ({ story, open, onClose, ...rest }) => {
  const intl = useIntl()
  if (!story) return null

  const label = id => <FormattedMessage id={id} />
  const cefr = cefrNum2Cefr(story.difficulty_value)
  const covered = toPercent(story.percent_cov)
  const correct = toPercent(story.percent_perf)

  // Row order is fixed by the spec; optional rows drop out when the story lacks the value.
  const rows = [
    { id: 'author', label: label('Author'), value: story.author },
    { id: 'source', label: label('Source'), value: story.URL && <SourceLink url={story.URL} /> },
    { id: 'date', label: label('date-added'), value: formattedDate(story.date) },
    { id: 'category', label: label('Category'), value: translateIfKnown(intl, story.category) },
    {
      id: 'difficulty',
      label: label('cefr_grade'),
      value: cefr && <span style={{ fontWeight: 600 }}>{cefr}</span>,
    },
    {
      id: 'covered',
      label: label('story-info-covered'),
      value: covered != null && <PercentBar value={covered} />,
    },
    {
      id: 'correct',
      label: label('correct-answers'),
      value: correct != null && <PercentBar value={correct} />,
    },
  ]

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      title={story.title}
      maxWidth="sm"
      closeDataCy="story-info-dialog-close"
      data-cy="story-info-dialog"
      {...rest}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {story.description && (
          <Box sx={{ fontSize: 14, lineHeight: 1.5, color: colors.ink, whiteSpace: 'pre-line' }}>
            {story.description}
          </Box>
        )}
        <AppDescriptionList items={rows} />
      </Box>
    </AppDialog>
  )
}

export default StoryInfoDialog
