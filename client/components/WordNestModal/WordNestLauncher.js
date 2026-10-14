import React, { useState } from 'react'
import { useIntl } from 'react-intl'
import { images } from 'Utilities/common'
import AppButton from 'Components/AppButton'
import AppIcon from 'Components/ui/AppIcon'
import WordNestModal from 'Components/WordNestModal'
import CustomTooltip from 'Components/CustomTooltip'

// Button that opens the word nest for `lemma`; owns the modal unless the caller controls it.
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
  // Optional: a custom single-colour SVG icon (painted ink) + label, used by the flashcard's green
  // "Word Nest" pill. When omitted, the button keeps its default multi-colour network icon.
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
              {/* Same grey-out filter on both, so a disabled icon dims exactly as before. */}
              {icon ? (
                <AppIcon
                  src={icon}
                  size={20}
                  style={{ filter: disabled ? 'grayscale(1) opacity(0.45)' : 'none' }}
                />
              ) : (
                <img
                  src={images.network}
                  alt=""
                  style={{
                    width: 24,
                    height: 24,
                    filter: disabled ? 'grayscale(1) opacity(0.45)' : 'none',
                  }}
                />
              )}
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