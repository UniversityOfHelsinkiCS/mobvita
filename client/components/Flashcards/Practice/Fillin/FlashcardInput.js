import React, { useState, useRef, useEffect } from 'react'
import AppTextField from 'Components/ui/AppTextField'
import AppButton from 'Components/AppButton'
import { useIntl } from 'react-intl'
import { useSelector } from 'react-redux'
import { dictionaryLanguageSelector } from 'Utilities/common'

const FlashcardInput = ({ checkAnswer, focusedAndBigScreen, answerChecked, displayedHints }) => {
  const [answer, setAnswer] = useState('')
  const intl = useIntl()
  const selectedLocale = intl.locale

  const dictionaryLanguage = useSelector(dictionaryLanguageSelector)
  const selectedLanguage = dictionaryLanguage && selectedLocale !== 'en'
    ? intl.formatMessage({ id: dictionaryLanguage }).toLowerCase()
    : intl.formatMessage({ id: dictionaryLanguage })

  const answerInput = useRef()

  // Focus the answer field when this card becomes the active one — but skip while a MUI overlay is
  // open. Dialog/Menu/Popover set aria-hidden on #root, so pulling focus back to this background
  // input triggers the "aria-hidden on an element that retained focus" warning. Runs in an effect
  // (keyed on the card being active) instead of the render body, so it doesn't spawn a timer per
  // render.
  useEffect(() => {
    if (answerChecked || !focusedAndBigScreen) return undefined
    const timer = setTimeout(() => {
      if (document.querySelector('.MuiModal-root')) return
      if (answerInput.current) answerInput.current.focus()
    }, 500)
    return () => clearTimeout(timer)
  }, [answerChecked, focusedAndBigScreen])

  if (answerChecked) return null

  const handleSubmit = e => {
    e.preventDefault()
    checkAnswer(answer, displayedHints)
    setAnswer('')
  }

  return (
    <div className="flashcard-input">
      <form onSubmit={handleSubmit}>
        <AppTextField
          inputRef={answerInput}
          value={answer}
          onChange={event => setAnswer(event.target.value)}
          placeholder={intl.formatMessage({ id: 'flashcard-input-placeholder' }, { selectedLanguage })}
          // The placeholder ("Type <language> translation here…") is long; shrink only the
          // placeholder so it fits, while the typed answer stays full size.
          sx={{ '& .MuiOutlinedInput-input::placeholder': { fontSize: 13 } }}
        />
        <AppButton
          className="flashcard-button"
          style={{ width: '100%', marginTop: '0.75em' }}
          variant="outline-primary"
          type="submit"
        >
          {intl.formatMessage({ id: 'check-answer' })}
        </AppButton>
      </form>
    </div>
  )
}

export default FlashcardInput
