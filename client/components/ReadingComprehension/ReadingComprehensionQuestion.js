import React from 'react'
import { Paper } from '@mui/material'

const ReadingComprehensionQuestion = ({
  title,
  selected = false,
  onToggleSelect,
  children,
  actions,
  cefr,
  dataCy,
  titleDataCy,
}) => {
  return (
    <Paper
      className={`rc-question ${selected ? 'rc-question--selected' : ''}`}
      data-cy={dataCy}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onToggleSelect}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') onToggleSelect?.()
      }}
      sx={{
        padding: '1em',
        margin: '1rem 0',
        '&:first-of-type': { marginTop: 0 },
        '&:last-of-type': { marginBottom: 0 },
      }}
      style={{
        boxShadow: selected ? '0 0 0 1px rgba(33, 186, 69, 0.15)' : 'none',
        border: selected ? '1px solid #21ba45' : '1px solid rgba(0,0,0,0.12)',
        backgroundColor: selected ? 'rgba(33, 186, 69, 0.08)' : undefined,
      }}
    >
      <header className="rc-question__header">
        <div className="rc-question__title">
          <span className="header-3 rc-question__titleText" data-cy={titleDataCy}>
            {title}
          </span>
        </div>

        <div
          className="rc-question__right"
          onClick={e => e.stopPropagation()}
          onMouseDown={e => e.stopPropagation()}
          onKeyDown={e => e.stopPropagation()}
        >
          {cefr ? <span className="rc-question__cefr">{cefr}</span> : null}

          {actions ? <div className="rc-question__actions">{actions}</div> : null}
        </div>
      </header>

      <section className="rc-question__body">{children}</section>
    </Paper>
  )
}

export default ReadingComprehensionQuestion
