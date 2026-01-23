import React from 'react'
import { Segment } from 'semantic-ui-react'

const ReadingComprehensionQuestion = ({ title, selected = false, onToggleSelect, children }) => {
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
      <header className="rc-question__header">
        <div className="rc-question__title">
          <span className="header-3 rc-question__titleText">{title}</span>
        </div>
      </header>

      <section className="rc-question__body">{children}</section>
    </Segment>
  )
}

export default ReadingComprehensionQuestion