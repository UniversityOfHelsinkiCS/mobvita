import React from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import { Icon, Popup } from 'semantic-ui-react'
import SelectLanguage from './SelectLanguage'

const MenuItem = ({ handleClick, style, translationId, tooltip, children }) => (
  <Popup
    content={<FormattedHTMLMessage id={tooltip} />}
    trigger={
      <button type="button" className="flashcard-menu-item" style={style} onClick={handleClick}>
        {children}
        <span style={{ whiteSpace: 'nowrap' }}>
          <FormattedHTMLMessage id={translationId} />
        </span>
      </button>
    }
    position="top center"
  />
)

const PracticeModeOptions = ({ handleOptionClick }) => {
  const { flashcardArticles } = useSelector(({ metadata }) => metadata)

  const articleLabel = flashcardArticles && flashcardArticles.join(' / ')

  return (
    <div className="flex-col flashcard-menu-items-boxshadow">
      <MenuItem
        handleClick={() => handleOptionClick('fillin')}
        translationId="fill-in"
        style={{
          backgroundColor: 'rgb(142, 187, 249)',
          border: 'none',
          borderRadius: '1em 1em 0 0',
        }}
        tooltip='flashcards-translate-cards-EXPLANATION'
      >
        <Icon name="keyboard outline" size="big" />
      </MenuItem>
      {flashcardArticles && (
        <button
          type="button"
          className="flashcard-menu-item"
          style={{
            backgroundColor: '#FFDAC1',
            border: 'none',
          }}
          onClick={() => handleOptionClick('article')}
        >
          <Icon name="font" size="big" />
          <span>{articleLabel}</span>
        </button>
      )}
      <MenuItem
        handleClick={() => handleOptionClick('quick')}
        translationId="Quick cards"
        style={{
          backgroundColor: 'rgb(255, 217, 112)',
          border: 'none',
          borderRadius: '0 0 1em 1em',
        }}
        tooltip='flashcards-quick-cards-EXPLANATION'
      >
        <Icon name="lightning" size="big" />
      </MenuItem>
    </div>
  )
}

const FlashcardMenu = () => {
  const history = useHistory()
  const { mode, storyId } = useParams()

  const storyUrl = storyId ? `/${storyId}` : ''

  const handleOptionClick = mode => {
    const path = storyUrl
      ? `/flashcards/${mode}/story${storyUrl}`
      : `/flashcards/${mode}`

    history.push(path)
  }

  const isPracticePage = ['fillin', 'quick', 'article'].includes(mode)

  return (
    <div className="flashcard-menu">
      {isPracticePage && (
        <PracticeModeOptions
          handleOptionClick={handleOptionClick}
        />
      )}
    </div>
  )
}

export default FlashcardMenu
