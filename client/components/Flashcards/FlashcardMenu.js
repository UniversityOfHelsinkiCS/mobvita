import React from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { images, hiddenFeatures } from 'Utilities/common'
import SelectLanguage from './SelectLanguage'

const MenuItem = ({ handleClick, style, translationId, children }) => (
  <button
    type="button"
    className="flashcard-menu-item"
    style={style}
    onClick={handleClick}
  >
    {children}
    <span style={{ whiteSpace: 'nowrap' }}>
      <FormattedMessage id={translationId} />
    </span>
  </button>
)

const FlashcardMenu = () => {
  const { flashcardArticles } = useSelector(({ metadata }) => metadata)


  const history = useHistory()
  const { storyId } = useParams()

  const story = storyId ? `/${storyId}` : ''
  const articleLabel = flashcardArticles && flashcardArticles.join('/')

  const handleAllCardsClick = () => {
    history.push('/flashcards/fillin')
  }

  const handleFillinClick = () => {
    history.push(`/flashcards/fillin${story}`)
  }

  const handleCreateNewClick = () => {
    history.push('/flashcards/new')
  }

  const handleArticleClick = () => {
    history.push(`/flashcards/article${story}`)
  }

  const handleQuickCardsClick = () => {
    history.push(`/flashcards/quick${story}`)
  }

  const handleFlashcardListClick = () => {
    history.push(`/flashcards/list${story}`)
  }

  console.log(hiddenFeatures)

  return (
    <div className="flashcard-menu">
      <div className="flashcard-lang-select">
        <span className="padding-right-1">
          <FormattedMessage id="translation-target-language" />
        </span>
        <SelectLanguage />
      </div>
      {storyId
        && (
          <MenuItem
            handleClick={handleAllCardsClick}
            translationId="all-flashcards"
            style={{
              backgroundColor: '#B5EAD7',
              border: 'none',
            }}
          >
            <img src={images.flashcardIcon} alt="three cards" width="40px" />
          </MenuItem>
        )}
      <MenuItem
        handleClick={handleFillinClick}
        translationId="fill-in"
        style={{
          backgroundColor: '#C7CEEA',
          border: 'none',
        }}
      >
        <Icon name="keyboard outline" size="big" />
      </MenuItem>
      <div className="flex">
        <MenuItem
          handleClick={handleQuickCardsClick}
          translationId="Quick cards"
          style={{
            backgroundColor: '#fdfd96',
            border: 'none',
          }}
        >
          <Icon name="lightning" size="big" />
        </MenuItem>
        {flashcardArticles
          && (
            <button
              type="button"
              className="flashcard-menu-item"
              style={{
                backgroundColor: '#FFDAC1',
                border: 'none',
              }}
              onClick={handleArticleClick}
            >
              <Icon name="font" size="big" />
              <span>{articleLabel}</span>
            </button>
          )}
      </div>
      {hiddenFeatures
        && (
          <MenuItem
            handleClick={handleFlashcardListClick}
            translationId="Flashcard list"
            style={{
              backgroundColor: '#e1f7d5',
              border: 'none',
            }}
          >
            <Icon name="list alternate outline" size="big" style={{ paddingLeft: '0.1em' }} />
          </MenuItem>
        )
      }
      <MenuItem
        handleClick={handleCreateNewClick}
        translationId="add-new-flashcard"
        style={{
          backgroundColor: '#FFFFD8',
          borderRadius: '0 0 1em 1em',
          border: 'none',
        }}
      >
        <Icon name="edit outline" size="big" style={{ paddingLeft: '0.1em' }} />
      </MenuItem>
    </div>
  )
}

export default FlashcardMenu
