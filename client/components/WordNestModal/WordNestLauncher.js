import React, { useEffect, useMemo, useState } from 'react'
import { Button, Popup } from 'semantic-ui-react'
import { useIntl } from 'react-intl'
import { images } from 'Utilities/common'
import WordNestModal from 'Components/WordNestModal'

const WordNestLauncher = ({
  lemma,
  translation,
  inCrossword = false,
  popupMessageId = 'explain-wordnest-modal',
  buttonStyle = {},
  divStyle = { alignSelf: 'flex-start', marginLeft: '1em' },
  buttonSize = 'mini',
  dataCy = 'nest-button',
}) => {
  const intl = useIntl()
  const [open, setOpen] = useState(false)
  const [wordToCheck, setWordToCheck] = useState('')

  const joinedTranslationLemmas = useMemo(() => {
    if (!translation || translation === 'no-clue-translation') return ''
    console.log(translation)
    if (!Array.isArray(translation)) return ''
    return translation
      .filter(t => t?.lemma)
      .map(t => t.lemma)
      .join('+')
  }, [translation])

  useEffect(() => {
    if (!inCrossword && joinedTranslationLemmas && !open) {
      setWordToCheck(joinedTranslationLemmas)
    }
  }, [inCrossword, joinedTranslationLemmas, open])

  const handleClick = () => {
    setWordToCheck(lemma)
    setOpen(true)
  }

  return (
    <>
      <Popup
        content={intl.formatMessage({ id: popupMessageId })}
        trigger={
          <div style={divStyle}>
            <Button
              style={{ padding: '5px', outline: '1px solid #ccc', ...buttonStyle }}
              size={buttonSize}
              onClick={handleClick}
              data-cy={dataCy}
            >
              <img src={images.network} alt="network icon" width="32" />
            </Button>
          </div>
        }
      />

      <WordNestModal
        wordToCheck={wordToCheck}
        setWordToCheck={setWordToCheck}
        open={open}
        setOpen={setOpen}
      />
    </>
  )
}

export default WordNestLauncher