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

const TranslateBar = () => {
  return (
    <div className="flex-col pb-nm">
      <div className="flashcard-lang-select">
        <span className="pr-sm">
          <FormattedMessage id="translation-target-language" />
        </span>
        <SelectLanguage />
      </div>
    </div>
  )
}

const PracticeModeOptions = ({ handleOptionClick, handleOptionClickWithStory }) => {
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
          onClick={() => handleOptionClickWithStory('article')}
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
    history.push(`/flashcards/${mode}`)
  }

  const handleOptionClickWithStory = mode => {
    history.push(`/flashcards/${mode}/story${storyUrl}`)
  }

  const isPracticePage = ['fillin', 'quick', 'article'].includes(mode)

  return (
    <div className="flashcard-menu">
      <TranslateBar/>
      {isPracticePage && (
        <PracticeModeOptions
          handleOptionClick={handleOptionClick}
          handleOptionClickWithStory={handleOptionClickWithStory}
        />
      )}
    </div>
  )
}

export default FlashcardMenu
