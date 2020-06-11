import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
import { Icon } from 'semantic-ui-react'
import { images, hiddenFeatures } from 'Utilities/common'
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

const FloatMenu = () => {
  const [open, setOpen] = useState(false)

  const { flashcardArticles } = useSelector(({ metadata }) => metadata)

  const history = useHistory()
  const { storyId } = useParams()

  const story = storyId ? `/${storyId}` : ''
  const articleLabel = flashcardArticles && flashcardArticles.join('/')

  const handleFabClick = () => {
    setOpen(!open)
  }

  const handleAllCardsClick = () => {
    history.push('/flashcards/fillin')
    setOpen(false)
  }

  const handleFillinClick = () => {
    history.push(`/flashcards/fillin${story}`)
    setOpen(false)
  }

  const handleCreateNewClick = () => {
    history.push('/flashcards/new')
    setOpen(false)
  }

  const handleArticleClick = () => {
    history.push(`/flashcards/article${story}`)
    setOpen(false)
  }

  const handleQuickCardsClick = () => {
    history.push(`/flashcards/quick${story}`)
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
            className="flex-column-reverse padding-bottom-1 gap-row-1 slide-from-left"
            style={{ paddingLeft: '0.3em' }}
          >
            {storyId
              && (
                <FabOption
                  handleClick={handleAllCardsClick}
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
              handleClick={handleFillinClick}
              iconStyle={{ paddingBottom: '0.4em' }}
              translationId="fill-in"
            >
              <Icon name="keyboard outline" style={{ margin: 'auto' }} />
            </FabOption>
            {hiddenFeatures
              && (
                <FabOption
                  handleClick={handleQuickCardsClick}
                  iconStyle={{ paddingBottom: '0.4em', paddingTop: '0.2em' }}
                  translationId="Quick cards"
                >
                  <Icon name="lightning" style={{ margin: 'auto' }} />
                </FabOption>
              )
            }
            {flashcardArticles
              && (
                <button
                  type="button"
                  onClick={handleArticleClick}
                  className="flashcard-fab-option gap-2"
                >
                  <div
                    className="flashcard-fab-icon"
                    style={{ paddingBottom: '0.4em' }}
                  >
                    <Icon name="font" style={{ margin: 'auto' }} />
                  </div>
                  <span className="flashcard-fab-text">{articleLabel}</span>
                </button>
              )
            }
            <FabOption
              handleClick={handleCreateNewClick}
              translationId="add-new-flashcard"
              iconStyle={{ paddingBottom: '0.5em', paddingLeft: '0.1em' }}
            >
              <Icon name="edit" style={{ margin: 'auto' }} />
            </FabOption>
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
          </div>
        )}
    </div>
  )
}

export default FloatMenu
