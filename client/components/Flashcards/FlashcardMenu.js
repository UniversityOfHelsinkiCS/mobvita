import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { images } from 'Utilities/common'
import SelectLanguage from './SelectLanguage'

const FlashcardMenu = () => {
  const history = useHistory()

  const handleAllFlashcardsClick = () => {
    history.push('/flashcards/all')
  }

  const handleCreateFlashcardClick = () => {
    history.push('/flashcards/new')
  }

  return (
    <div className="flashcard-menu">
      <div className="flashcard-lang-select">
        <span className="padding-right-1">
          <FormattedMessage id="translation-target-language" />
        </span>
        <SelectLanguage />
      </div>
      <button
        type="button"
        className="flashcard-menu-item flashcard-fillin"
        onClick={handleAllFlashcardsClick}
      >
        <img src={images.flashcardIcon} alt="three cards" width="60px" />
        <span>
          <FormattedMessage id="all-flashcards" />
        </span>
      </button>
      <button
        type="button"
        className="flashcard-menu-item flashcard-create"
        onClick={handleCreateFlashcardClick}
      >
        <Icon name="edit outline" size="huge" style={{ paddingLeft: '0.1em' }} />
        <span style={{ paddingTop: '0.5em' }}>
          <FormattedMessage id="add-new-flashcard" />
        </span>
      </button>
    </div>
  )
}

export default FlashcardMenu
