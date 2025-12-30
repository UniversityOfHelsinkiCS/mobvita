import React, { useState } from 'react'
import { Button, Popup } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import { images } from 'Utilities/common'
import WordNestModal from 'Components/WordNestModal'

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
  buttonSize = 'mini',
  dataCy = 'nest-button',
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
        <Popup
          on="hover"
          content={intl.formatMessage({ id: popupMessageId })}
          trigger={
            <Button
              className={className}
              style={{ padding: '5px', outline: '1px solid #ccc', ...buttonStyle }}
              size={buttonSize}
              onClick={handleClick}
              data-cy={dataCy}
              type="button"
            >
              <img src={images.network} alt="network icon" width="32" />
            </Button>
          }
        />
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