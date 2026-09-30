import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { images } from 'Utilities/common'
import AppButton from 'Components/AppButton'
import WordNestModal from 'Components/WordNestModal'
import CustomTooltip from 'Components/CustomTooltip'

const WordNestLauncher = ({
  lemma,
  wordNestModalOpen,
  setWordNestModalOpen,
  wordNestChosenWord,
  setWordNestChosenWord,
  popupMessageId = 'explain-wordnest-modal',
  className = '',
  buttonStyle = {},
  divStyle = { alignSelf: 'flex-start', marginLeft: '1em' },
  variant = 'tan-outline',
  dataCy = 'nest-button',
  // Optional: a custom icon + label (used by the flashcard's green "Word Nest" pill). When omitted,
  // the button keeps its default network icon so other call sites are unchanged.
  icon = null,
  label = null,
  // Callers that only make sense once something has happened (a flashcard answered, say) pass
  // false here; the button then still shows, greyed, rather than disappearing.
  disabled = false,
}) => {
  const intl = useIntl()

  const [localOpen, setLocalOpen] = useState(false)
  const [localWord, setLocalWord] = useState('')

  const isExternallyControlled =
    typeof setWordNestModalOpen === 'function' && typeof setWordNestChosenWord === 'function'

  const open = isExternallyControlled ? !!wordNestModalOpen : localOpen
  const setOpen = isExternallyControlled ? setWordNestModalOpen : setLocalOpen

  const wordToCheck = isExternallyControlled ? wordNestChosenWord : localWord
  const setWordToCheck = isExternallyControlled ? setWordNestChosenWord : setLocalWord


  const handleClick = () => {
    setWordToCheck(lemma)
    setOpen(true)
  }

  return (
    <>
      <div style={divStyle}>
        <CustomTooltip title={intl.formatMessage({ id: popupMessageId })}>
          <span style={{ display: 'inline-flex' }}>
            <AppButton
              className={className}
              variant={variant}
              size="sm"
              disabled={disabled}
              onClick={handleClick}
              data-cy={dataCy}
              sx={{ gap: '0.45em', ...buttonStyle }}
            >
              <img
                src={icon || images.network}
                alt=""
                style={{
                  width: icon ? 20 : 24,
                  height: icon ? 20 : 24,
                  // The icons are single-colour artwork with their own ink, so a filter is what
                  // greys them; `color: inherit` would not reach an <img>.
                  filter: disabled ? 'grayscale(1) opacity(0.45)' : 'none',
                }}
              />
              {label}
            </AppButton>
          </span>
        </CustomTooltip>
      </div>
      {!isExternallyControlled && (
        <WordNestModal
          wordToCheck={wordToCheck}
          setWordToCheck={setWordToCheck}
          open={open}
          setOpen={setOpen}
        />
      )}
    </>
  )
}

export default WordNestLauncher