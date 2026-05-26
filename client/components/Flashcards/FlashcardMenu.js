import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { Icon, Popup } from 'semantic-ui-react'

const MenuItem = ({ active, handleClick, style, translationId, tooltip, children }) => (
  <Popup
    content={<FormattedHTMLMessage id={tooltip} />}
    trigger={
      <button
        type="button"
        className="flashcard-menu-item"
        style={{ ...style, ...(active ? { backgroundColor: '#6592f3' } : {}) }}
        onClick={handleClick}
      >
        {children}
        <span style={{ whiteSpace: 'nowrap' }}>
          <FormattedHTMLMessage id={translationId} />
        </span>
      </button>
    }
    position="top center"
  />
)

const PracticeModeOptions = ({ handleOptionClick, mode }) => {
  const { flashcardArticles } = useSelector(({ metadata }) => metadata)

  const articleLabel = flashcardArticles && flashcardArticles.join(' / ')

  return (
    <div className="flex-col flashcard-menu-items-boxshadow">
      <MenuItem
        active={mode === 'fillin'}
        handleClick={() => handleOptionClick('fillin')}
        translationId="fill-in"
        style={{
          backgroundColor: '#8ebbf9',
          borderTop: '1px solid #323841',
          borderRight: '1px solid #323841',
          borderBottom: '0',
          borderLeft: '1px solid #323841',
          borderRadius: '1em 1em 0 0',
        }}
        tooltip="flashcards-translate-cards-EXPLANATION"
      >
        <Icon name="keyboard outline" size="big" />
      </MenuItem>
      {flashcardArticles && (
        <button
          type="button"
          className="flashcard-menu-item"
          style={{
            backgroundColor: '#8ebbf9',
            borderTop: '1px solid #323841',
            borderRight: '1px solid #323841',
            borderBottom: '0',
            borderLeft: '1px solid #323841',
            ...(mode === 'article' ? { backgroundColor: '#6592f3' } : {}),
          }}
          onClick={() => handleOptionClick('article')}
        >
          <Icon name="font" size="big" />
          <span>{articleLabel}</span>
        </button>
      )}
      <MenuItem
        active={mode === 'quick'}
        handleClick={() => handleOptionClick('quick')}
        translationId="Quick cards"
        style={{
          backgroundColor: '#8ebbf9',
          border: '1px solid #323841',
          borderRadius: '0 0 1em 1em',
        }}
        tooltip="flashcards-quick-cards-EXPLANATION"
      >
        <Icon name="lightning" size="big" />
      </MenuItem>
    </div>
  )
}

const FlashcardMenu = () => {
  const navigate = useNavigate()
  const { mode, storyId } = useParams()

  const storyUrl = storyId ? `/${storyId}` : ''

  const handleOptionClick = mode => {
    const path = storyUrl ? `/flashcards/${mode}/story${storyUrl}` : `/flashcards/${mode}`

    navigate(path)
  }

  const isPracticePage = ['fillin', 'quick', 'article'].includes(mode)

  return (
    <div className="flashcard-menu">
      {isPracticePage && <PracticeModeOptions handleOptionClick={handleOptionClick} mode={mode} />}
    </div>
  )
}

export default FlashcardMenu
