import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl'
import { Icon, Popup } from 'semantic-ui-react'
import { backgroundColors, images } from 'Utilities/common'
import SelectLanguage from './SelectLanguage'

const FabOption = ({ handleClick, iconStyle, translationId, tooltip, children }) => (
  <Popup
    content={<FormattedHTMLMessage id={tooltip} />}
    trigger={
      <button type="button" onClick={handleClick} className="flashcard-fab-option gap-col-nm">
        <div className="flashcard-fab-icon" style={iconStyle}>
          {children}
        </div>
        <span className="flashcard-fab-text">
          <FormattedHTMLMessage id={translationId} />
        </span>
      </button>
    }
    position="top center"
  />
  
)

const CardManagementOptions = ({ handleOptionClick }) => {
  const { storyId } = useParams()

  return (
    <div className="gap-row-sm">
      <button type="button" className="flashcard-fab-option gap-col-nm">
        <div
          className="flashcard-fab-icon"
          style={{ paddingBottom: '0.5em', paddingRight: '0.1em' }}
        >
          <Icon name="language" style={{ margin: 'auto', padding: 0 }} />
        </div>
        <span className="flashcard-fab-text gap-col-sm">
          <span>
            <FormattedMessage id="translation-target-language" />
          </span>
          <SelectLanguage />
        </span>
      </button>
      {storyId && (
        <FabOption 
          handleClick={() => handleOptionClick('fillin')} 
          translationId="all-flashcards"
          iconStyle={{backgroundColors: 'lightpink'}}
          tooltip='flashcards-go-to-all-cards-EXPLANATION'
        >
          <img
            src={images.flashcardIcon}
            alt="three cards"
            width="16px"
            style={{ margin: 'auto' }}
          />
        </FabOption>
      )}
      <FabOption
        handleClick={() => handleOptionClick('list')}
        translationId="Flashcard list"
        iconStyle={{ paddingBottom: '0.5em', paddingRight: '0.1em' }}
        tooltip='flashcards-edit-card-list-EXPLANATION'
      >
        <Icon name="list alternate outline" style={{ margin: 'auto' }} />
      </FabOption>
      <FabOption
        handleClick={() => handleOptionClick('new')}
        translationId="add-new-flashcard"
        iconStyle={{ paddingBottom: '0.5em', paddingLeft: '0.1em' }}
        tooltip='flashcards-add-cards-EXPLANATION'
      >
        <Icon name="edit" style={{ margin: 'auto' }} />
      </FabOption>
    </div>
  )
}

const PracticeModeOptions = ({ handleOptionClick }) => {
  const { flashcardArticles } = useSelector(({ metadata }) => metadata)

  const articleLabel = flashcardArticles && flashcardArticles.join('/')

  return (
    <div className="gap-row-sm mt-nm">
      <FabOption
        handleClick={() => { handleOptionClick('fillin'); }}
        iconStyle={{
          paddingBottom: '0.4em',
          paddingRight: '0.05em',
          backgroundColor: 'rgb(199, 206, 234)',
        }}
        translationId="fill-in"
        tooltip='flashcards-translate-cards-EXPLANATION'
      >
        <Icon name="keyboard outline" style={{ margin: 'auto' }} />
      </FabOption>
      {flashcardArticles && (
        <button
          type="button"
          onClick={() => handleOptionClick('article')}
          className="flashcard-fab-option gap-col-nm"
        >
          <div
            className="flashcard-fab-icon"
            style={{ paddingBottom: '0.4em', backgroundColor: 'rgb(255, 218, 193)' }}
          >
            <Icon name="font" style={{ margin: 'auto' }} />
          </div>
          <span className="flashcard-fab-text">{articleLabel}</span>
        </button>
      )}
      <FabOption
        handleClick={() => handleOptionClick('quick')}
        iconStyle={{
          paddingBottom: '0.4em',
          paddingTop: '0.2em',
          backgroundColor: 'rgb(253, 253, 150)',
        }}
        translationId="Quick cards"
        tooltip='flashcards-quick-cards-EXPLANATION'
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

  const handleFabClick = () => {
    setOpen(!open)
  }

  const handleOptionClick = mode => {
    const path = storyId
      ? `/flashcards/${mode}/story/${storyId}`
      : `/flashcards/${mode}`

    history.push(path)
    setOpen(false)
  }

  return (
    <div className="flashcard-fab-menu">
      <button type="button" onClick={handleFabClick} className="flashcard-fab">
        <Icon name="th list" style={{ color: 'white' }} />
      </button>
      {open && (
        <div className="flex-column-reverse pb-sm slide-from-left" style={{ paddingLeft: '0.3em' }}>
          <PracticeModeOptions 
            handleOptionClick={handleOptionClick}
          />
          <CardManagementOptions
            handleOptionClick={handleOptionClick}
          />
        </div>
      )}
    </div>
  )
}

export default FloatMenu
