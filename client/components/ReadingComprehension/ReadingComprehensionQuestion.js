import React from 'react'
import { Segment } from 'semantic-ui-react'

const ReadingComprehensionQuestion = ({
  title,
  selected = false,
  onToggleSelect,
  children,
  actions,
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
    >
      <header className="rc-question__header" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="rc-question__title" style={{ flex: 1, minWidth: 0 }}>
          <span className="header-3 rc-question__titleText">{title}</span>
        </div>

        {actions ? (
          <div
            className="rc-question__actions"
            onClick={e => e.stopPropagation()}
            onMouseDown={e => e.stopPropagation()}
            onKeyDown={e => e.stopPropagation()}
            style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}
          >
            {actions}
          </div>
        ) : null}
      </header>

      <section className="rc-question__body">{children}</section>
    </Segment>
  )
}

export default ReadingComprehensionQuestion