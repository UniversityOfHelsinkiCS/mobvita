import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { images } from 'Utilities/common'
import SelectLanguage from './SelectLanguage'

const FabOption = ({ handleClick, iconStyle, translationId, children }) => (
  <button
    type="button"
    onClick={handleClick}
    className="flashcard-fab-option gap-2"
  >
    <div
      className="flashcard-fab-icon"
      style={iconStyle}
    >
      {children}
    </div>
    <span className="flashcard-fab-text">
      <FormattedMessage id={translationId} />
    </span>
  </button>
)

const CardManagmentOptions = ({ handleOptionClick, handleOptionClickWithStory }) => {
  const { storyId } = useParams()

  return (
    <div className="gap-row-1">
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
      {storyId
        && (
          <FabOption
            handleClick={() => handleOptionClick('fillin')}
            translationId="all-flashcards"
          >
            <img
              src={images.flashcardIcon}
              alt="three cards"
              width="16px"
              style={{ margin: 'auto' }}
            />
          </FabOption>
        )
      }
      <FabOption
        handleClick={() => handleOptionClickWithStory('list')}
        translationId="Flashcard list"
        iconStyle={{ paddingBottom: '0.5em', paddingRight: '0.1em' }}
      >
        <Icon name="list alternate outline" style={{ margin: 'auto' }} />
      </FabOption>
      <FabOption
        handleClick={() => handleOptionClick('new')}
        translationId="add-new-flashcard"
        iconStyle={{ paddingBottom: '0.5em', paddingLeft: '0.1em' }}
      >
        <Icon name="edit" style={{ margin: 'auto' }} />
      </FabOption>
    </div>
  )
}

const PracticeModeOptions = ({ handleOptionClickWithStory }) => {
  const { flashcardArticles } = useSelector(({ metadata }) => metadata)

  const articleLabel = flashcardArticles && flashcardArticles.join('/')

  return (
    <div className="gap-row-1">
      <FabOption
        handleClick={() => handleOptionClickWithStory('fillin')}
        iconStyle={{
          paddingBottom: '0.4em',
          paddingRight: '0.05em',
          backgroundColor: 'rgb(199, 206, 234)',
        }}
        translationId="fill-in"
      >
        <Icon name="keyboard outline" style={{ margin: 'auto' }} />
      </FabOption>
      {flashcardArticles
        && (
          <button
            type="button"
            onClick={() => handleOptionClickWithStory('article')}
            className="flashcard-fab-option gap-2"
          >
            <div
              className="flashcard-fab-icon"
              style={{ paddingBottom: '0.4em', backgroundColor: 'rgb(255, 218, 193)' }}
            >
              <Icon name="font" style={{ margin: 'auto' }} />
            </div>
            <span className="flashcard-fab-text">{articleLabel}</span>
          </button>
        )
      }
      <FabOption
        handleClick={() => handleOptionClickWithStory('quick')}
        iconStyle={{
          paddingBottom: '0.4em',
          paddingTop: '0.2em',
          backgroundColor: 'rgb(253, 253, 150)',
        }}
        translationId="Quick cards"
      >
        <Icon name="lightning" style={{ margin: 'auto' }} />
      </FabOption>
    </div>
  )
}

const FloatMenu = () => {
  const [open, setOpen] = useState(false)

  const history = useHistory()
  const { storyId } = useParams()

  const storyUrl = storyId ? `/${storyId}` : ''

  const handleFabClick = () => {
    setOpen(!open)
  }

  const handleOptionClick = (mode) => {
    history.push(`/flashcards/${mode}`)
    setOpen(false)
  }

  const handleOptionClickWithStory = (mode) => {
    history.push(`/flashcards/${mode}${storyUrl}`)
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
            className="flex-column-reverse padding-bottom-1 gap-row-2 slide-from-left"
            style={{ paddingLeft: '0.3em' }}
          >
            <PracticeModeOptions handleOptionClickWithStory={handleOptionClickWithStory} />
            <CardManagmentOptions
              handleOptionClick={handleOptionClick}
              handleOptionClickWithStory={handleOptionClickWithStory}
            />
          </div>
        )}
    </div>
  )
}

export default FloatMenu
