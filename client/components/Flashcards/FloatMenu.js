import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { images } from 'Utilities/common'
import SelectLanguage from './SelectLanguage'

const FloatMenu = () => {
  const [open, setOpen] = useState(false)

  const history = useHistory()

  const handleFabClick = () => {
    setOpen(!open)
  }

  const handleFillinClick = () => {
    history.push('/flashcards/all')
    setOpen(false)
  }

  const handleCreateNewClick = () => {
    history.push('/flashcards/new')
    setOpen(false)
  }

  return (
    <div className="flashcard-fab-menu">
      <button type="button" onClick={handleFabClick} className="flashcard-fab">
        <Icon name="th list" style={{ color: 'white' }} />
      </button>
      {open
        && (
          <div
            className="flex-column-reverse padding-bottom-1 gap-row-1"
            style={{ paddingLeft: '0.3em' }}
          >
            <button
              type="button"
              onClick={handleFillinClick}
              className="flashcard-fab-option gap-2">
              <div className="flashcard-fab-icon">
                <img
                  src={images.flashcardIcon}
                  alt="three cards"
                  width="16px"
                  style={{ margin: 'auto' }}
                />
              </div>
              <span className="flashcard-fab-text">
                <FormattedMessage id="all-flashcards" />
              </span>
            </button>
            <button
              type="button"
              onClick={handleCreateNewClick}
              className="flashcard-fab-option gap-2"
            >
              <div
                className="flashcard-fab-icon"
                style={{ paddingBottom: '0.5em', paddingLeft: '0.1em' }}
              >
                <Icon name="edit" style={{ margin: 'auto' }} />
              </div>
              <span className="flashcard-fab-text">
                <FormattedMessage id="add-new-flashcard" />
              </span>
            </button>
            <button
              type="button"
              className="flashcard-fab-option gap-2"
            >
              <div
                className="flashcard-fab-icon"
                style={{ paddingBottom: '0.5em', paddingRight: '0.1em' }}
              >
                <Icon name="language" style={{ margin: 'auto', padding: 0 }} />
              </div>
              <span className="flashcard-fab-text gap-1">
                <FormattedMessage id="translation-target-language" />
                <SelectLanguage />
              </span>
            </button>
          </div>
        )}
    </div>
  )
}

export default FloatMenu
