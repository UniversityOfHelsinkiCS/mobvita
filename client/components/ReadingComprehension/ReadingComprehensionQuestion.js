import React, { useState } from 'react'
import { Icon, Segment } from 'semantic-ui-react'
import { FormattedMessage } from 'react-intl'
import './ReadingComprehension.css'

const ReadingComprehensionQuestion = ({
  questionNumber,
  headerTranslationId = 'reading-comprehension-question',
  defaultOpen = false,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Segment className="rc-question">
      <header className="rc-question__header">
        <div className="rc-question__title">
          <span className="header-3 rc-question__titleText">
            <FormattedMessage id={headerTranslationId} />{' '}
            {typeof questionNumber === 'number' ? `#${questionNumber + 1}` : null}
          </span>
        </div>

        <button
          type="button"
          className="rc-question__toggle"
          onClick={() => setIsOpen(prev => !prev)}
          aria-expanded={isOpen}
        >
          <Icon name={isOpen ? 'angle up' : 'angle down'} size="large" />
        </button>
      </header>

      {isOpen && <section className="rc-question__body">{children}</section>}
    </Segment>
  )
}

export default ReadingComprehensionQuestion