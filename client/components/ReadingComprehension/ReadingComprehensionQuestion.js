import React from 'react'
import { Segment } from 'semantic-ui-react'

const ReadingComprehensionQuestion = ({
  title,
  selected = false,
  onToggleSelect,
  children,
  actions,
  cefr,
}) => {
  return (
    <Segment
      className={`rc-question ${selected ? 'rc-question--selected' : ''}`}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onToggleSelect}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') onToggleSelect?.()
      }}
      style={{
        boxShadow: 'none',
        border: '1px solid rgba(0,0,0,0.12)',
      }}
    >
      <header className="rc-question__header">
        <div className="rc-question__title">
          <span className="header-3 rc-question__titleText">{title}</span>
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
    </Segment>
  )
}

export default ReadingComprehensionQuestion
