import React from 'react'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'
import { images } from 'Utilities/common'
import SelectLanguage from './SelectLanguage'

const MenuItem = ({ handleClick, style, translationId, children }) => (
  <button type="button" className="flashcard-menu-item" style={style} onClick={handleClick}>
    {children}
    <span style={{ whiteSpace: 'nowrap' }}>
      <FormattedMessage id={translationId} />
    </span>
  </button>
)

const CardManagmentOptions = ({ handleOptionClick, handleOptionClickWithStory }) => {
  const { storyId } = useParams()

  return (
    <div className="flex-col pb-nm">
      <div className="flashcard-lang-select">
        <span className="pr-sm">
          <FormattedMessage id="translation-target-language" />
        </span>
        <SelectLanguage />
      </div>
      {storyId && (
        <MenuItem
          handleClick={() => handleOptionClick('all')}
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
        handleClick={() => handleOptionClickWithStory('list')}
        translationId="Flashcard list"
        style={{
          backgroundColor: '#e1f7d5',
          border: 'none',
        }}
      >
        <Icon name="list alternate outline" size="big" style={{ paddingLeft: '0.1em' }} />
      </MenuItem>
      <MenuItem
        handleClick={() => handleOptionClick('new')}
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

const PracticeModeOptions = ({ handleOptionClickWithStory }) => {
  const { flashcardArticles } = useSelector(({ metadata }) => metadata)

  const articleLabel = flashcardArticles && flashcardArticles.join(' / ')

  return (
    <div className="flex-col">
      <MenuItem
        handleClick={() => handleOptionClickWithStory('fillin')}
        translationId="fill-in"
        style={{
          backgroundColor: '#C7CEEA',
          border: 'none',
          borderRadius: '1em 1em 0 0',
        }}
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
        handleClick={() => handleOptionClickWithStory('quick')}
        translationId="Quick cards"
        style={{
          backgroundColor: '#fdfd96',
          border: 'none',
          borderRadius: '0 0 1em 1em',
        }}
      >
        <Icon name="lightning" size="big" />
      </MenuItem>
    </div>
  )
}

const FlashcardMenu = () => {
  const history = useHistory()
  const { storyId } = useParams()

  const storyUrl = storyId ? `/${storyId}` : ''

  const handleOptionClick = mode => {
    history.push(`/flashcards/${mode}`)
  }

  const handleOptionClickWithStory = mode => {
    history.push(`/flashcards/${mode}${storyUrl}`)
  }

  return (
    <div className="flashcard-menu">
      <CardManagmentOptions
        handleOptionClick={handleOptionClick}
        handleOptionClickWithStory={handleOptionClickWithStory}
      />
      <PracticeModeOptions handleOptionClickWithStory={handleOptionClickWithStory} />
    </div>
  )
}

export default FlashcardMenu
