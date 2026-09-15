// eslint-disable-next-line no-unused-vars
import React from 'react'
import { styled } from '@mui/material/styles'
import { colors, font } from 'Assets/mui_theme/designTokens'

// Label column + value column per row, hairline separators, stacks to one column on narrow screens.
const StyledList = styled('dl', { shouldForwardProp: prop => prop !== 'labelWidth' })(
  ({ labelWidth }) => ({
    margin: 0,
    fontFamily: font.family,
    color: colors.ink,
    '& .app-description-row': {
      display: 'grid',
      gridTemplateColumns: `${labelWidth}px minmax(0, 1fr)`,
      alignItems: 'start',
      columnGap: 16,
      rowGap: 2,
      padding: '9px 0',
      borderBottom: `1px solid ${colors.cardBorder}`,
      '@media (max-width: 480px)': { gridTemplateColumns: 'minmax(0, 1fr)' },
    },
    '& .app-description-row:last-of-type': { borderBottom: 0 },
    '& dt': {
      margin: 0,
      fontSize: font.label,
      fontWeight: 500,
      lineHeight: '20px',
      color: colors.muted,
    },
    '& dd': {
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 8,
      margin: 0,
      minWidth: 0,
      minHeight: 20,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: '20px',
      overflowWrap: 'anywhere',
    },
  }),
)

// Small uppercase heading above a group of rows.
const Caption = styled('div')({
  marginBottom: 2,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: colors.muted,
})

// A row is shown only when it has a value; `0` counts, `false`/null/''/[] do not.
const hasValue = value =>
  value != null && value !== false && value !== '' && !(Array.isArray(value) && !value.length)

// AppDescriptionList — design-system label/value rows (a <dl>) for metadata panels and dialogs.
// `items`: [{ id, label, value }]; `caption` heads the group; `labelWidth` sizes the label column.
const AppDescriptionList = ({ items = [], caption, labelWidth = 150, ...rest }) => {
  const rows = items.filter(item => hasValue(item.value))
  if (!rows.length) return null

  return (
    <div {...rest}>
      {caption && <Caption>{caption}</Caption>}
      <StyledList labelWidth={labelWidth}>
        {rows.map(({ id, label, value }) => (
          <div className="app-description-row" key={id}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </StyledList>
    </div>
  )
}

export default AppDescriptionList
