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
    <span>
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
            <img src={images.flashcardIcon} alt="three cards" width="60px" />
          </MenuItem>
        )}
      <div
        className="flex"
        style={{ borderLeft: '1px solid whitesmoke', borderRight: '1px solid whitesmoke' }}
      >
        <MenuItem
          handleClick={handleFillinClick}
          translationId="fill-in"
          style={{
            backgroundColor: '#C7CEEA',
            border: 'none',
          }}
        >
          <Icon name="keyboard outline" size="huge" />
        </MenuItem>
        {hiddenFeatures && flashcardArticles
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
              <Icon name="font" size="huge" />
              <span>{articleLabel}</span>
            </button>
          )}
      </div>
      <MenuItem
        handleClick={handleCreateNewClick}
        translationId="add-new-flashcard"
        style={{
          backgroundColor: '#FFFFD8',
          border: '1px solid whitesmoke',
          borderTop: 'none',
          borderRadius: '0 0 1em 1em',
        }}
      >
        <Icon name="edit outline" size="huge" style={{ paddingLeft: '0.1em' }} />
      </MenuItem>
    </div>
  )
}

export default FlashcardMenu
