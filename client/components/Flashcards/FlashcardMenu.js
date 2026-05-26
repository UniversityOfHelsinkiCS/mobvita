import FormattedHTMLMessage from 'Components/FormattedHTMLMessage'
import React from 'react'
import { useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { Icon, Popup } from 'semantic-ui-react'

const baseMenuItemStyle = {
  background: 'linear-gradient(180deg, #b8d6ff 0%, #8ebbf9 100%)',
  boxShadow:
    'inset 1px 1px 2px rgba(255, 255, 255, 0.8), inset -1px -1px 2px rgba(0, 0, 0, 0.18)',
  overflow: 'hidden',
  position: 'relative',
}

const selectedMenuItemStyle = {
  background: 'linear-gradient(180deg, #5f94e8 0%, #83b5f9 100%)',
  borderColor: '#000000',
  boxShadow:
    'inset 8px 20px 20px rgba(18, 11, 145, 0.27), inset -8px -8px 20px rgba(7, 5, 115, 0.3), inset 0 0 0 2px rgba(70, 21, 229, 0.1)',
}

const MenuItemButton = ({ active, handleClick, label, style, translationId, children }) => (
  <button
    type="button"
    aria-pressed={active}
    className={`flashcard-menu-item${active ? ' flashcard-menu-item-selected' : ''}`}
    style={{ ...baseMenuItemStyle, ...style, ...(active ? selectedMenuItemStyle : {}) }}
    onClick={handleClick}
  >
    <span style={{ display: 'inline-flex', position: 'relative', zIndex: 1 }}>
      {children}
    </span>
    <span style={{ position: 'relative', whiteSpace: 'nowrap', zIndex: 1 }}>
      {label || <FormattedHTMLMessage id={translationId} />}
    </span>
  </button>
)

const MenuItem = ({ tooltip, ...props }) => {
  if (!tooltip) return <MenuItemButton {...props} />

  return (
  <Popup
    content={<FormattedHTMLMessage id={tooltip} />}
    trigger={<MenuItemButton {...props} />}
    position="top center"
  />
  )
}

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
        <MenuItem
          active={mode === 'article'}
          handleClick={() => handleOptionClick('article')}
          label={articleLabel}
          style={{
            borderTop: '1px solid #323841',
            borderRight: '1px solid #323841',
            borderBottom: '0',
            borderLeft: '1px solid #323841',
          }}
        >
          <Icon name="font" size="big" />
        </MenuItem>
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
